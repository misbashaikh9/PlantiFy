#!/usr/bin/env python
"""
Demonstration script to show exactly how the reply system works
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'plantify_backend.settings')
django.setup()

from plant_store.models import CustomerSuggestion, Comment
from django.contrib.auth.models import User

def demonstrate_reply_system():
    print("🎯 DEMONSTRATION: How Reply System Works")
    print("=" * 50)
    
    # 1. Show current suggestions
    print("\n1️⃣ CURRENT SUGGESTIONS IN DATABASE:")
    suggestions = CustomerSuggestion.objects.all()
    for suggestion in suggestions[:3]:  # Show first 3
        print(f"   📝 Suggestion ID: {suggestion.id}")
        print(f"      Content: {suggestion.content[:60]}...")
        print(f"      Likes: {suggestion.likes}, Dislikes: {suggestion.dislikes}")
        print(f"      Comments: {suggestion.comments.count()}")
        print()
    
    # 2. Show current comments
    print("\n2️⃣ CURRENT COMMENTS IN DATABASE:")
    comments = Comment.objects.all()
    for comment in comments:
        if comment.parent_comment is None:
            print(f"   💬 Comment ID: {comment.id} (on Suggestion {comment.suggestion.id})")
            print(f"      Content: {comment.content[:50]}...")
            print(f"      User: {comment.user.username}")
            print(f"      Parent: None (Main comment)")
            print(f"      Likes: {comment.likes}, Dislikes: {comment.dislikes}")
            
            # Find replies to this comment
            replies = Comment.objects.filter(parent_comment=comment)
            for reply in replies:
                print(f"         🔄 Reply ID: {reply.id}")
                print(f"            Content: {reply.content[:40]}...")
                print(f"            User: {reply.user.username}")
                print(f"            Parent: {reply.parent_comment.id}")
                print(f"            Likes: {reply.likes}, Dislikes: {reply.dislikes}")
        print()
    
    # 3. Show database structure
    print("\n3️⃣ DATABASE STRUCTURE EXPLAINED:")
    print("   📊 CustomerSuggestion Table:")
    print("      - Stores main suggestions")
    print("      - Has likes/dislikes")
    print("      - Links to user who created it")
    print()
    print("   💬 Comment Table:")
    print("      - Stores ALL replies (to suggestions AND to comments)")
    print("      - suggestion_id: Links to which suggestion this reply belongs to")
    print("      - parent_comment: Links to which comment this is replying to")
    print("      - If parent_comment is NULL = Reply to suggestion")
    print("      - If parent_comment has ID = Reply to another comment")
    print()
    
    # 4. Show relationships
    print("\n4️⃣ RELATIONSHIPS EXPLAINED:")
    if suggestions.exists():
        suggestion = suggestions.first()
        print(f"   📝 Suggestion {suggestion.id}: {suggestion.content[:40]}...")
        print(f"      ↓ (has many comments)")
        
        for comment in suggestion.comments.all():
            if comment.parent_comment is None:
                print(f"      💬 Comment {comment.id}: {comment.content[:30]}...")
                print(f"         ↓ (can have replies)")
                
                # Find replies to this comment
                replies = Comment.objects.filter(parent_comment=comment)
                for reply in replies:
                    print(f"            🔄 Reply {reply.id}: {reply.content[:25]}...")
                    print(f"               ↓ (can have nested replies)")
                    
                    # Find nested replies
                    nested = Comment.objects.filter(parent_comment=reply)
                    for nested_reply in nested:
                        print(f"                  🔄 Nested {nested_reply.id}: {nested_reply.content[:20]}...")
    
    print("\n" + "=" * 50)
    print("✅ THIS IS HOW YOUR REPLY SYSTEM WORKS!")
    print("   - Suggestions stored in CustomerSuggestion table")
    print("   - ALL replies stored in Comment table")
    print("   - parent_comment field creates the hierarchy")
    print("   - Every comment/reply has likes/dislikes")
    print("   - Users can reply to suggestions AND to comments")

if __name__ == '__main__':
    demonstrate_reply_system()



