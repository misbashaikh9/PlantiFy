import React, { useState, useEffect, useRef } from 'react';
import { aiService } from '../services/aiService';
import '../styles/GuidedAIChat.css';

const GuidedAIChat = ({ isOpen, onClose }) => {
    const [conversation, setConversation] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userId] = useState(`user_${Date.now()}`);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            startNewConversation();
        }
    }, [isOpen]);

    const startNewConversation = async () => {
        try {
            setIsLoading(true);
            const response = await aiService.startGuidedConversation(userId);
            
            if (response.success) {
                const aiMessage = {
                    id: Date.now(),
                    type: response.data.type,
                    message: response.data.message,
                    options: response.data.options || [],
                    suggestions: response.data.suggestions || [],
                    category: response.data.category,
                    question_number: response.data.question_number,
                    total_questions: response.data.total_questions,
                    ml_prediction: response.data.ml_prediction,
                    ml_recommendation: response.data.ml_recommendation,
                    ml_diagnosis: response.data.ml_diagnosis
                };
                
                setMessages(prev => [...prev, aiMessage]);
                setConversation(response.data);
            }
        } catch (error) {
            console.error('Error starting conversation:', error);
            setMessages([{
                id: Date.now(),
                type: 'error',
                message: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategorySelect = async (categoryId) => {
        try {
            setIsLoading(true);
            const response = await aiService.selectGuidedCategory(userId, categoryId);
            
            if (response.success) {
                const aiMessage = {
                    id: Date.now(),
                    type: response.data.type,
                    message: response.data.message,
                    category: response.data.category,
                    question_number: response.data.question_number,
                    total_questions: response.data.total_questions,
                    options: response.data.options || [],
                    ml_prediction: response.data.ml_prediction,
                    ml_recommendation: response.data.ml_recommendation,
                    ml_diagnosis: response.data.ml_diagnosis
                };
                
                setMessages(prev => [...prev, aiMessage]);
                setConversation(response.data);
            }
        } catch (error) {
            console.error('Error selecting category:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: userInput
        };

        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const response = await aiService.sendGuidedMessage(userId, userInput);
            
            if (response.success) {
                console.log('🎯 Guided AI Response Received (handleSendMessage):', response.data);
                console.log('📊 ML Data Check (handleSendMessage):', {
                    ml_prediction: response.data.ml_prediction,
                    ml_recommendation: response.data.ml_recommendation,
                    ml_diagnosis: response.data.ml_diagnosis
                });
                
                const aiMessage = {
                    id: Date.now(),
                    type: response.data.type,
                    message: response.data.message,
                    options: response.data.options || [],
                    suggestions: response.data.suggestions || [],
                    category: response.data.category,
                    question_number: response.data.question_number,
                    total_questions: response.data.total_questions,
                    ml_prediction: response.data.ml_prediction,
                    ml_recommendation: response.data.ml_recommendation,
                    ml_diagnosis: response.data.ml_diagnosis
                };
                
                console.log('🤖 AI Message Created (handleSendMessage):', aiMessage);
                setMessages(prev => [...prev, aiMessage]);
                setConversation(response.data);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, {
                id: Date.now(),
                type: 'error',
                message: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        if (suggestion === 'Start new conversation') {
            startNewConversation();
        } else {
            setUserInput(suggestion);
        }
    };

    const handleOptionSelect = async (option) => {
        if (isLoading) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: option
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await aiService.sendGuidedMessage(userId, option);
            
            if (response.success) {
                console.log('🎯 Guided AI Response Received:', response.data);
                console.log('📊 ML Data Check:', {
                    ml_prediction: response.data.ml_prediction,
                    ml_recommendation: response.data.ml_recommendation,
                    ml_diagnosis: response.data.ml_diagnosis
                });
                
                const aiMessage = {
                    id: Date.now(),
                    type: response.data.type,
                    message: response.data.message,
                    options: response.data.options || [],
                    suggestions: response.data.suggestions || [],
                    category: response.data.category,
                    question_number: response.data.question_number,
                    total_questions: response.data.total_questions,
                    ml_prediction: response.data.ml_prediction,
                    ml_recommendation: response.data.ml_recommendation,
                    ml_diagnosis: response.data.ml_diagnosis
                };
                
                console.log('🤖 AI Message Created:', aiMessage);
                setMessages(prev => [...prev, aiMessage]);
                setConversation(response.data);
            } else {
                console.error('AI response error:', response.error);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async () => {
        try {
            await aiService.resetGuidedConversation(userId);
            startNewConversation();
        } catch (error) {
            console.error('Error resetting conversation:', error);
        }
    };

    const renderMessage = (message) => {
        if (message.type === 'user') {
            return (
                <div className="message user-message">
                    <div className="message-content">{message.content}</div>
                </div>
            );
        }

        return (
            <div className="message ai-message">
                <div className="message-content">
                    <div className="ai-avatar">🤖</div>
                    <div className="message-text">
                                                 {message.type === 'main_categories' && (
                             <div className="category-selection">
                                 <h3>{message.message}</h3>
                                 <div className="category-options">
                                     {message.options.map((option) => (
                                         <button
                                             key={option.id}
                                             className="category-option"
                                             onClick={() => handleCategorySelect(option.id)}
                                             disabled={isLoading}
                                         >
                                                                                      <div className="category-title">{option.title}</div>
                                         <div className="category-description">{option.description}</div>
                                         </button>
                                     ))}
                                 </div>
                             </div>
                         )}
                         
                         {message.type === 'greeting' && (
                             <div className="greeting-message">
                                 <div className="simple-message">{message.message}</div>
                                 {message.options && message.options.length > 0 && (
                                     <div className="category-options">
                                         {message.options.map((option) => (
                                             <button
                                                 key={option.id}
                                                 className="category-option"
                                                 onClick={() => handleCategorySelect(option.id)}
                                                 disabled={isLoading}
                                             >
                                                 <div className="category-title">{option.title}</div>
                                                 <div className="category-description">{option.description}</div>
                                             </button>
                                         ))}
                                     </div>
                                 )}
                             </div>
                         )}
                        
                        {message.type === 'question' && (
                            <div className="question-message">
                                <div className="question-progress">
                                    Question {message.question_number} of {message.total_questions}
                                </div>
                                <div className="question-text">{message.message}</div>
                                {message.options && message.options.length > 0 && (
                                    <div className="question-options">
                                        <h4>Choose your answer:</h4>
                                        <div className="option-buttons">
                                            {message.options.map((option, index) => (
                                                <button
                                                    key={index}
                                                    className="option-btn"
                                                    onClick={() => handleOptionSelect(option)}
                                                    disabled={isLoading}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {message.type === 'detailed_answer' && (
                            <div className="detailed-answer">
                                <div className="answer-content">{message.message}</div>
                                
                                {/* Display ML Prediction Data */}
                                {message.ml_prediction && (
                                    <div className="ml-prediction">
                                        <h4>🤖 ML Analysis Results:</h4>
                                        <div className="ml-data">
                                            <div className="ml-item">
                                                <strong>Success Probability:</strong>
                                                <div className="ml-value">
                                                    {message.ml_prediction.success_probability ? 
                                                        `${(message.ml_prediction.success_probability * 100).toFixed(1)}%` : 
                                                        'N/A'
                                                    }
                                                </div>
                                            </div>
                                            <div className="ml-item">
                                                <strong>Confidence:</strong>
                                                <div className={`ml-value confidence-${message.ml_prediction.confidence || 'medium'}`}>
                                                    {message.ml_prediction.confidence || 'N/A'}
                                                </div>
                                            </div>
                                            {message.ml_prediction.recommendations && (
                                                <div className="ml-item">
                                                    <strong>ML Recommendations:</strong>
                                                    <ul>
                                                        {message.ml_prediction.recommendations.map((rec, idx) => (
                                                            <li key={idx}>{rec}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Display ML Recommendation Data */}
                                {message.ml_recommendation && (
                                    <div className="ml-prediction">
                                        <h4>🤖 ML Analysis Results:</h4>
                                        <div className="ml-data">
                                            <div className="ml-item">
                                                <strong>Fertilizer Type:</strong>
                                                <div className="ml-value">
                                                    {message.ml_recommendation.fertilizer_type || 'N/A'}
                                                </div>
                                            </div>
                                            <div className="ml-item">
                                                <strong>Confidence:</strong>
                                                <div className={`ml-value confidence-${message.ml_recommendation.confidence > 0.7 ? 'high' : message.ml_recommendation.confidence > 0.5 ? 'medium' : 'low'}`}>
                                                    {message.ml_recommendation.confidence ? 
                                                        `${(message.ml_recommendation.confidence * 100).toFixed(0)}%` : 
                                                        'N/A'
                                                    }
                                                </div>
                                            </div>
                                            {message.ml_recommendation.seasonal_adjustments && (
                                                <div className="ml-item">
                                                    <strong>Seasonal Adjustments:</strong>
                                                    <ul>
                                                        {message.ml_recommendation.seasonal_adjustments.map((adj, idx) => (
                                                            <li key={idx}>{adj}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Display ML Diagnosis Data */}
                                {message.ml_diagnosis && (
                                    <div className="ml-prediction">
                                        <h4>🤖 ML Analysis Results:</h4>
                                        <div className="ml-data">
                                            <div className="ml-item">
                                                <strong>Diagnosis:</strong>
                                                <div className="ml-value">
                                                    {message.ml_diagnosis.diagnosis || 'N/A'}
                                                </div>
                                            </div>
                                            <div className="ml-item">
                                                <strong>Confidence:</strong>
                                                <div className={`ml-value confidence-${message.ml_diagnosis.confidence > 0.7 ? 'high' : message.ml_diagnosis.confidence > 0.5 ? 'medium' : 'low'}`}>
                                                    {message.ml_diagnosis.confidence ? 
                                                        `${(message.ml_diagnosis.confidence * 100).toFixed(0)}%` : 
                                                        'N/A'
                                                    }
                                                </div>
                                            </div>
                                            {message.ml_diagnosis.treatment && (
                                                <div className="ml-item">
                                                    <strong>Treatment:</strong>
                                                    <div className="ml-value">
                                                        {message.ml_diagnosis.treatment}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {message.suggestions && (
                                    <div className="suggestions">
                                        <h4>What would you like to do next?</h4>
                                        <div className="suggestion-buttons">
                                            {message.suggestions.map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    className="suggestion-btn"
                                                    onClick={() => handleSuggestionClick(suggestion)}
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {message.type === 'error' && (
                            <div className="error-message">{message.message}</div>
                        )}
                        
                        {!message.type && (
                            <div className="simple-message">{message.message}</div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (!isOpen) return null;

    return (
        <div className="guided-ai-chat-overlay">
            <div className="guided-ai-chat-modal">
                <div className="guided-ai-chat-header">
                    <h2>🌿 Guided Plant Care AI</h2>
                    <div className="header-actions">
                        <button 
                            className="reset-btn"
                            onClick={handleReset}
                            disabled={isLoading}
                        >
                            🔄 Reset
                        </button>
                        <button 
                            className="close-btn"
                            onClick={onClose}
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="guided-ai-chat-messages">
                    {messages.map((message) => (
                        <div key={message.id}>
                            {renderMessage(message)}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="message ai-message">
                            <div className="message-content">
                                <div className="ai-avatar">🤖</div>
                                <div className="message-text">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Show helpful message when options are available */}
                {messages.length > 0 && 
                 messages[messages.length - 1]?.type === 'ai' && 
                 messages[messages.length - 1]?.options && 
                 messages[messages.length - 1]?.options.length > 0 && (
                    <div className="options-help">
                        💡 <strong>Tip:</strong> Click on one of the options above for a faster response!
                    </div>
                )}

                <form onSubmit={handleSendMessage} className="guided-ai-chat-input">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Choose an option above or type your answer here..."
                        disabled={isLoading}
                        className="message-input"
                    />
                    <button 
                        type="submit" 
                        disabled={!userInput.trim() || isLoading}
                        className="send-btn"
                    >
                        {isLoading ? '⏳' : '📤'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GuidedAIChat;
