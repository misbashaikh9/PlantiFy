#!/usr/bin/env python3
"""
Guided AI Conversation System for Plant Care
Shows main categories first, then guides users through specific questions
"""

import json
from typing import Dict, List, Any, Optional
from datetime import datetime
from plant_knowledge_base import get_plant_knowledge_base
from ml_plant_care_system import get_ml_system

class GuidedPlantAI:
    """Guided conversation AI that leads users through structured questions"""
    
    def __init__(self):
        self.conversation_states = {}  # Track user conversation progress
        self.knowledge_base = get_plant_knowledge_base()
        self.ml_system = get_ml_system()
        
        # Ensure ML models are loaded and trained
        if (self.ml_system.care_recommender is None or 
            self.ml_system.disease_diagnoser is None or 
            self.ml_system.fertilizer_predictor is None):
            print("🔄 ML models not loaded, training now...")
            self.ml_system.train_models()
        self.main_categories = {
            "plant_care": {
                "title": "🌱 Plant Care",
                "description": "Get advice on watering, light, temperature, and general care",
                "questions": [
                    {
                        "question": "What type of plant do you have?",
                        "options": ["Indoor", "Outdoor", "Both", "I'm not sure"]
                    },
                    {
                        "question": "What specific plant are you caring for?",
                        "options": ["Monstera", "Snake Plant", "Pothos", "Succulent", "Fiddle Leaf Fig", "Other"]
                    },
                    {
                        "question": "What specific care issue are you facing?",
                        "options": ["Watering", "Light", "Temperature", "Pests", "Growth", "General care"]
                    },
                    {
                        "question": "How long have you had this plant?",
                        "options": ["Less than 1 month", "1-6 months", "6-12 months", "1-2 years", "More than 2 years"]
                    }
                ]
            },
            "fertilizer": {
                "title": "🌿 Fertilizer Advice", 
                "description": "Learn when and how to fertilize your plants",
                "questions": [
                    {
                        "question": "What type of plant?",
                        "options": ["Monstera", "Snake Plant", "Pothos", "Succulent", "Fiddle Leaf Fig", "Other"]
                    },
                    {
                        "question": "What soil type do you have?",
                        "options": ["Potting soil", "Cactus soil", "Well-draining mix", "Garden soil", "I'm not sure"]
                    },
                    {
                        "question": "What season is it currently?",
                        "options": ["Spring", "Summer", "Fall", "Winter"]
                    },
                    {
                        "question": "How often do you currently fertilize?",
                        "options": ["Never", "Monthly", "Every 2-3 months", "Seasonally", "I'm not sure"]
                    }
                ]
            },
            "disease": {
                "title": "🍃 Disease Diagnosis",
                "description": "Identify and treat plant health problems",
                "questions": [
                    {
                        "question": "What plant type?",
                        "options": ["Monstera", "Snake Plant", "Pothos", "Succulent", "Fiddle Leaf Fig", "Other"]
                    },
                    {
                        "question": "What symptoms are you seeing?",
                        "options": ["Yellow leaves", "Brown spots", "Wilting", "Leaf drop", "Stunted growth", "Other"]
                    },
                    {
                        "question": "When did the problem start?",
                        "options": ["Recently (1-2 weeks)", "A few weeks ago", "A month ago", "Several months ago", "I'm not sure"]
                    },
                    {
                        "question": "Any recent changes in care?",
                        "options": ["Repotting", "Moving location", "Change in watering", "New fertilizer", "No changes", "Other"]
                    }
                ]
            },
            "repotting": {
                "title": "🏺 Repotting Help",
                "description": "Know when and how to repot your plants",
                "questions": [
                    {
                        "question": "What plant type?",
                        "options": ["Monstera", "Snake Plant", "Pothos", "Succulent", "Fiddle Leaf Fig", "Other"]
                    },
                    {
                        "question": "How long has your plant been in the current pot?",
                        "options": ["Less than 6 months", "6-12 months", "1-2 years", "2-3 years", "More than 3 years"]
                    },
                    {
                        "question": "Are roots coming out of drainage holes?",
                        "options": ["Yes, many roots", "Yes, a few roots", "No, but plant seems cramped", "No, plant looks fine", "I'm not sure"]
                    },
                    {
                        "question": "Is the plant growing slowly or not at all?",
                        "options": ["Yes, very slow growth", "Yes, no growth", "Some growth", "Normal growth", "I'm not sure"]
                    }
                ]
            }
        }
        
        # Plant database for detailed answers
        self.plant_database = {
            "Monstera": {
                "care": "Water when top 2-3 inches dry, bright indirect light, 65-80°F",
                "fertilizer": "Monthly during growing season, balanced 20-20-20",
                "repotting": "Every 1-2 years, spring/summer, use well-draining soil"
            },
            "Snake Plant": {
                "care": "Water sparingly (monthly), low light tolerant, 60-75°F",
                "fertilizer": "Quarterly, diluted 10-10-10, avoid over-fertilizing",
                "repotting": "Every 3-5 years, when pot-bound, use cactus soil"
            },
            "Pothos": {
                "care": "Water when top inch dry, bright indirect light, 65-75°F",
                "fertilizer": "Monthly spring/summer, balanced fertilizer, skip winter",
                "repotting": "Every 1-2 years, when roots fill pot, use potting mix"
            }
        }
    
    def start_conversation(self, user_id: str) -> Dict[str, Any]:
        """Start a new guided conversation"""
        self.conversation_states[user_id] = {
            "stage": "main_categories",
            "selected_category": None,
            "answers": {},
            "current_question": 0,
            "start_time": datetime.now().isoformat()
        }
        
        return {
            "type": "main_categories",
            "message": "Hey hi! 👋 I'm your Plant Care AI Assistant! 🌱\n\nI'm here to help you take care of your plants. What would you like to learn about today?",
            "options": [
                {
                    "id": "plant_care",
                    "title": "🌱 General Plant Care",
                    "description": "Get expert advice on watering, light, temperature, and daily plant care routines"
                },
                {
                    "id": "fertilizer", 
                    "title": "🌿 Fertilizer & Nutrition",
                    "description": "Learn when and how to fertilize your plants for optimal growth and health"
                },
                {
                    "id": "disease",
                    "title": "🍃 Plant Health & Problems", 
                    "description": "Identify plant diseases, pests, and health issues with expert diagnosis"
                },
                {
                    "id": "repotting",
                    "title": "🏺 Repotting & Transplanting",
                    "description": "Master the art of repotting plants and choosing the right soil and containers"
                }
            ]
        }
    
    def select_category(self, user_id: str, category: str) -> Dict[str, Any]:
        """User selects a main category"""
        if category not in self.main_categories:
            return {"error": "Invalid category selected"}
        
        state = self.conversation_states[user_id]
        state["selected_category"] = category
        state["stage"] = "answering_questions"
        state["current_question"] = 0
        
        category_info = self.main_categories[category]
        first_question_data = category_info["questions"][0]
        
        return {
            "type": "question",
            "message": f"Great choice! {category_info['title']} 🎯\n\n{first_question_data['question']}",
            "category": category,
            "question_number": 1,
            "total_questions": len(category_info["questions"]),
            "current_question": first_question_data['question'],
            "options": first_question_data['options']
        }
    
    def answer_question(self, user_id: str, answer: str) -> Dict[str, Any]:
        """User answers a question, get next question or final answer"""
        state = self.conversation_states[user_id]
        category = state["selected_category"]
        
        if not category:
            return {"error": "No category selected"}
        
        # Validate answer is not empty
        if not answer.strip():
            current_question_data = self.main_categories[category]["questions"][state["current_question"]]
            return {
                "type": "error",
                "message": f"Please select one of the available options! 🌱\n\nCurrent question: {current_question_data['question']}",
                "category": category,
                "question_number": state["current_question"] + 1,
                "total_questions": len(self.main_categories[category]["questions"]),
                "current_question": current_question_data['question'],
                "options": current_question_data['options']
            }
        
        # Store the answer
        question_index = state["current_question"]
        category_info = self.main_categories[category]
        questions = category_info["questions"]
        
        # Store answer with question context
        state["answers"][f"q{question_index + 1}"] = {
            "question": questions[question_index]["question"],
            "answer": answer
        }
        
        # Check if there are more questions
        if question_index + 1 < len(questions):
            # Move to next question
            state["current_question"] += 1
            next_question_data = questions[state["current_question"]]
            
            return {
                "type": "question",
                "message": f"Thanks! Next question:\n\n{next_question_data['question']}",
                "category": category,
                "question_number": state["current_question"] + 1,
                "total_questions": len(questions),
                "current_question": next_question_data['question'],
                "options": next_question_data['options']
            }
        else:
            # All questions answered, provide detailed answer
            return self._generate_detailed_answer(user_id, category)
    
    def _generate_detailed_answer(self, user_id: str, category: str) -> Dict[str, Any]:
        """Generate comprehensive answer based on collected information"""
        state = self.conversation_states[user_id]
        answers = state["answers"]
        
        if category == "plant_care":
            return self._generate_plant_care_answer(answers)
        elif category == "fertilizer":
            return self._generate_fertilizer_answer(answers)
        elif category == "disease":
            return self._generate_disease_answer(answers)
        elif category == "repotting":
            return self._generate_repotting_answer(answers)
        else:
            return {"error": "Unknown category"}
    
    def _generate_plant_care_answer(self, answers: Dict) -> Dict[str, Any]:
        """Generate detailed plant care advice using ML system"""
        plant_type = answers.get("q2", {}).get("answer", "Unknown")  # q2 is plant name
        environment = answers.get("q1", {}).get("answer", "indoor")  # q1 is environment
        issue = answers.get("q3", {}).get("answer", "general care")
        experience = answers.get("q4", {}).get("answer", "some time")
        
        # Get comprehensive plant info from knowledge base
        plant_info = self.knowledge_base.get_plant_info(plant_type)
        
        # Use ML system to predict care success
        ml_input = {
            "plant_type": plant_type,
            "environment": environment,
            "light_level": "bright_indirect",  # Default, could be enhanced
            "humidity": "moderate",  # Default, could be enhanced
            "temperature": "warm",  # Default, could be enhanced
            "soil_type": "well_draining",  # Default, could be enhanced
            "watering_frequency": "weekly",  # Default, could be enhanced
            "fertilizer_frequency": "monthly"  # Default, could be enhanced
        }
        
        ml_prediction = self.ml_system.predict_care_success(ml_input)
        print(f"🔍 ML Prediction Debug: {ml_prediction}")
        
        # Build comprehensive response
        response = f"""
🌱 **AI-Powered Plant Care Guide for {plant_type}**

**Your Situation:**
• Plant: {plant_type}
• Environment: {environment}
• Issue: {issue}
• Experience: {experience}

**ML Care Success Prediction:**
• Success Probability: {ml_prediction.get('success_probability', 'N/A')}
• Confidence: {ml_prediction.get('confidence', 'N/A')}

**Care Recommendations:**
{plant_info.get('care', {}).get('watering', 'Water when soil feels dry.')}
{plant_info.get('care', {}).get('light', 'Provide bright indirect light.')}
{plant_info.get('care', {}).get('temperature', 'Maintain 65-75°F temperature.')}
{plant_info.get('care', {}).get('humidity', 'Moderate humidity preferred.')}

**ML-Generated Recommendations:**
{chr(10).join(f"• {rec}" for rec in ml_prediction.get('recommendations', []))}

**Pro Tips:**
• Check soil moisture before watering
• Rotate plant weekly for even growth
• Clean leaves monthly to remove dust
• Monitor for pests regularly

**Next Steps:**
• Implement the care routine for 2 weeks
• Observe how your plant responds
• Adjust based on plant's feedback

Need help with anything specific about {plant_type}? 😊
        """.strip()
        
        return {
            "type": "detailed_answer",
            "message": response,
            "category": "plant_care",
            "plant_type": plant_type,
            "ml_prediction": ml_prediction,
            "suggestions": [
                "Ask about specific care topics",
                "Get fertilizer recommendations", 
                "Learn about repotting",
                "Start new conversation"
            ]
        }
    
    def _generate_fertilizer_answer(self, answers: Dict) -> Dict[str, Any]:
        """Generate detailed fertilizer advice using ML system"""
        plant_type = answers.get("q1", {}).get("answer", "Unknown")
        soil_type = answers.get("q2", {}).get("answer", "potting soil")
        season = answers.get("q3", {}).get("answer", "spring")
        frequency = answers.get("q4", {}).get("answer", "occasionally")
        
        # Map user input to ML-compatible labels
        ml_plant_type = self._map_user_input_to_ml_labels(plant_type, "plant_type")
        ml_soil_type = self._map_user_input_to_ml_labels(soil_type, "soil_type")
        ml_season = self._map_user_input_to_ml_labels(season, "season")
        ml_frequency = self._map_user_input_to_ml_labels(frequency, "frequency")
        
        # Get comprehensive plant info from knowledge base
        plant_info = self.knowledge_base.get_plant_info(ml_plant_type)
        
        # Use ML system to recommend fertilizer
        ml_input = {
            "plant_type": ml_plant_type,
            "season": ml_season,
            "soil_type": ml_soil_type,
            "plant_age": "mature",  # Default, could be enhanced
            "growth_rate": "active"  # Default, could be enhanced
        }
        
        ml_recommendation = self.ml_system.recommend_fertilizer(ml_input)
        print(f"🔍 ML Fertilizer Debug: {ml_recommendation}")
        
        # Build comprehensive response
        response = f"""
🌿 **AI-Powered Fertilizer Guide for {plant_type}**

**Your Setup:**
• Plant: {plant_type}
• Soil: {soil_type}
• Season: {season}
• Current frequency: {frequency}

**ML Fertilizer Recommendation:**
• Type: {ml_recommendation.get('fertilizer_type', 'N/A')}
• Confidence: {ml_recommendation.get('confidence', 'N/A')}

**Application Details:**
{ml_recommendation.get('application_details', {}).get('dilution', 'Dilute as recommended')}
{ml_recommendation.get('application_details', {}).get('frequency', 'Apply as needed')}
{ml_recommendation.get('application_details', {}).get('application', 'Follow package instructions')}

**Plant-Specific Recommendations:**
{plant_info.get('fertilizer', {}).get('type', 'Use balanced fertilizer')}
{plant_info.get('fertilizer', {}).get('frequency', 'Apply monthly during growing season')}
{plant_info.get('fertilizer', {}).get('special_notes', 'Follow general guidelines')}

**Seasonal Adjustments:**
{chr(10).join(f"• {adj}" for adj in ml_recommendation.get('seasonal_adjustments', []))}

**Best Practices:**
• Always dilute fertilizer to avoid root burn
• Apply to moist soil, never dry soil
• Water thoroughly after fertilizing
• Avoid fertilizing newly repotted plants

**Signs of Over-Fertilization:**
• Brown leaf tips
• Wilting despite moist soil
• Salt buildup on soil surface

**Next Steps:**
• Start with ML-recommended schedule
• Monitor plant response
• Adjust frequency based on growth

Ready to fertilize your {plant_type}? 🌱
        """.strip()
        
        return {
            "type": "detailed_answer",
            "message": response,
            "category": "fertilizer",
            "plant_type": plant_type,
            "ml_recommendation": ml_recommendation,
            "suggestions": [
                "Get plant care advice",
                "Learn about repotting",
                "Ask about disease prevention",
                "Start new conversation"
            ]
        }
    
    def _generate_disease_answer(self, answers: Dict) -> Dict[str, Any]:
        """Generate detailed disease diagnosis using ML system"""
        plant_type = answers.get("q1", {}).get("answer", "Unknown")
        symptoms = answers.get("q2", {}).get("answer", "health issues")
        timeline = answers.get("q3", {}).get("answer", "recently")
        changes = answers.get("q4", {}).get("answer", "no changes")
        
        # Map user input to ML-compatible labels
        ml_plant_type = self._map_user_input_to_ml_labels(plant_type, "plant_type")
        ml_changes = self._map_user_input_to_ml_labels(changes, "care_changes")
        
        # Use ML system to diagnose disease
        ml_input = {
            "plant_type": ml_plant_type,
            "environment": "indoor",  # Default, could be enhanced
            "care_history": ml_changes
        }
        
        ml_diagnosis = self.ml_system.diagnose_disease(symptoms, ml_input)
        print(f"🔍 ML Diagnosis Debug: {ml_diagnosis}")
        
        # Get comprehensive plant info from knowledge base
        plant_info = self.knowledge_base.get_plant_info(ml_plant_type)
        
        # Build comprehensive response
        response = f"""
🍃 **AI-Powered Health Diagnosis for {plant_type}**

**Symptoms:**
• Plant: {plant_type}
• Issues: {symptoms}
• Started: {timeline}
• Recent changes: {changes}

**ML Disease Diagnosis:**
• Diagnosis: {ml_diagnosis.get('diagnosis', 'N/A')}
• Confidence: {ml_diagnosis.get('confidence', 'N/A')}

**Treatment Plan:**
{ml_diagnosis.get('treatment', 'Monitor plant and adjust care routine')}

**Plant-Specific Health Info:**
{plant_info.get('common_problems', {}).get('yellow_leaves', 'Monitor for common issues')}
{plant_info.get('common_problems', {}).get('brown_spots', 'Check for environmental stress')}
{plant_info.get('common_problems', {}).get('wilting', 'Assess watering routine')}

**Common Causes & Solutions:**

**🌱 Yellow Leaves:**
• Overwatering: Let soil dry between waterings
• Underwatering: Increase watering frequency
• Nutrient deficiency: Apply balanced fertilizer

**🍂 Brown Spots:**
• Sunburn: Move to indirect light
• Fungal infection: Remove affected leaves, improve air circulation
• Pest damage: Check for insects, treat with neem oil

**🥀 Wilting:**
• Underwatering: Water thoroughly
• Root rot: Check roots, repot if necessary
• Temperature stress: Move to stable environment

**Prevention Tips:**
• Maintain consistent care routine
• Avoid overwatering
• Provide proper light conditions
• Regular pest inspection

**Immediate Actions:**
• Assess current care routine
• Check soil moisture
• Examine for pests
• Adjust light exposure

**When to Seek Help:**
• Rapid decline in health
• Multiple symptoms
• No improvement after care changes

Your {plant_type} can recover with proper care! 💚
        """.strip()
        
        return {
            "type": "detailed_answer", 
            "message": response,
            "category": "disease",
            "plant_type": plant_type,
            "ml_diagnosis": ml_diagnosis,
            "suggestions": [
                "Get care recommendations",
                "Learn about prevention",
                "Ask about repotting",
                "Start new conversation"
            ]
        }
    
    def _generate_repotting_answer(self, answers: Dict) -> Dict[str, Any]:
        """Generate detailed repotting advice"""
        plant_type = answers.get("q1", {}).get("answer", "your plant")
        pot_time = answers.get("q2", {}).get("answer", "some time")
        root_condition = answers.get("q3", {}).get("answer", "normal")
        growth_rate = answers.get("q4", {}).get("answer", "growing")
        
        # Get specific plant info if available
        plant_info = self.plant_database.get(plant_type, {})
        
        response = f"""
🏺 **Repotting Guide for {plant_type}**

**Current Situation:**
• Plant: {plant_type}
• Time in pot: {pot_time}
• Root condition: {root_condition}
• Growth rate: {growth_rate}

**When to Repot:**
{plant_info.get('repotting', 'Repot when roots fill the pot or plant growth slows down.')}

**Signs You Need to Repot:**
• Roots coming out of drainage holes
• Plant dries out very quickly
• Slow or stunted growth
• Soil becomes compacted
• Plant becomes top-heavy

**Best Time to Repot:**
• **Spring/Summer**: Active growing season
• **Avoid Winter**: Plants are dormant
• **Wait 2 weeks** after any major changes

**Repotting Steps:**
1. **Prepare**: New pot (1-2 inches larger), fresh soil
2. **Water**: Thoroughly water plant 1-2 days before
3. **Remove**: Gently remove from old pot
4. **Inspect**: Check roots, remove any rotten parts
5. **Place**: Add soil to new pot, position plant
6. **Fill**: Add soil around roots, firm gently
7. **Water**: Water thoroughly, let drain

**After Repotting:**
• Place in bright indirect light
• Avoid fertilizing for 4-6 weeks
• Monitor for stress signs
• Resume normal care routine

**Soil Recommendations:**
• Well-draining potting mix
• Add perlite for aeration
• Consider specific plant needs

Ready to give your {plant_type} a new home? 🏠
        """.strip()
        
        return {
            "type": "detailed_answer",
            "message": response,
            "category": "repotting", 
            "plant_type": plant_type,
            "suggestions": [
                "Get care advice",
                "Learn about fertilizing",
                "Ask about disease prevention",
                "Start new conversation"
            ]
        }
    
    def _map_user_input_to_ml_labels(self, user_input: str, input_type: str) -> str:
        """Map user-friendly input to ML-compatible labels"""
        if input_type == "soil_type":
            soil_mapping = {
                "well-draining soil": "well_draining",
                "well-draining": "well_draining",
                "potting soil": "well_draining",
                "cactus soil": "cactus_mix",
                "cactus": "cactus_mix",
                "garden soil": "well_draining",
                "i'm not sure": "well_draining"
            }
            return soil_mapping.get(user_input.lower(), "well_draining")
        
        elif input_type == "plant_type":
            plant_mapping = {
                "monstera": "Monstera",
                "snake plant": "Snake Plant",
                "pothos": "Pothos",
                "succulent": "Succulent",
                "fiddle leaf fig": "Fiddle Leaf Fig",
                "other": "Monstera"  # Default fallback
            }
            return plant_mapping.get(user_input.lower(), user_input)
        
        elif input_type == "environment":
            env_mapping = {
                "indoor": "indoor",
                "outdoor": "outdoor",
                "both": "indoor",  # Default to indoor
                "i'm not sure": "indoor"
            }
            return env_mapping.get(user_input.lower(), "indoor")
        
        elif input_type == "season":
            season_mapping = {
                "spring": "spring",
                "summer": "summer",
                "fall": "fall",
                "winter": "winter"
            }
            return season_mapping.get(user_input.lower(), "spring")
        
        elif input_type == "frequency":
            freq_mapping = {
                "never": "none",
                "monthly": "monthly",
                "every 2-3 months": "quarterly",
                "seasonally": "monthly",
                "i'm not sure": "monthly"
            }
            return freq_mapping.get(user_input.lower(), "monthly")
        
        elif input_type == "care_changes":
            changes_mapping = {
                "no changes": "normal",
                "no": "normal",
                "repotting": "repotting",
                "moving location": "moving_location",
                "change in watering": "watering_change",
                "new fertilizer": "fertilizer_change",
                "other": "normal"
            }
            return changes_mapping.get(user_input.lower(), "normal")
        
        # Return original input if no mapping found
        return user_input
    
    def reset_conversation(self, user_id: str) -> Dict[str, Any]:
        """Reset conversation to start over"""
        if user_id in self.conversation_states:
            del self.conversation_states[user_id]
        
        return self.start_conversation(user_id)
    
    def get_conversation_status(self, user_id: str) -> Dict[str, Any]:
        """Get current conversation status"""
        if user_id not in self.conversation_states:
            return {"error": "No active conversation"}
        
        state = self.conversation_states[user_id]
        return {
            "stage": state["stage"],
            "category": state["selected_category"],
            "question_number": state["current_question"] + 1 if state["stage"] == "answering_questions" else 0,
            "total_questions": len(self.main_categories[state["selected_category"]]["questions"]) if state["selected_category"] else 0,
            "answers": state["answers"]
        }
    
    def handle_custom_message(self, user_id: str, message: str) -> Dict[str, Any]:
        """Handle custom messages that don't fit the guided flow"""
        if user_id not in self.conversation_states:
            return self.start_conversation(user_id)
        
        state = self.conversation_states[user_id]
        
        if state["stage"] == "main_categories":
            # Check if user is saying hi/hello
            if message.lower() in ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"]:
                return {
                    "type": "greeting",
                    "message": "Hey there! 👋 Nice to meet you! I'm your Plant Care AI Assistant! 🌱\n\nWhat would you like to learn about today?",
                    "options": [
                        {
                            "id": "plant_care",
                            "title": "🌱 General Plant Care",
                            "description": "Get expert advice on watering, light, temperature, and daily plant care routines"
                        },
                        {
                            "id": "fertilizer", 
                            "title": "🌿 Fertilizer & Nutrition",
                            "description": "Learn when and how to fertilize your plants for optimal growth and health"
                        },
                        {
                            "id": "disease",
                            "title": "🍃 Plant Health & Problems", 
                            "description": "Identify plant diseases, pests, and health issues with expert diagnosis"
                        },
                        {
                            "id": "repotting",
                            "title": "🏺 Repotting & Transplanting",
                            "description": "Master the art of repotting plants and choosing the right soil and containers"
                        }
                    ]
                }
            else:
                return {
                    "type": "error",
                    "message": "Hey there! 😊 I'd love to help you with plant care! Please choose one of the available options below:\n\n• 🌱 General Plant Care\n• 🌿 Fertilizer & Nutrition\n• 🍃 Plant Health & Problems\n• 🏺 Repotting & Transplanting\n\nJust click on one of these options to get started! 🌱"
                }
        elif state["stage"] == "answering_questions":
            current_question_data = self.main_categories[state["selected_category"]]["questions"][state["current_question"]]
            return {
                "type": "error",
                "message": f"🌱 I'm here to help with your plant care! Please select one of the available options for the current question:\n\n**{current_question_data['question']}**\n\nOr if you'd like to start over, you can click the 🔄 Reset button above! 😊",
                "category": state["selected_category"],
                "question_number": state["current_question"] + 1,
                "total_questions": len(self.main_categories[state["selected_category"]]["questions"]),
                "current_question": current_question_data['question'],
                "options": current_question_data['options']
            }
        
        return self.start_conversation(user_id)

# Global instance
guided_ai = None

def get_guided_ai():
    """Get or create GuidedPlantAI instance"""
    global guided_ai
    if guided_ai is None:
        guided_ai = GuidedPlantAI()
    return guided_ai

def guided_chat_with_ai(user_message: str, user_id: str = None, 
                        action: str = None, category: str = None) -> Dict[str, Any]:
    """Main function for guided AI chat"""
    ai = get_guided_ai()
    
    if not user_id:
        user_id = "default_user"
    
    # Handle different actions
    if action == "start":
        return ai.start_conversation(user_id)
    elif action == "select_category":
        return ai.select_category(user_id, category)
    elif action == "reset":
        return ai.reset_conversation(user_id)
    elif action == "status":
        return ai.get_conversation_status(user_id)
    else:
        # Check if user is in conversation flow
        if user_id in ai.conversation_states:
            state = ai.conversation_states[user_id]
            if state["stage"] == "main_categories":
                # User selected a category
                if user_message.lower() in ["plant care", "fertilizer", "disease", "repotting"]:
                    category_map = {
                        "plant care": "plant_care",
                        "fertilizer": "fertilizer", 
                        "disease": "disease",
                        "repotting": "repotting"
                    }
                    return ai.select_category(user_id, category_map[user_message.lower()])
                else:
                    # User typed something else - guide them to choose options
                    return ai.handle_custom_message(user_id, user_message)
            elif state["stage"] == "answering_questions":
                # User is answering questions
                return ai.answer_question(user_id, user_message)
        else:
            # Start new conversation
            return ai.start_conversation(user_id)

if __name__ == "__main__":
    # Test the guided AI
    print("🌿 Guided Plant AI Chat Bot")
    print("=" * 50)
    
    # Simulate conversation
    ai = get_guided_ai()
    
    # Start conversation
    response = ai.start_conversation("test_user")
    print("🤖 AI:", response["message"])
    print("Options:", [opt["title"] for opt in response["options"]])
    print("-" * 50)
    
    # Select category
    response = ai.select_category("test_user", "fertilizer")
    print("🤖 AI:", response["message"])
    print("-" * 50)
    
    # Answer questions
    response = ai.answer_question("test_user", "Monstera")
    print("🤖 AI:", response["message"])
    print("-" * 50)
    
    response = ai.answer_question("test_user", "well-draining soil")
    print("🤖 AI:", response["message"])
    print("-" * 50)
    
    response = ai.answer_question("test_user", "spring")
    print("🤖 AI:", response["message"])
    print("-" * 50)
    
    response = ai.answer_question("test_user", "monthly")
    print("🤖 AI:", response["message"])
    print("-" * 50)
