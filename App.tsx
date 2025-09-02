
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sender } from './types';
import type { Message, Movie } from './types';
import ChatMessage from './components/ChatMessage';
import MovieCard from './components/MovieCard';
import { getMovieRecommendations } from './services/geminiService';

const questions = [
  "Welcome! I'm your AI movie recommender. To start, what's your favorite movie genre? (e.g., Sci-Fi, Comedy, Romance)",
  "Great taste! Any favorite actors or actresses you'd like to see?",
  "How about the mood? Are you looking for something happy, adventurous, or maybe more thought-provoking?",
  "Do you prefer a classic movie or something that was released in the last few years?",
  "Finally, are you watching alone, with a partner, or with family/friends?",
];

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ sender: Sender.Bot, text: questions[0] }]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, recommendations]);

  const handleUserInputSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = { sender: Sender.User, text: userInput };
    setMessages(prev => [...prev, userMessage]);
    
    const newAnswers = [...answers, userInput];
    setAnswers(newAnswers);
    setUserInput('');

    if (currentQuestionIndex < questions.length - 1) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextQuestionIndex);
      const botMessage: Message = { sender: Sender.Bot, text: questions[nextQuestionIndex] };
      setTimeout(() => setMessages(prev => [...prev, botMessage]), 500);
    } else {
      setIsLoading(true);
      const thinkingMessage: Message = { sender: Sender.Bot, text: "Got it! Analyzing your preferences and finding the perfect movies for you..." };
      setMessages(prev => [...prev, thinkingMessage]);
      
      try {
        const movies = await getMovieRecommendations(newAnswers);
        setRecommendations(movies);
        const finalMessage: Message = { sender: Sender.Bot, text: "Here are a few movies I think you'll love!" };
        setMessages(prev => [...prev, finalMessage]);
      } catch (error) {
        const errorMessage: Message = { sender: Sender.Bot, text: "Sorry, I had trouble finding recommendations. Please try refreshing the page." };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  }, [userInput, isLoading, answers, currentQuestionIndex]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg p-4 text-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-indigo-400">AI Movie Recommender</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
          
          {isLoading && recommendations.length === 0 && (
             <div className="flex items-end gap-3 my-2 justify-start">
              <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-indigo-400"><path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zm-3.873 4.5a.75.75 0 01.75-.75h6.375a.75.75 0 010 1.5H5.502a.75.75 0 01-.75-.75zM15.375 8.25a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0z" clipRule="evenodd" /></svg>
              </div>
              <div className="max-w-md md:max-w-lg lg:max-w-xl p-4 rounded-2xl shadow-md bg-gray-700/50 text-gray-200 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse delay-75"></span>
                <span className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse delay-150"></span>
                <span className="w-2 h-2 bg-indigo-300 rounded-full animate-pulse delay-300"></span>
              </div>
            </div>
          )}

          {recommendations.length > 0 && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-in">
              {recommendations.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
              ))}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </main>

      <footer className="bg-gray-800/50 backdrop-blur-sm p-4 sticky bottom-0">
        <form onSubmit={handleUserInputSubmit} className="max-w-4xl mx-auto">
          {recommendations.length === 0 && (
             <div className="flex items-center bg-gray-700 rounded-full p-2 shadow-inner">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Type your answer..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-400 px-4 py-2"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 rounded-full p-3 transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
                disabled={isLoading || !userInput.trim()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              </button>
            </div>
          )}
        </form>
      </footer>
    </div>
  );
};

export default App;
