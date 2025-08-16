from mongoengine import Document, StringField, IntField, FloatField, DateTimeField, BooleanField, ListField, EmbeddedDocumentField, EmbeddedDocument
from datetime import datetime

# MongoDB Models for additional features
# These work alongside Django ORM models

class PlantCareTip(Document):
    """Plant care tips stored in MongoDB"""
    
    title = StringField(required=True, max_length=200)
    content = StringField(required=True)
    plant_type = StringField(required=True)
    difficulty_level = StringField(choices=['beginner', 'intermediate', 'advanced'])
    tags = ListField(StringField())
    created_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'plant_care_tips',
        'indexes': ['plant_type', 'difficulty_level', 'tags']
    }
    
    def __str__(self):
        return self.title


class UserPlantCollection(Document):
    """User's personal plant collection in MongoDB"""
    
    user_id = IntField(required=True)
    plant_name = StringField(required=True)
    plant_type = StringField(required=True)
    care_notes = StringField()
    watering_schedule = StringField()
    last_watered = DateTimeField()
    health_status = StringField(choices=['healthy', 'needs_attention', 'sick'])
    created_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'user_plant_collections',
        'indexes': ['user_id', 'plant_type', 'health_status']
    }
    
    def __str__(self):
        return f"{self.plant_name} - {self.user_id}"


class PlantIdentification(Document):
    """AI plant identification results stored in MongoDB"""
    
    user_id = IntField(required=True)
    image_url = StringField(required=True)
    identified_plant = StringField()
    confidence_score = FloatField()
    care_recommendations = ListField(StringField())
    identification_date = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'plant_identifications',
        'indexes': ['user_id', 'identified_plant', 'confidence_score']
    }
    
    def __str__(self):
        return f"Plant ID for User {self.user_id} - {self.identified_plant}"


class PlantCareLog(Document):
    """Daily plant care logging in MongoDB"""
    
    user_id = IntField(required=True)
    plant_id = StringField(required=True)
    action = StringField(choices=['watered', 'fertilized', 'pruned', 'repotted', 'other'])
    notes = StringField()
    care_date = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'plant_care_logs',
        'indexes': ['user_id', 'plant_id', 'action', 'care_date']
    }
    
    def __str__(self):
        return f"Care log: {self.action} for plant {self.plant_id}"


class PlantCommunityPost(Document):
    """Community posts about plants in MongoDB"""
    
    user_id = IntField(required=True)
    title = StringField(required=True, max_length=200)
    content = StringField(required=True)
    plant_type = StringField()
    tags = ListField(StringField())
    likes = IntField(default=0)
    comments = ListField(StringField())
    created_at = DateTimeField(default=datetime.utcnow)
    
    meta = {
        'collection': 'plant_community_posts',
        'indexes': ['user_id', 'plant_type', 'tags', 'created_at']
    }
    
    def __str__(self):
        return self.title


