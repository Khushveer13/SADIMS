import os
import json
import base64
import numpy as np
import tensorflow as tf
from PIL import Image
from flask import Flask, request, jsonify
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

app = Flask(__name__)

# --- 1. Load Trained MobileNetV2 CNN Model & Class Mappings ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "disease_model.keras")
CLASS_NAMES_PATH = os.path.join(BASE_DIR, "models", "class_names.json")
SOLUTIONS_PATH = os.path.join(BASE_DIR, "disease_solutions.json")

print("[ML SERVICE] Loading MobileNetV2 CNN Deep Learning Model...")
model = tf.keras.models.load_model(MODEL_PATH)
with open(CLASS_NAMES_PATH, "r") as f:
    CLASS_NAMES = json.load(f)

print(f"[ML SERVICE] Model loaded successfully! {len(CLASS_NAMES)} classes available.")

# Load Agronomic Knowledge Base
DISEASE_KNOWLEDGE = {}
if os.path.exists(SOLUTIONS_PATH):
    try:
        with open(SOLUTIONS_PATH, "r") as f:
            data = json.load(f)
            for d in data.get("diseases", []):
                DISEASE_KNOWLEDGE[d["diseaseName"].lower()] = d
    except Exception as e:
        print(f"Error loading disease_solutions.json: {e}")

# Helper: Clean Raw PlantVillage Class Name -> Human Readable Display Name
def clean_class_name(raw_name):
    clean = raw_name.replace("___", " ").replace("_", " ").replace("(maize)", "").replace("(including sour)", "").strip()
    return " ".join(clean.split())

# Helper: Find Agronomic Remedy Data
def get_agronomic_remedies(disease_name, raw_class):
    is_healthy = "healthy" in raw_class.lower()
    
    matched = None
    for k, v in DISEASE_KNOWLEDGE.items():
        if k in disease_name.lower() or disease_name.lower() in k:
            matched = v
            break

    if is_healthy or (matched and matched.get("diseaseName") == "Healthy"):
        return {
            "cause": "Optimal soil nutrients and climate conditions maintained.",
            "recommendation": "No action needed. Keep maintaining current care practices.",
            "organic_solution": "Continue organic practices: compost application, crop rotation, organic mulching.",
            "inorganic_solution": "Maintain balanced NPK fertilization as per soil test.",
            "prevention": "Continue regular monitoring, proper watering, and balanced nutrition.",
            "risk_level": "None"
        }

    if matched:
        org_str = "\n".join([f"• {s['name']} ({s['dosage']}, {s['frequency']}): {s['note']}" for s in matched.get("organicSolutions", [])])
        chem_str = "\n".join([f"• {s['name']} ({s['dosage']}, {s['frequency']}): {s['note']}" for s in matched.get("chemicalSolutions", [])])
        prev_str = "\n".join([f"• {p}" for p in matched.get("preventionTips", [])])
        return {
            "cause": matched.get("cause", "Fungal/bacterial pathogen activity detected."),
            "recommendation": matched.get("recommendation", "Apply targeted treatments immediately."),
            "organic_solution": org_str or "Apply neem oil spray (2-3 ml/L) weekly.",
            "inorganic_solution": chem_str or "Apply protective fungicide as per agricultural guidelines.",
            "prevention": prev_str or "Maintain proper crop spacing and drip irrigation.",
            "risk_level": matched.get("riskLevel", "High")
        }

    return {
        "cause": f"Infection detected on crop leaf ({disease_name}).",
        "recommendation": "Prune affected leaves, improve ventilation, and apply appropriate treatment.",
        "organic_solution": "Apply neem oil spray (2-3 ml/L) weekly. Improve spacing and ventilation.",
        "inorganic_solution": "Apply broad-spectrum protective fungicide like Mancozeb or Copper Soap.",
        "prevention": "Rotate crops annually, use certified disease-free seeds, and avoid overhead watering.",
        "risk_level": "High"
    }

# --- 2. Endpoints ---

@app.route('/', methods=['GET'])
def home():
    """Status check endpoint."""
    return "SADIMS ML Service is running. MobileNetV2 CNN disease detection model loaded successfully."

@app.route('/health', methods=['GET'])
def health():
    """Detailed health check endpoint."""
    return jsonify({
        "status": "healthy",
        "model_loaded": True,
        "model": "MobileNetV2",
        "class_count": len(CLASS_NAMES),
        "classes": CLASS_NAMES
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Real MobileNetV2 CNN Model Inference API.
    Accepts:
      - File upload via multipart/form-data ('file' or 'image')
      - JSON payload with 'image_path' string or 'image_base64' string
    """
    try:
        img_obj = None
        
        # Case A: File upload via multipart/form-data
        if 'file' in request.files:
            img_obj = Image.open(request.files['file'].stream)
        elif 'image' in request.files:
            img_obj = Image.open(request.files['image'].stream)
        # Case B: JSON or Form payload
        else:
            data = request.get_json(silent=True, force=True) or request.form or request.values or {}
            image_path = data.get('image_path') or data.get('imagePath') or ''
            image_base64 = data.get('image_base64') or data.get('imageBase64') or ''
            
            if not image_base64 and isinstance(image_path, str) and image_path.startswith("data:image"):
                if "," in image_path:
                    image_base64 = image_path.split(",", 1)[1]

            if image_base64:
                img_data = base64.b64decode(image_base64)
                import io
                img_obj = Image.open(io.BytesIO(img_data))
            elif image_path:
                clean_path = str(image_path).strip('"\'').strip()
                norm_path = os.path.normpath(clean_path)
                if os.path.exists(norm_path):
                    img_obj = Image.open(norm_path)
                elif os.path.exists(clean_path):
                    img_obj = Image.open(clean_path)
                else:
                    rel_path = os.path.join(BASE_DIR, "..", "frontend", clean_path.lstrip('/\\'))
                    if os.path.exists(rel_path):
                        img_obj = Image.open(rel_path)

        if img_obj is None:
            return jsonify({
                "success": False,
                "error": "Invalid or missing image file. Please upload a clear leaf image (JPG, PNG, WEBP)."
            }), 400

        # Step 1: Preprocess Image for MobileNetV2 (224x224 RGB)
        img_rgb = img_obj.convert('RGB').resize((224, 224))
        img_arr = np.expand_dims(np.array(img_rgb, dtype=np.float32), axis=0)
        img_preprocessed = preprocess_input(img_arr)

        # Step 2: Run Real MobileNetV2 Model Inference
        probs = model.predict(img_preprocessed, verbose=0)[0]
        sorted_probs = np.sort(probs)[::-1]
        top1_prob = float(sorted_probs[0])
        top2_prob = float(sorted_probs[1]) if len(sorted_probs) > 1 else 0.0
        prob_gap = top1_prob - top2_prob

        top_idx = int(np.argmax(probs))
        confidence_percent = float(top1_prob * 100.0)
        raw_class = CLASS_NAMES[top_idx]
        disease_display = clean_class_name(raw_class)

        # Step 3: Low Confidence & Out-Of-Distribution Thresholding
        # Require top-1 confidence >= 90.0% and probability gap >= 0.80 to ensure unambiguous classification
        CONFIDENCE_THRESHOLD = 90.0
        GAP_THRESHOLD = 0.80

        if confidence_percent < CONFIDENCE_THRESHOLD or prob_gap < GAP_THRESHOLD:
            return jsonify({
                "success": True,
                "disease": "Uncertain",
                "confidence": round(confidence_percent, 2),
                "confidence_percent": round(confidence_percent, 2),
                "status": "LOW_CONFIDENCE",
                "message": "The uploaded image could not be classified confidently. Please upload a clear leaf image of a supported crop.",
                "cause": "Model prediction probability was below the required confidence threshold.",
                "recommendation": "Ensure the leaf photo is taken close up, well-lit, and free of heavy shadows.",
                "organic_solution": "N/A",
                "inorganic_solution": "N/A",
                "prevention": "N/A",
                "risk_level": "Unknown"
            })

        # Step 4: High Confidence Real Model Result
        remedies = get_agronomic_remedies(disease_display, raw_class)
        is_healthy = "healthy" in raw_class.lower()

        return jsonify({
            "success": True,
            "disease": disease_display,
            "raw_class": raw_class,
            "confidence": round(confidence_percent, 2),
            "confidence_percent": round(confidence_percent, 2),
            "status": "HEALTHY" if is_healthy else "DISEASED",
            "cause": remedies["cause"],
            "recommendation": remedies["recommendation"],
            "organic_solution": remedies["organic_solution"],
            "inorganic_solution": remedies["inorganic_solution"],
            "prevention": remedies["prevention"],
            "risk_level": remedies["risk_level"]
        })

    except Exception as e:
        print(f"Error during CNN prediction: {e}")
        return jsonify({
            "success": False,
            "error": f"Model inference error: {str(e)}"
        }), 500

if __name__ == '__main__':
    print("Starting SADIMS Flask ML Service on port 5000...")
    app.run(host='0.0.0.0', port=5000, debug=False)
