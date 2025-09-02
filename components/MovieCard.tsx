
import React, { useState, useEffect } from 'react';
import { generateMoviePoster } from '../services/geminiService';
import type { Movie } from '../types';


const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => {
  const [posterUrl, setPosterUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPoster = async () => {
      setIsLoading(true);
      try {
        const url = await generateMoviePoster(movie.posterPrompt);
        setPosterUrl(url);
      } catch (error) {
        console.error('Failed to generate poster:', error);
        setPosterUrl('https://picsum.photos/300/400'); // Fallback image
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPoster();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movie.posterPrompt]);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300 w-full max-w-sm">
      <div className="relative h-96">
        {isLoading ? (
          <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
             <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.55a2.5 2.5 0 010 4.09L15 18M3 8a2 2 0 012-2h4a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"></path></svg>
          </div>
        ) : (
          <img src={posterUrl} alt={`Poster for ${movie.title}`} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-1">{movie.title}</h3>
        <p className="text-indigo-400 font-semibold mb-3">{movie.year}</p>
        <p className="text-gray-300 text-sm">{movie.description}</p>
      </div>
    </div>
  );
};

export default MovieCard;
