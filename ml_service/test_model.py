import os
import json
import numpy as np
import tensorflow as tf
from PIL import Image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "disease_model.keras")
CLASS_NAMES_PATH = os.path.join(MODEL_DIR, "class_names.json")
DATASET_PATH = r"C:\Users\Dell\Downloads\archive\plantvillage dataset\color"

def main():
    print("=" * 60)
    print("[INDEPENDENT MODEL TEST] (Testing CNN on Real PlantVillage Images)")
    print("=" * 60)

    if not os.path.exists(MODEL_PATH) or not os.path.exists(CLASS_NAMES_PATH):
        raise FileNotFoundError("Model or class_names.json missing!")

    model = tf.keras.models.load_model(MODEL_PATH)
    with open(CLASS_NAMES_PATH, "r") as f:
        class_names = json.load(f)

    # Pick representative test images across various classes
    sample_classes = [
        "Apple___Apple_scab",
        "Apple___healthy",
        "Corn_(maize)___Common_rust_",
        "Corn_(maize)___healthy",
        "Grape___Black_rot",
        "Potato___Early_blight",
        "Potato___Late_blight",
        "Potato___healthy",
        "Tomato___Early_blight",
        "Tomato___Late_blight",
        "Tomato___healthy"
    ]

    correct_count = 0
    total_count = 0
    test_results = []

    for cls in sample_classes:
        folder = os.path.join(DATASET_PATH, cls)
        if not os.path.exists(folder):
            continue
        files = [f for f in os.listdir(folder) if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp'))]
        if not files:
            continue
        
        # Pick 2 sample images per class
        for img_name in files[:2]:
            img_path = os.path.join(folder, img_name)
            img = Image.open(img_path).convert('RGB').resize((224, 224))
            img_arr = np.expand_dims(np.array(img, dtype=np.float32), axis=0)
            img_preprocessed = preprocess_input(img_arr)

            probs = model.predict(img_preprocessed, verbose=0)[0]
            pred_idx = np.argmax(probs)
            pred_class = class_names[pred_idx]
            confidence = float(probs[pred_idx] * 100.0)

            is_correct = (pred_class == cls)
            if is_correct:
                correct_count += 1
            total_count += 1

            result = {
                "image": img_name,
                "expected_class": cls,
                "predicted_class": pred_class,
                "confidence_percent": round(confidence, 2),
                "is_correct": is_correct
            }
            test_results.append(result)

            status_str = "CORRECT" if is_correct else "INCORRECT"
            print(f"Image: {img_name[:25]}... | Expected: {cls} | Predicted: {pred_class} | Confidence: {confidence:.2f}% | Status: {status_str}")

    acc = (correct_count / total_count * 100.0) if total_count > 0 else 0
    print("=" * 60)
    print(f"FINAL INDEPENDENT TEST ACCURACY: {acc:.2f}% ({correct_count}/{total_count} correct)")
    print("=" * 60)

    with open(os.path.join(MODEL_DIR, "sample_test_results.json"), "w") as f:
        json.dump({
            "test_accuracy": round(acc, 2),
            "total_tested": total_count,
            "correct_predictions": correct_count,
            "results": test_results
        }, f, indent=4)

if __name__ == "__main__":
    main()
