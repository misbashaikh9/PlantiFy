import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../services/aiService';
import Swal from 'sweetalert2';
import '../styles/AIChat.css';

const AIChat = ({ isOpen, onClose, chatStyle = 'friendly' }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: "🌱 Hello! I'm your AI Plant Care Assistant. I can help you with:\n\n• Plant care advice\n• Fertilizer recommendations\n• Growing tips\n• Plant identification help\n\nWhat would you like to know about your plants?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiService.chatWithAI(inputMessage, chatStyle);
      
      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: response.data,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: `❌ Sorry, I encountered an error: ${response.error}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "❌ Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = async (question) => {
    setInputMessage(question);
    // Simulate sending the quick question
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await aiService.chatWithAI(question, chatStyle);
      
      if (response.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: response.data,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: `❌ Sorry, I encountered an error: ${response.error}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: "❌ Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ai-chat-overlay" onClick={onClose}>
      <div className="ai-chat-container" onClick={(e) => e.stopPropagation()}>
        {/* Chat Header */}
        <div className="ai-chat-header">
          <div className="ai-chat-title">
            <span className="ai-avatar">🤖</span>
            <h3>AI Plant Care Assistant</h3>
          </div>
          <button className="ai-chat-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Quick Questions */}
        <div className="quick-questions">
          <h4>Quick Questions:</h4>
          <div className="quick-question-buttons">
            <button onClick={() => handleQuickQuestion("How do I care for my Monstera?")}>
              🌿 Monstera Care
            </button>
            <button onClick={() => handleQuickQuestion("What fertilizer for my Snake Plant?")}>
              🌱 Fertilizer Help
            </button>
            <button onClick={() => handleQuickQuestion("How often should I water my plants?")}>
              💧 Watering Tips
            </button>
          </div>
        </div>

        {/* Messages Container */}
        <div className="ai-chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`ai-message ${message.type}`}>
              <div className="ai-message-content">
                {message.content}
              </div>
              <div className="ai-message-timestamp">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="ai-message ai">
              <div className="ai-message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form className="ai-chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me about your plants..."
            disabled={isLoading}
            className="ai-chat-input"
          />
          <button 
            type="submit" 
            disabled={!inputMessage.trim() || isLoading}
            className="ai-chat-send-btn"
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChat;
