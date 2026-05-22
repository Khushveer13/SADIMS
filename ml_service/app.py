from flask import Flask, request, jsonify
import random
import time

app = Flask(__name__)

# --- 1. Knowledge Base (The Logic) ---
# Instead of a complex Neural Network, we use a predefined knowledge base 
# suitable for a minor project demonstration.

DISEASE_CLASSES = [
    {
        "name": "Leaf Rust",
        "cause": "Caused by fungal spores that thrive in high humidity and poor air circulation.",
        "recommendation": "Monitor drainage and reduce watering. Apply fungicide X.",
        "organic_solution": "Apply neem oil spray (2-3 times weekly). Use garlic-based organic fungicide. Improve air circulation by proper spacing. Remove infected leaves and compost them away from crops.",
        "inorganic_solution": "Apply copper-based fungicide (Bordeaux mixture) or systemic fungicides like Propiconazole. Spray Mancozeb 75% WP at 2g/liter water every 10-15 days.",
        "prevention": "Plant resistant varieties. Ensure proper spacing between plants. Avoid overhead watering. Water early in the day. Remove plant debris regularly. Practice crop rotation.",
        "risk_level": "High"
    },
    {
        "name": "Powdery Mildew",
        "cause": "Result of excess moisture on leaves combined with warm, stagnant air.",
        "recommendation": "Prune infected leaves immediately. Increase air circulation.",
        "organic_solution": "Spray baking soda solution (1 tablespoon per gallon of water with a few drops of dish soap). Use milk spray (40% milk, 60% water). Apply sulfur-based organic fungicides.",
        "inorganic_solution": "Use systemic fungicides like Myclobutanil or Trifloxystrobin. Apply Sulfur dust or wettable sulfur. Spray Potassium bicarbonate-based products.",
        "prevention": "Choose resistant varieties. Provide adequate spacing for air flow. Avoid excessive nitrogen fertilization. Water at soil level, not on leaves. Prune to improve light penetration.",
        "risk_level": "Medium"
    },
    {
        "name": "Blight",
        "cause": "Bacterial infection often spread by wind and rain in early spring.",
        "recommendation": "Remove affected plants. Rotate crops next season.",
        "organic_solution": "Remove and destroy infected plant parts immediately. Apply copper-based organic bactericides. Use compost tea to boost plant immunity. Spray with beneficial bacteria (Bacillus subtilis).",
        "inorganic_solution": "Apply copper hydroxide or copper sulfate sprays. Use streptomycin sulfate for bacterial blight. Apply chlorothalonil-based fungicides for fungal blight. Spray Mancozeb preventively.",
        "prevention": "Use certified disease-free seeds. Practice 3-4 year crop rotation. Avoid working with plants when wet. Sanitize tools between plants. Remove volunteer plants. Mulch to prevent soil splash.",
        "risk_level": "Critical"
    },
    {
        "name": "Healthy",
        "cause": "Optimal soil nutrients and climate conditions maintained.",
        "recommendation": "No action needed. Keep maintaining current care.",
        "organic_solution": "Continue organic practices: compost application, crop rotation, companion planting. Use organic mulch to maintain soil health.",
        "inorganic_solution": "Maintain balanced NPK fertilization as per soil test. Apply micronutrient supplements if needed.",
        "prevention": "Continue current best practices: regular monitoring, proper watering schedule, balanced nutrition, and integrated pest management. Maintain soil pH between 6.0-7.0.",
        "risk_level": "None"
    },
    {
        "name": "Tomato Early Blight",
        "cause": "Fungal disease caused by Alternaria solani, thriving in warm, humid weather.",
        "recommendation": "Remove lower affected leaves, improve air flow, and apply fungicide.",
        "organic_solution": "Use copper-based organic fungicides. Apply compost tea.",
        "inorganic_solution": "Apply Chlorothalonil or Mancozeb-based fungicides every 7-10 days.",
        "prevention": "Rotate crops, space plants, mulch to prevent soil splashing.",
        "risk_level": "High"
    },
    {
        "name": "Potato Late Blight",
        "cause": "Caused by the water mold Phytophthora infestans.",
        "recommendation": "Destroy infected plants immediately to prevent rapid spread.",
        "organic_solution": "Apply copper sprays as a preventative measure.",
        "inorganic_solution": "Use systemic fungicides like Metalaxyl or protectants like Chlorothalonil.",
        "prevention": "Plant certified seed potatoes, eliminate cull piles, and avoid overhead irrigation.",
        "risk_level": "Critical"
    },
    {
        "name": "Wheat Rust",
        "cause": "Fungal spores spread by wind, favored by moisture and mild temperatures.",
        "recommendation": "Apply appropriate fungicides and monitor field closely.",
        "organic_solution": "Plant rust-resistant varieties and ensure fields are cleared of volunteer wheat.",
        "inorganic_solution": "Apply systemic fungicides like Tebuconazole or Propiconazole at early signs.",
        "prevention": "Use resistant varieties and eradicate alternative host plants like barberry.",
        "risk_level": "High"
    },
    {
        "name": "Rice Blast",
        "cause": "Fungal disease caused by Magnaporthe oryzae under high humidity and excessive nitrogen.",
        "recommendation": "Manage water levels closely and avoid excessive nitrogen application.",
        "organic_solution": "Apply biofungicides containing Bacillus or Pseudomonas, silicon soil amendments.",
        "inorganic_solution": "Apply Tricyclazole or Isoprothiolane at the heading stage.",
        "prevention": "Burn infected crop residues, avoid excess nitrogen, use resistant seed varieties.",
        "risk_level": "Critical"
    },
    {
        "name": "Corn Common Rust",
        "cause": "Fungus Puccinia sorghi, favored by cool, moist weather.",
        "recommendation": "Usually doesn't require treatment unless infection is severe early in the season.",
        "organic_solution": "Plant resistant hybrids, mostly a preventive approach.",
        "inorganic_solution": "Foliar fungicide application if significant leaf area is covered before tasseling.",
        "prevention": "Use rust-resistant corn hybrids.",
        "risk_level": "Medium"
    },
    {
        "name": "Apple Scab",
        "cause": "Venturia inaequalis fungi overwintering in fallen leaves.",
        "recommendation": "Apply protective fungicide sprays in early spring.",
        "organic_solution": "Apply sulfur or lime-sulfur sprays during early bud break.",
        "inorganic_solution": "Apply Captan or Myclobutanil preventively.",
        "prevention": "Rake up and destroy fallen leaves, prune trees for better air circulation.",
        "risk_level": "High"
    },
    {
        "name": "Grape Black Rot",
        "cause": "Fungus Guignardia bidwellii affecting warm, humid regions.",
        "recommendation": "Prune vines effectively to improve ventilation and sunshine penetration.",
        "organic_solution": "Apply liquid copper fungicide every 7-10 days until harvest.",
        "inorganic_solution": "Spray Mancozeb or Myclobutanil at early bloom and post-bloom.",
        "prevention": "Destroy mummified fruit, strict vineyard sanitation, strategic pruning.",
        "risk_level": "Critical"
    }
]

# --- 2. API Endpoints ---

@app.route('/', methods=['GET'])
def home():
    """Status check endpoint."""
    return "SADIMS ML Service is Running (Dummy Logic Active)."

@app.route('/predict', methods=['POST'])
def predict():
    """
    Simulates image analysis.
    Input: Accepts 'image' file or 'image_path' string.
    Process: Randomly selects a disease from the list.
    Output: JSON with disease, confidence, and recommendation.
    """
    
    # Simulate processing time (as if a deep learning model is running)
    time.sleep(1.5) 
    
    # LOGIC: Random Selection
    # In a real system, this would be: model.predict(image)
    prediction = random.choice(DISEASE_CLASSES)
    
    # Generate a realistic-looking confidence score (e.g., 85% to 99%)
    confidence = round(random.uniform(85.0, 99.9), 2)
    
    return jsonify({
        "disease": prediction["name"],
        "confidence": confidence,
        "cause": prediction["cause"],
        "recommendation": prediction["recommendation"],
        "organic_solution": prediction["organic_solution"],
        "inorganic_solution": prediction["inorganic_solution"],
        "prevention": prediction["prevention"],
        "risk_level": prediction["risk_level"]
    })

if __name__ == '__main__':
    app.run(port=5000, debug=True)
