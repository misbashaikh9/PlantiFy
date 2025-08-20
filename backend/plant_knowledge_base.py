#!/usr/bin/env python3
"""
Comprehensive Plant Care Knowledge Base
Contains detailed information about plants, care, diseases, and treatments
"""

class PlantKnowledgeBase:
    """Centralized knowledge base for all plant care information"""
    
    def __init__(self):
        self.plants = {
            "Monstera": {
                "common_names": ["Swiss Cheese Plant", "Split-Leaf Philodendron"],
                "care": {
                    "watering": "Water when top 2-3 inches of soil feel dry. Monstera likes consistently moist but not soggy soil.",
                    "light": "Bright, indirect light. Can tolerate some direct morning sun but avoid harsh afternoon sun.",
                    "temperature": "65-80°F (18-27°C). Avoid temperatures below 60°F (15°C).",
                    "humidity": "High humidity (60-80%). Mist leaves regularly or use a humidifier.",
                    "soil": "Well-draining potting mix with perlite or orchid bark for aeration."
                },
                "fertilizer": {
                    "type": "Balanced 20-20-20 or 10-10-10",
                    "frequency": "Monthly during spring and summer, every 6-8 weeks in fall, none in winter",
                    "application": "Dilute to half strength and apply to moist soil",
                    "special_notes": "Monstera is a heavy feeder during growing season"
                },
                "repotting": {
                    "frequency": "Every 1-2 years",
                    "best_time": "Spring or early summer",
                    "signs": "Roots coming out of drainage holes, plant dries out quickly, slow growth",
                    "soil_mix": "Well-draining potting mix with added perlite and orchid bark"
                },
                "common_problems": {
                    "yellow_leaves": "Usually overwatering. Let soil dry more between waterings.",
                    "brown_edges": "Low humidity or underwatering. Increase humidity and check soil moisture.",
                    "no_splits": "Insufficient light. Move to brighter location.",
                    "root_rot": "Overwatering. Repot in fresh soil and reduce watering frequency."
                }
            },
            
            "Snake Plant": {
                "common_names": ["Mother-in-Law's Tongue", "Sansevieria"],
                "care": {
                    "watering": "Water sparingly - only when soil is completely dry. Can go 2-3 weeks between waterings.",
                    "light": "Low to bright indirect light. Very tolerant of low light conditions.",
                    "temperature": "60-75°F (15-24°C). Can tolerate temperatures as low as 50°F (10°C).",
                    "humidity": "Low humidity tolerant. No special humidity requirements.",
                    "soil": "Well-draining cactus or succulent mix. Prefers sandy, well-aerated soil."
                },
                "fertilizer": {
                    "type": "Balanced 10-10-10 or cactus fertilizer",
                    "frequency": "Every 2-3 months during growing season, none in winter",
                    "application": "Dilute to quarter strength to avoid over-fertilization",
                    "special_notes": "Snake plants are light feeders and can be damaged by over-fertilizing"
                },
                "repotting": {
                    "frequency": "Every 3-5 years",
                    "best_time": "Spring or summer",
                    "signs": "Plant becomes top-heavy, roots fill pot completely, very slow growth",
                    "soil_mix": "Cactus or succulent mix with added sand for drainage"
                },
                "common_problems": {
                    "soft_leaves": "Overwatering. Let soil dry completely and reduce watering.",
                    "brown_tips": "Usually underwatering or fluoride in water. Use filtered water.",
                    "no_growth": "Normal in winter. Should see new growth in spring/summer.",
                    "leaf_dropping": "Usually overwatering. Check soil and reduce watering frequency."
                }
            },
            
            "Pothos": {
                "common_names": ["Devil's Ivy", "Golden Pothos"],
                "care": {
                    "watering": "Water when top inch of soil feels dry. Likes consistently moist soil but not waterlogged.",
                    "light": "Bright indirect light to low light. Variegated varieties need more light to maintain patterns.",
                    "temperature": "65-75°F (18-24°C). Avoid temperatures below 55°F (13°C).",
                    "humidity": "Moderate humidity (40-60%). Can tolerate lower humidity.",
                    "soil": "Well-draining potting mix. Can grow in water or soil."
                },
                "fertilizer": {
                    "type": "Balanced 20-20-20 or 10-10-10",
                    "frequency": "Monthly during spring and summer, every 2-3 months in fall, none in winter",
                    "application": "Dilute to half strength and apply to moist soil",
                    "special_notes": "If growing in water, add liquid fertilizer monthly"
                },
                "repotting": {
                    "frequency": "Every 1-2 years",
                    "best_time": "Spring or summer",
                    "signs": "Roots visible at soil surface, plant dries out quickly, slow growth",
                    "soil_mix": "Standard potting mix with added perlite for drainage"
                },
                "common_problems": {
                    "yellow_leaves": "Usually overwatering. Check soil drainage and reduce watering.",
                    "brown_edges": "Low humidity or underwatering. Increase humidity and check soil.",
                    "small_leaves": "Insufficient light. Move to brighter location.",
                    "no_variegation": "Insufficient light. Variegated varieties need bright indirect light."
                }
            },
            
            "Succulent": {
                "common_names": ["Echeveria", "Sedum", "Crassula"],
                "care": {
                    "watering": "Water deeply but infrequently. Let soil dry completely between waterings.",
                    "light": "Bright, direct light. Most succulents need 6+ hours of sunlight daily.",
                    "temperature": "60-80°F (15-27°C). Many can tolerate temperatures down to 40°F (4°C).",
                    "humidity": "Low humidity preferred. High humidity can cause rot.",
                    "soil": "Fast-draining cactus or succulent mix with sand and perlite."
                },
                "fertilizer": {
                    "type": "Cactus or succulent fertilizer",
                    "frequency": "Every 2-3 months during growing season, none in winter",
                    "application": "Dilute to quarter strength and apply to moist soil",
                    "special_notes": "Succulents are light feeders. Over-fertilizing can cause leggy growth."
                },
                "repotting": {
                    "frequency": "Every 2-3 years",
                    "best_time": "Spring or summer",
                    "signs": "Roots fill pot, plant becomes top-heavy, very slow growth",
                    "soil_mix": "Cactus or succulent mix with added sand and perlite"
                },
                "common_problems": {
                    "stretching": "Insufficient light. Move to brighter location.",
                    "rot": "Overwatering. Reduce watering and ensure good drainage.",
                    "wrinkled_leaves": "Underwatering. Water thoroughly when soil is dry.",
                    "leaf_drop": "Usually overwatering or insufficient light."
                }
            },
            
            "Fiddle Leaf Fig": {
                "common_names": ["Ficus lyrata"],
                "care": {
                    "watering": "Water when top 2-3 inches of soil feel dry. Likes consistent moisture but not soggy soil.",
                    "light": "Bright, indirect light. Can tolerate some direct morning sun.",
                    "temperature": "65-75°F (18-24°C). Avoid temperatures below 60°F (15°C).",
                    "humidity": "High humidity (60-80%). Mist leaves regularly or use a humidifier.",
                    "soil": "Well-draining potting mix with added perlite for aeration."
                },
                "fertilizer": {
                    "type": "Balanced 20-20-20 or 10-10-10",
                    "frequency": "Monthly during spring and summer, every 2-3 months in fall, none in winter",
                    "application": "Dilute to half strength and apply to moist soil",
                    "special_notes": "Fiddle leaf figs are heavy feeders during growing season"
                },
                "repotting": {
                    "frequency": "Every 1-2 years",
                    "best_time": "Spring or summer",
                    "signs": "Roots coming out of drainage holes, plant dries out quickly, slow growth",
                    "soil_mix": "Well-draining potting mix with added perlite and orchid bark"
                },
                "common_problems": {
                    "leaf_drop": "Usually due to changes in environment. Keep in stable location.",
                    "brown_spots": "Often due to overwatering or insufficient light.",
                    "no_new_growth": "Insufficient light or nutrients. Move to brighter location and fertilize.",
                    "yellow_leaves": "Usually overwatering. Let soil dry more between waterings."
                }
            }
        }
        
        # Fertilizer knowledge base
        self.fertilizer_guide = {
            "balanced_20_20_20": {
                "name": "Balanced 20-20-20",
                "description": "All-purpose fertilizer with equal nitrogen, phosphorus, and potassium",
                "best_for": ["Most houseplants", "Foliage plants", "General growth"],
                "application": "Dilute to half strength for most plants, quarter strength for sensitive plants",
                "frequency": "Monthly during growing season"
            },
            "cactus_fertilizer": {
                "name": "Cactus/Succulent Fertilizer",
                "description": "Low-nitrogen fertilizer designed for desert plants",
                "best_for": ["Cacti", "Succulents", "Snake plants", "Drought-tolerant plants"],
                "application": "Dilute to quarter strength and apply sparingly",
                "frequency": "Every 2-3 months during growing season"
            },
            "orchid_fertilizer": {
                "name": "Orchid Fertilizer",
                "description": "Specialized fertilizer for epiphytic plants",
                "best_for": ["Orchids", "Air plants", "Epiphytic plants"],
                "application": "Use at recommended strength, apply to roots or growing medium",
                "frequency": "Weekly during growing season, monthly in winter"
            }
        }
        
        # Disease and pest knowledge base
        self.disease_guide = {
            "yellow_leaves": {
                "causes": ["Overwatering", "Underwatering", "Nutrient deficiency", "Root rot", "Natural aging"],
                "solutions": {
                    "overwatering": "Let soil dry between waterings, improve drainage",
                    "underwatering": "Increase watering frequency, check soil moisture",
                    "nutrient_deficiency": "Apply balanced fertilizer",
                    "root_rot": "Repot in fresh soil, trim damaged roots",
                    "natural_aging": "Remove old leaves, this is normal"
                }
            },
            "brown_spots": {
                "causes": ["Sunburn", "Fungal infection", "Bacterial infection", "Pest damage", "Over-fertilization"],
                "solutions": {
                    "sunburn": "Move to indirect light, remove damaged leaves",
                    "fungal_infection": "Remove affected leaves, improve air circulation, use fungicide",
                    "bacterial_infection": "Remove affected parts, sterilize tools, improve conditions",
                    "pest_damage": "Identify and treat pests, remove damaged leaves",
                    "over_fertilization": "Flush soil with water, reduce fertilizer"
                }
            },
            "wilting": {
                "causes": ["Underwatering", "Overwatering", "Root rot", "Temperature stress", "Pest infestation"],
                "solutions": {
                    "underwatering": "Water thoroughly, check soil moisture regularly",
                    "overwatering": "Let soil dry, improve drainage, check for root rot",
                    "root_rot": "Repot in fresh soil, trim damaged roots",
                    "temperature_stress": "Move to stable temperature environment",
                    "pest_infestation": "Identify and treat pests"
                }
            },
            "leaf_drop": {
                "causes": ["Environmental changes", "Overwatering", "Underwatering", "Pest infestation", "Disease"],
                "solutions": {
                    "environmental_changes": "Keep plant in stable location, avoid drafts",
                    "overwatering": "Reduce watering frequency, improve drainage",
                    "underwatering": "Increase watering, check soil moisture",
                    "pest_infestation": "Identify and treat pests",
                    "disease": "Identify disease and treat accordingly"
                }
            }
        }
        
        # Repotting knowledge base
        self.repotting_guide = {
            "signs_to_repot": [
                "Roots coming out of drainage holes",
                "Plant dries out very quickly after watering",
                "Slow or stunted growth",
                "Soil becomes compacted",
                "Plant becomes top-heavy",
                "Visible salt buildup on soil surface"
            ],
            "best_time": "Spring or early summer when plants are actively growing",
            "avoid_timing": "Winter (dormant period) and immediately after flowering",
            "pot_selection": {
                "size": "Choose pot 1-2 inches larger in diameter than current pot",
                "material": "Terracotta (breathable), plastic (retains moisture), ceramic (decorative)",
                "drainage": "Must have drainage holes to prevent root rot"
            },
            "soil_mixes": {
                "general_purpose": "Standard potting mix with added perlite for drainage",
                "cactus_succulent": "Cactus mix with added sand and perlite",
                "orchid": "Orchid bark mix with charcoal and perlite",
                "african_violet": "Light, well-draining mix with added perlite"
            }
        }
        
        # Seasonal care guide
        self.seasonal_care = {
            "spring": {
                "watering": "Increase watering as plants begin active growth",
                "fertilizing": "Resume regular fertilizing schedule",
                "repotting": "Best time to repot most plants",
                "pruning": "Prune dead or damaged growth",
                "light": "Move plants to brighter locations if needed"
            },
            "summer": {
                "watering": "Most plants need more frequent watering",
                "fertilizing": "Continue regular fertilizing",
                "repotting": "Can repot if necessary",
                "pruning": "Light pruning to maintain shape",
                "light": "Protect from harsh afternoon sun"
            },
            "fall": {
                "watering": "Reduce watering as growth slows",
                "fertilizing": "Reduce fertilizing frequency",
                "repotting": "Avoid repotting unless necessary",
                "pruning": "Remove dead growth, avoid heavy pruning",
                "light": "Move plants away from cold windows"
            },
            "winter": {
                "watering": "Reduce watering significantly",
                "fertilizing": "Stop fertilizing most plants",
                "repotting": "Avoid repotting",
                "pruning": "Minimal pruning only",
                "light": "Maximize available light, consider grow lights"
            }
        }
    
    def get_plant_info(self, plant_name: str) -> dict:
        """Get comprehensive information about a specific plant"""
        return self.plants.get(plant_name, {})
    
    def get_fertilizer_info(self, fertilizer_type: str) -> dict:
        """Get information about a specific fertilizer type"""
        return self.fertilizer_guide.get(fertilizer_type, {})
    
    def get_disease_solutions(self, symptom: str) -> dict:
        """Get solutions for specific plant symptoms"""
        return self.disease_guide.get(symptom, {})
    
    def get_repotting_info(self) -> dict:
        """Get comprehensive repotting information"""
        return self.repotting_guide
    
    def get_seasonal_care(self, season: str) -> dict:
        """Get seasonal care recommendations"""
        return self.seasonal_care.get(season, {})
    
    def search_plants(self, query: str) -> list:
        """Search for plants by name or characteristics"""
        query = query.lower()
        results = []
        
        for plant_name, plant_info in self.plants.items():
            if (query in plant_name.lower() or 
                query in plant_info.get("common_names", []) or
                any(query in care.lower() for care in plant_info.get("care", {}).values())):
                results.append(plant_name)
        
        return results
    
    def get_all_plant_names(self) -> list:
        """Get list of all available plant names"""
        return list(self.plants.keys())

# Global instance
plant_kb = PlantKnowledgeBase()

def get_plant_knowledge_base():
    """Get or create PlantKnowledgeBase instance"""
    return plant_kb

if __name__ == "__main__":
    # Test the knowledge base
    kb = get_plant_knowledge_base()
    
    print("🌿 Plant Care Knowledge Base")
    print("=" * 50)
    
    # Test plant info
    monstera_info = kb.get_plant_info("Monstera")
    print(f"Monstera care: {monstera_info.get('care', {}).get('watering', 'Not found')}")
    
    # Test disease solutions
    yellow_solutions = kb.get_disease_solutions("yellow_leaves")
    print(f"Yellow leaves solutions: {list(yellow_solutions.get('causes', []))}")
    
    # Test search
    results = kb.search_plants("low light")
    print(f"Low light plants: {results}")
