package com.sadims.service;

import com.sadims.dto.ChemicalSolution;
import com.sadims.dto.DiseaseData;
import com.sadims.dto.OrganicSolution;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DiseaseSolutionDataService {

    private final Map<String, DiseaseData> diseaseDatabase;

    public DiseaseSolutionDataService() {
        this.diseaseDatabase = new HashMap<>();
        initializeDatabase();
    }

    private void initializeDatabase() {
        // Leaf Rust
        diseaseDatabase.put("Leaf Rust", new DiseaseData(
                "Leaf Rust",
                "Caused by fungal spores that thrive in high humidity and poor air circulation.",
                "Monitor drainage and reduce watering. Apply appropriate fungicides.",
                Arrays.asList(
                        new OrganicSolution("Neem Oil Spray", "2-3 ml per liter of water", "2-3 times weekly",
                                "Eco-friendly. Apply in early morning or evening to avoid leaf burn."),
                        new OrganicSolution("Garlic-Based Organic Fungicide", "50g crushed garlic per liter",
                                "Once every 5 days",
                                "Natural antifungal properties. Strain before spraying."),
                        new OrganicSolution("Copper Soap Fungicide (Organic)", "As per manufacturer instructions",
                                "Every 7-10 days",
                                "OMRI certified. Safe for organic farming.")),
                Arrays.asList(
                        new ChemicalSolution("Mancozeb 75% WP", "2g per liter of water", "Every 10-15 days",
                                "Wear protective gloves and mask. Do not spray during flowering."),
                        new ChemicalSolution("Propiconazole 25% EC", "1ml per liter of water", "Every 14 days",
                                "Systemic fungicide. Follow PHI (Pre-Harvest Interval) of 7 days."),
                        new ChemicalSolution("Bordeaux Mixture", "5g per liter of water", "Every 10 days",
                                "Traditional copper-based fungicide. Avoid during hot weather.")),
                Arrays.asList(
                        "Plant resistant varieties suitable for your climate",
                        "Ensure proper spacing (30-45cm) between plants for air circulation",
                        "Avoid overhead watering; use drip irrigation instead",
                        "Water early in the day to allow foliage to dry",
                        "Remove plant debris regularly and compost away from crops",
                        "Practice 2-3 year crop rotation",
                        "Apply balanced fertilization to strengthen plant immunity"),
                "High"));

        // Powdery Mildew
        diseaseDatabase.put("Powdery Mildew", new DiseaseData(
                "Powdery Mildew",
                "Result of excess moisture on leaves combined with warm, stagnant air.",
                "Prune infected leaves immediately. Increase air circulation.",
                Arrays.asList(
                        new OrganicSolution("Baking Soda Solution",
                                "1 tablespoon per gallon (4 liters) + few drops dish soap", "Every 3-5 days",
                                "Safe and effective. Soap helps solution stick to leaves."),
                        new OrganicSolution("Milk Spray", "40% milk, 60% water mixture", "Twice weekly",
                                "Natural antifungal. Use fresh milk for best results."),
                        new OrganicSolution("Sulfur-Based Organic Fungicide", "As per product label", "Every 7 days",
                                "Do not apply when temperature exceeds 32°C (90°F).")),
                Arrays.asList(
                        new ChemicalSolution("Myclobutanil 10% WP", "0.5g per liter of water", "Every 10-14 days",
                                "Systemic action. Wear protective equipment during application."),
                        new ChemicalSolution("Trifloxystrobin 25% + Tebuconazole 50% WG", "0.4g per liter of water",
                                "Every 14 days",
                                "Broad-spectrum fungicide. PHI: 3 days."),
                        new ChemicalSolution("Potassium Bicarbonate", "5g per liter of water", "Weekly",
                                "Less toxic alternative. Can be used close to harvest.")),
                Arrays.asList(
                        "Choose resistant varieties for your region",
                        "Provide adequate spacing (40-50cm) for air flow",
                        "Avoid excessive nitrogen fertilization which promotes soft growth",
                        "Water at soil level, never on leaves",
                        "Prune to improve light penetration and air movement",
                        "Remove infected leaves immediately and destroy",
                        "Maintain soil pH between 6.0-7.0 for optimal plant health"),
                "Medium"));

        // Blight
        diseaseDatabase.put("Blight", new DiseaseData(
                "Blight",
                "Bacterial or fungal infection often spread by wind and rain in early spring.",
                "Remove affected plants immediately. Rotate crops next season.",
                Arrays.asList(
                        new OrganicSolution("Copper-Based Organic Bactericide", "2-3g per liter of water",
                                "Every 5-7 days",
                                "OMRI listed. Apply preventively before disease appears."),
                        new OrganicSolution("Bacillus subtilis Biofungicide", "As per manufacturer (typically 2ml/L)",
                                "Every 7-10 days",
                                "Beneficial bacteria. Safe for beneficial insects."),
                        new OrganicSolution("Compost Tea", "Dilute 1:5 with water", "Weekly as foliar spray",
                                "Boosts plant immunity. Use well-aerated compost tea only.")),
                Arrays.asList(
                        new ChemicalSolution("Copper Hydroxide 77% WP", "3g per liter of water", "Every 7-10 days",
                                "Protective fungicide. Wear mask and gloves during application."),
                        new ChemicalSolution("Streptomycin Sulfate (for bacterial blight)", "200 ppm solution",
                                "Every 5 days during infection",
                                "Antibiotic. Use only when necessary. PHI: 14 days."),
                        new ChemicalSolution("Chlorothalonil 75% WP", "2g per liter of water", "Every 10 days",
                                "Broad-spectrum. Do not mix with other pesticides."),
                        new ChemicalSolution("Mancozeb 75% WP (Preventive)", "2.5g per liter of water",
                                "Every 10-14 days",
                                "Start before disease appears. PHI: 7 days.")),
                Arrays.asList(
                        "Use only certified disease-free seeds and transplants",
                        "Practice 3-4 year crop rotation with non-host crops",
                        "Avoid working with plants when foliage is wet",
                        "Sanitize all tools with 10% bleach solution between plants",
                        "Remove and destroy volunteer plants immediately",
                        "Apply organic mulch to prevent soil splash onto leaves",
                        "Maintain proper plant nutrition with balanced fertilizers",
                        "Install drip irrigation to keep foliage dry",
                        "Remove crop residues immediately after harvest"),
                "Critical"));

        // Tomato Early Blight
        diseaseDatabase.put("Tomato Early Blight", new DiseaseData(
                "Tomato Early Blight",
                "Fungal disease caused by Alternaria solani, thriving in warm, humid weather.",
                "Remove lower affected leaves, improve air flow, and apply fungicide.",
                Arrays.asList(
                        new OrganicSolution("Copper Fungicide", "2-3 ml per liter of water", "Weekly",
                                "Organic copper-based sprays are effective early on."),
                        new OrganicSolution("Compost Tea", "Dilute 1:5 with water", "Every 5-7 days",
                                "Improves plant immunity and coats leaves with beneficial microbes.")),
                Arrays.asList(
                        new ChemicalSolution("Chlorothalonil 75% WP", "2g per liter of water", "Every 7-10 days",
                                "Preventative fungicide, do not apply during extreme heat."),
                        new ChemicalSolution("Mancozeb 75% WP", "2.5g per liter of water", "Every 7-10 days",
                                "Broad-spectrum contact fungicide.")),
                Arrays.asList(
                        "Rotate crops (do not plant tomatoes in the same spot for 3-4 years)",
                        "Provide adequate spacing for air circulation",
                        "Mulch around the base of the plant to prevent soil splash",
                        "Stake or cage plants to keep foliage off the ground"),
                "High"));

        // Potato Late Blight
        diseaseDatabase.put("Potato Late Blight", new DiseaseData(
                "Potato Late Blight",
                "Caused by the water mold Phytophthora infestans.",
                "Destroy infected plants immediately to prevent rapid spread.",
                Arrays.asList(
                        new OrganicSolution("Copper Hydroxide", "3g per liter of water", "Every 5-7 days",
                                "Only effective as a preventative, must be applied before infection takes hold.")),
                Arrays.asList(
                        new ChemicalSolution("Metalaxyl/Mancozeb mix", "2.5g per liter", "Every 10-14 days",
                                "Systemic and contact action to halt spread."),
                        new ChemicalSolution("Chlorothalonil", "2ml per liter", "Weekly",
                                "Broad-spectrum protectant.")),
                Arrays.asList(
                        "Plant certified disease-free seed potatoes",
                        "Destroy cull piles (volunteer potatoes)",
                        "Avoid overhead irrigation",
                        "Harvest during dry weather"),
                "Critical"));

        // Wheat Rust
        diseaseDatabase.put("Wheat Rust", new DiseaseData(
                "Wheat Rust",
                "Fungal spores spread by wind, favored by moisture and mild temperatures.",
                "Apply appropriate fungicides and monitor field closely.",
                Arrays.asList(
                        new OrganicSolution("Sulfur Dust", "As per label", "Every 7-10 days",
                                "Effective mainly as a preventative measure.")),
                Arrays.asList(
                        new ChemicalSolution("Tebuconazole 25% EC", "1ml per liter", "At earliest sign of rust",
                                "Systemic fungicide very effective against rusts."),
                        new ChemicalSolution("Propiconazole 25% EC", "1ml per liter", "At appearance of first pustules",
                                "Provides curative and protective action.")),
                Arrays.asList(
                        "Plant rust-resistant wheat varieties",
                        "Eradicate alternative host plants (like barberry for stem rust)",
                        "Eliminate volunteer wheat before planting season",
                        "Avoid excessively dense planting"),
                "High"));

        // Rice Blast
        diseaseDatabase.put("Rice Blast", new DiseaseData(
                "Rice Blast",
                "Fungal disease caused by Magnaporthe oryzae under high humidity and excessive nitrogen.",
                "Manage water levels closely and avoid excessive nitrogen application.",
                Arrays.asList(
                        new OrganicSolution("Bacillus subtilis Biofungicide", "2-3ml per liter", "Every 10 dates",
                                "Competitive inhibition of the blast fungus."),
                        new OrganicSolution("Silicon soil amendments", "As per package", "Applied at planting",
                                "Strengthens plant cell walls against fungal penetration.")),
                Arrays.asList(
                        new ChemicalSolution("Tricyclazole 75% WP", "0.6g per liter", "At heading stage",
                                "Specifically targets rice blast."),
                        new ChemicalSolution("Isoprothiolane 40% EC", "1.5ml per liter", "Early infection stage",
                                "Systemic action against blast.")),
                Arrays.asList(
                        "Burn or plow under infected crop residues",
                        "Avoid excessive nitrogen fertilization",
                        "Use resistant seed varieties",
                        "Maintain proper flood levels in paddies"),
                "Critical"));

        // Corn Common Rust
        diseaseDatabase.put("Corn Common Rust", new DiseaseData(
                "Corn Common Rust",
                "Fungus Puccinia sorghi, favored by cool, moist weather.",
                "Usually doesn't require treatment unless infection is severe early in the season.",
                Arrays.asList(
                        new OrganicSolution("Monitor and Remove", "N/A", "Regularly",
                                "Often not severe enough to warrant organic sprays. Remove heavily infected lower leaves if feasible.")),
                Arrays.asList(
                        new ChemicalSolution("Azoxystrobin + Propiconazole", "1ml per liter", "Before tasseling if severe",
                                "Foliar fungicide application if significant leaf area is covered.")),
                Arrays.asList(
                        "Use rust-resistant corn hybrids",
                        "Plant early to avoid peak late-season spore loads"),
                "Medium"));

        // Apple Scab
        diseaseDatabase.put("Apple Scab", new DiseaseData(
                "Apple Scab",
                "Venturia inaequalis fungi overwintering in fallen leaves.",
                "Apply protective fungicide sprays in early spring.",
                Arrays.asList(
                        new OrganicSolution("Liquid Lime-Sulfur", "Follow specific label for dormancy/green tip", "Early spring",
                                "Applying at green tip stage significantly reduces primary infection."),
                        new OrganicSolution("Neem Oil", "10ml per liter", "Every 7-10 days",
                                "Apply after petal fall, never mix with sulfur.")),
                Arrays.asList(
                        new ChemicalSolution("Captan 50% WP", "2.5g per liter", "Every 7-14 days",
                                "Start at green tip stage, do not use with oils."),
                        new ChemicalSolution("Myclobutanil", "0.5g per liter", "Post-infection within 96 hours",
                                "Has strong curative properties.")),
                Arrays.asList(
                        "Rake up and destroy fallen leaves in autumn",
                        "Prune trees to open the canopy for better air circulation and sunlight",
                        "Plant scab-resistant varieties (e.g., Liberty, Honeycrisp)"),
                "High"));

        // Grape Black Rot
        diseaseDatabase.put("Grape Black Rot", new DiseaseData(
                "Grape Black Rot",
                "Fungus Guignardia bidwellii affecting warm, humid regions.",
                "Prune vines effectively to improve ventilation and sunshine penetration.",
                Arrays.asList(
                        new OrganicSolution("Liquid Copper Fungicide", "As per label", "Every 7-10 days",
                                "Apply starting at 2-3 inch shoot growth until véraison.")),
                Arrays.asList(
                        new ChemicalSolution("Mancozeb", "2g per liter", "At early bloom and post-bloom",
                                "Highly effective protectant against black rot."),
                        new ChemicalSolution("Myclobutanil", "0.5g per liter", "Every 14 days",
                                "Excellent systemic action against both black rot and powdery mildew.")),
                Arrays.asList(
                        "Destroy mummified fruit left on vines or ground during winter",
                        "Maintain strict vineyard sanitation",
                        "Implement strategic pruning to open the canopy",
                        "Keep grass and weeds mowed short under vines to lower humidity"),
                "Critical"));

        // Unhealthy leaf
        DiseaseData unhealthyData = new DiseaseData(
                "Unhealthy leaf",
                "General signs of disease, stress, or nutritional deficiency detected, exact pathogen unclear.",
                "Isolate plant if possible, ensure proper watering, check soil conditions, and monitor closely.",
                Arrays.asList(
                        new OrganicSolution("Neem Oil Spray", "2-3 ml per liter of water", "Weekly",
                                "Broad-spectrum organic control for insect pests and early fungal issues."),
                        new OrganicSolution("Compost Tea", "Dilute 1:5 with water", "Weekly foliar spray",
                                "Boosts plant immunity and introduces beneficial microbes.")),
                Arrays.asList(
                        new ChemicalSolution("Broad-spectrum Fungicide/Bactericide", "As per product label", "As needed",
                                "Apply carefully as a preventive measure following all safety guidelines."),
                        new ChemicalSolution("Balanced NPK Fertilizer (19:19:19)", "2-3g per liter of water", "Once to test response",
                                "To rule out primary nutritional deficiencies.")),
                Arrays.asList(
                        "Maintain strict sanitation and remove any dead or heavily spotted foliage",
                        "Ensure adequate air circulation and appropriate sunlight exposure",
                        "Avoid overhead watering to keep foliage dry",
                        "Monitor daily for more specific symptoms like distinct spots, discoloration, or pests",
                        "Check soil pH and moisture levels"),
                "Medium");
        diseaseDatabase.put("Unhealthy leaf", unhealthyData);
        diseaseDatabase.put("Unhealthy", unhealthyData);

        // Healthy
        diseaseDatabase.put("Healthy", new DiseaseData(
                "Healthy",
                "Optimal soil nutrients and climate conditions maintained.",
                "No action needed. Keep maintaining current care practices.",
                Arrays.asList(
                        new OrganicSolution("Compost Application", "2-3 kg per square meter", "Every 3-4 months",
                                "Maintains soil health and beneficial microbes."),
                        new OrganicSolution("Organic Mulch", "5-7 cm layer around plants", "Replenish as needed",
                                "Conserves moisture and suppresses weeds naturally."),
                        new OrganicSolution("Seaweed Extract", "2ml per liter of water", "Monthly foliar spray",
                                "Boosts plant immunity and stress tolerance.")),
                Arrays.asList(
                        new ChemicalSolution("Balanced NPK Fertilizer (19:19:19)", "5g per liter of water",
                                "Every 15 days during growth",
                                "Adjust based on soil test results."),
                        new ChemicalSolution("Micronutrient Mix (Zn, Fe, Mn, B)", "As per soil test recommendations",
                                "Once every 2 months",
                                "Apply only if deficiency is confirmed through testing.")),
                Arrays.asList(
                        "Continue regular monitoring for early disease detection",
                        "Maintain proper watering schedule based on crop needs",
                        "Keep balanced nutrition through soil testing every 6 months",
                        "Practice integrated pest management (IPM)",
                        "Maintain soil pH between 6.0-7.0 for most crops",
                        "Ensure good drainage to prevent waterlogging",
                        "Rotate crops annually to prevent soil depletion",
                        "Keep farm records for better decision making"),
                "None"));
    }

    /**
     * Get disease data by disease name
     */
    public DiseaseData getDiseaseData(String diseaseName) {
        return diseaseDatabase.get(diseaseName);
    }

    /**
     * Get all available diseases
     */
    public Collection<DiseaseData> getAllDiseases() {
        return diseaseDatabase.values();
    }

    /**
     * Check if disease exists in database
     */
    public boolean diseaseExists(String diseaseName) {
        return diseaseDatabase.containsKey(diseaseName);
    }
}
