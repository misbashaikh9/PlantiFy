import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/SuggestionsPage.css';
import { suggestionAPI, commentAPI } from '../services/api';

const SuggestionsPage = () => {
  const navigate = useNavigate();
  const [newSuggestion, setNewSuggestion] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showComments, setShowComments] = useState({}); // Track which suggestions show comments

  // Sample suggestions with nested comments and like/dislike functionality
  const sampleSuggestions = [
    {
      id: 1001,
      content: "I love the new organic fertilizer collection! My plants are thriving.",
      user: { first_name: "Sarah", username: "plantlover123" },
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      likes: 12,
      dislikes: 2,
      comments: []
    },
    {
      id: 1002,
      content: "Has anyone tried the slow-release granules? How long do they last?",
      user: { first_name: "Mike", username: "garden_mike" },
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      likes: 7,
      dislikes: 0,
      comments: []
    },
    {
      id: 1003,
      content: "Great customer service! They helped me choose the right plants for my apartment.",
      user: { first_name: "Emma", username: "urban_gardener" },
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      likes: 15,
      dislikes: 0,
      comments: []
    }
  ];

  const loadSuggestions = async () => {
    try {
      console.log('Fetching suggestions from API...');
      const data = await suggestionAPI.list();
      console.log('API response:', data);
      
      if (data && data.length > 0) {
        // Use real data from database
        console.log('Using real data from database');
        setSuggestions(data);
      } else {
        // Fallback to sample data if no real data exists
        console.log('No real data found, using sample data as fallback');
        setSuggestions(sampleSuggestions);
      }
    } catch (error) {
      console.error('Failed to load suggestions from API:', error);
      // Fallback to sample data if API fails
      console.log('API failed, using sample data as fallback');
      setSuggestions(sampleSuggestions);
    }
  };

  useEffect(() => { loadSuggestions(); }, []);

  const handleSubmitSuggestion = async (e) => {
    e.preventDefault();
    if (newSuggestion.trim().length < 3) {
      setError('Please write a longer suggestion.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await suggestionAPI.create(newSuggestion);
      console.log('New suggestion created:', response);
      
      // Clear the form
      setNewSuggestion('');
      
      // Refresh suggestions from database to show the new one
      await loadSuggestions();
    } catch (error) {
      console.error('Failed to create suggestion:', error);
      setError('Failed to post suggestion. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (suggestionId, commentId = null) => {
    try {
      if (commentId === null) {
        // Like the main suggestion
        const response = await suggestionAPI.like(suggestionId);
        console.log('Suggestion like response:', response);
        
        // Refresh suggestions from database to get updated counts
        await loadSuggestions();
      } else {
        // Like a comment
        const response = await commentAPI.like(commentId);
        console.log('Comment like response:', response);
        
        // Refresh suggestions from database to get updated counts
        await loadSuggestions();
      }
    } catch (error) {
      console.error('Failed to like item:', error);
    }
  };

  const handleDislike = async (suggestionId, commentId = null) => {
    try {
      if (commentId === null) {
        // Dislike the main suggestion
        const response = await suggestionAPI.dislike(suggestionId);
        console.log('Suggestion dislike response:', response);
        
        // Refresh suggestions from database to get updated counts
        await loadSuggestions();
      } else {
        // Dislike a comment
        const response = await commentAPI.dislike(commentId);
        console.log('Comment dislike response:', response);
        
        // Refresh suggestions from database to get updated counts
        await loadSuggestions();
      }
    } catch (error) {
      console.error('Failed to dislike item:', error);
    }
  };

  const handleReply = (suggestionId, commentId = null) => {
    setReplyingTo({ suggestionId, commentId });
    setReplyText('');
  };

  const toggleComments = (suggestionId) => {
    setShowComments(prev => ({
      ...prev,
      [suggestionId]: !prev[suggestionId]
    }));
  };

  const handleSubmitReply = async (suggestionId, commentId = null) => {
    if (replyText.trim().length < 3) return;

    try {
      if (commentId === null) {
        // Reply to main suggestion
        const response = await commentAPI.createReply(suggestionId, replyText);
        console.log('Reply to suggestion response:', response);
      } else {
        // Reply to a comment
        const response = await commentAPI.createNestedReply(commentId, replyText);
        console.log('Reply to comment response:', response);
      }
      
      // Refresh suggestions from database to show the new reply
      await loadSuggestions();
      
      // Clear reply form
      setReplyingTo(null);
      setReplyText('');
    } catch (error) {
      console.error('Failed to submit reply:', error);
    }
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyText('');
  };

  const renderComment = (comment, suggestionId, isNested = false) => {
    console.log('Rendering comment:', comment.id, 'isNested:', isNested, 'has reply button:', !isNested);
    
    return (
      <div key={comment.id} className={`comment-item ${isNested ? 'nested-comment' : ''}`}>
        <div className="comment-header">
          <div className="user-avatar"><i className="fas fa-user"></i></div>
          <div className="user-info">
            <div className="user-name">{comment.user?.first_name || comment.user?.username || 'Customer'}</div>
            <div className="comment-date">{new Date(comment.created_at).toLocaleString()}</div>
          </div>
        </div>
        <div className="comment-content">{comment.content}</div>
        <div className="comment-actions" onClick={(e) => e.stopPropagation()}>
          <button 
            className="action-btn like-btn"
            onClick={() => handleLike(suggestionId, comment.id)}
          >
            <i className="fas fa-thumbs-up"></i> {comment.likes || 0}
          </button>
          <button 
            className="action-btn dislike-btn"
            onClick={() => handleDislike(suggestionId, comment.id)}
          >
            <i className="fas fa-thumbs-down"></i> {comment.dislikes || 0}
          </button>
          {/* Reply button for every comment */}
          <button 
            className="action-btn reply-btn" 
            onClick={() => handleReply(comment.id)}
          >
            <i className="fas fa-reply"></i> Reply
          </button>
          
          {/* Show replies button only if there are existing replies */}
          {comment.comments && comment.comments.length > 0 && (
            <button 
              className="action-btn view-replies-btn" 
              onClick={() => toggleComments(comment.id)}
              style={{ display: 'inline-flex' }}
            >
              <i className="fas fa-comments"></i> 
              {showComments[comment.id] ? 'Hide Replies' : `Show Replies (${comment.comments.length})`}
            </button>
          )}
        </div>
        
        {/* Reply form for this comment - only for first-level comments */}
        {!isNested && replyingTo?.commentId === comment.id && (
          <div className="reply-form">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              rows={2}
            />
            <div className="reply-actions">
              <button onClick={() => handleSubmitReply(suggestionId, comment.id)}>Reply</button>
              <button onClick={cancelReply}>Cancel</button>
            </div>
          </div>
        )}

        {/* Nested comments - only show when toggled */}
        {comment.comments && comment.comments.length > 0 && showComments[comment.id] && (
          <div className="nested-comments">
            {comment.comments.map(nestedComment => 
              renderComment(nestedComment, suggestionId, true)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="suggestions-page">
      <Header />
      <main className="suggestions-main">
        <div className="suggestions-header">
          <h1><i className="fas fa-comments"></i> Community Suggestions</h1>
          <p>Share your thoughts and read experiences from fellow plant lovers</p>
          <button 
            className="refresh-btn" 
            onClick={loadSuggestions}
            title="Refresh suggestions from database"
          >
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>

        <div className="suggestions-content">
          <section className="suggestions-section">
            <div className="section-header">
              <div className="section-icon"><i className="fas fa-lightbulb"></i></div>
              <h2 className="suggestions-title">Share Your Thoughts</h2>
            </div>

            <form className="suggestion-form" onSubmit={handleSubmitSuggestion}>
              <textarea
                className="suggestion-input"
                placeholder="Write your suggestion, experience, or question..."
                value={newSuggestion}
                onChange={(e) => setNewSuggestion(e.target.value)}
                rows={4}
              />
              {error && <div className="suggestion-error">{error}</div>}
              <button className="suggestion-submit" type="submit" disabled={submitting}>
                {submitting ? 'Posting...' : 'Post Suggestion'}
              </button>
            </form>

            <div className="suggestions-list">
              {suggestions.length === 0 ? (
                <div className="empty-state">No suggestions yet. Be the first to share!</div>
              ) : (
                suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="suggestion-item">
                    <div className="suggestion-header">
                      <div className="user-avatar"><i className="fas fa-user"></i></div>
                      <div className="user-info">
                        <div className="user-name">{suggestion.user?.first_name || suggestion.user?.username || 'Customer'}</div>
                        <div className="suggestion-date">{new Date(suggestion.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="suggestion-content">{suggestion.content}</div>
                    
                    {/* Like/Dislike/Reply actions for main suggestion */}
                    <div className="suggestion-actions" onClick={(e) => e.stopPropagation()}>
                      <button 
                        className="action-btn like-btn"
                        onClick={() => handleLike(suggestion.id)}
                      >
                        <i className="fas fa-thumbs-up"></i> {suggestion.likes || 0}
                      </button>
                      <button 
                        className="action-btn dislike-btn"
                        onClick={() => handleDislike(suggestion.id)}
                      >
                        <i className="fas fa-thumbs-down"></i> {suggestion.dislikes || 0}
                      </button>
                      {/* Reply button for every suggestion */}
                      <button 
                        className="action-btn reply-btn" 
                        onClick={() => handleReply(suggestion.id)}
                      >
                        <i className="fas fa-reply"></i> Reply
                      </button>
                      
                      {/* Show comments button only if there are existing comments */}
                      {suggestion.comments && suggestion.comments.length > 0 && (
                        <button 
                          className="action-btn view-comments-btn" 
                          onClick={() => toggleComments(suggestion.id)}
                        >
                          <i className="fas fa-comments"></i> 
                          {showComments[suggestion.id] ? 'Hide Comments' : `Show Comments (${suggestion.comments.length})`}
                        </button>
                      )}
                    </div>

                    {/* Reply form for main suggestion */}
                    {replyingTo?.suggestionId === suggestion.id && replyingTo?.commentId === null && (
                      <div className="reply-form">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write your reply..."
                          rows={2}
                        />
                        <div className="reply-actions">
                          <button onClick={() => handleSubmitReply(suggestion.id)}>Reply</button>
                          <button onClick={cancelReply}>Cancel</button>
                        </div>
                      </div>
                    )}

                    {/* Comments section - only show when toggled */}
                    {suggestion.comments && suggestion.comments.length > 0 && showComments[suggestion.id] && (
                      <div className="comments-section">
                        <div className="comments-header">
                          <h4>
                            <i className="fas fa-comments"></i> 
                            Comments ({suggestion.comments.length})
                            {suggestion.comments.length === 1 ? ' reply' : ' replies'}
                          </h4>
                          <button 
                            className="action-btn reply-btn" 
                            onClick={() => handleReply(suggestion.id)}
                          >
                            <i className="fas fa-reply"></i> Add Reply
                          </button>
                        </div>
                        {suggestion.comments.map(comment => 
                          renderComment(comment, suggestion.id)
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SuggestionsPage;
