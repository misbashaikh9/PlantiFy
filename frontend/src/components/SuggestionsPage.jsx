import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import '../styles/MagazinePage.css';
import { suggestionAPI } from '../services/api';

const SuggestionsPage = () => {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [newSuggestion, setNewSuggestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleBackToHome = () => navigate('/');

  const loadSuggestions = async () => {
    try {
      const data = await suggestionAPI.list();
      setSuggestions(data);
    } catch (e) {
      console.error('Failed to load suggestions', e);
    }
  };

  useEffect(() => { loadSuggestions(); }, []);

  const handleSubmitSuggestion = async (e) => {
    e.preventDefault();
    setError('');
    const content = newSuggestion.trim();
    if (content.length < 3) {
      setError('Please write at least 3 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await suggestionAPI.create(content);
      setNewSuggestion('');
      await loadSuggestions();
    } catch (e) {
      console.error('Failed to submit suggestion', e);
      setError('Please sign in to post or try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="magazine-page">
      <Header />
      <main className="magazine-main">
        <div className="magazine-header">
          <button className="back-btn" onClick={handleBackToHome}>← Back to Home</button>
          <h1>💬 Community Suggestions</h1>
          <p>Share your thoughts and read experiences from fellow plant lovers</p>
        </div>

        <div className="magazine-content">
          <section className="magazine-section">
            <div className="section-header">
              <div className="section-icon">🗨️</div>
              <h2>Share Your Thoughts</h2>
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
                suggestions.map((s) => (
                  <div key={s.id} className="suggestion-item">
                    <div className="suggestion-header">
                      <div className="user-avatar">👤</div>
                      <div className="user-info">
                        <div className="user-name">{s.user?.first_name || s.user?.username || 'Customer'}</div>
                        <div className="suggestion-date">{new Date(s.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="suggestion-content">{s.content}</div>
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
