
import { GoogleGenAI, Type } from "@google/genai";
import type { Movie } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const movieRecommendationSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: "The full title of the movie.",
      },
      year: {
        type: Type.INTEGER,
        description: "The year the movie was released.",
      },
      description: {
        type: Type.STRING,
        description: "A brief, one-to-two sentence summary of the movie's plot."
      },
      posterPrompt: {
        type: Type.STRING,
        description: "A short, descriptive phrase that captures the movie's visual essence, suitable for an image generation AI. For example, for 'Inception', a prompt could be 'A surreal cityscape folding onto itself, with a lone figure in the foreground.'",
      }
    },
    required: ["title", "year", "description", "posterPrompt"],
  },
};

export const getMovieRecommendations = async (answers: string[]): Promise<Movie[]> => {
  const [genre, actors, mood, era, company] = answers;

  const prompt = `
    Based on the following user preferences, recommend exactly 3 movies.
    - Genre: ${genre}
    - Favorite Actors/Actresses: ${actors}
    - Desired Mood: ${mood}
    - Preferred Era: ${era}
    - Watching With: ${company}

    Provide a diverse list of movies that fit these criteria. Do not recommend movies that are too obscure unless they are a perfect fit.
    Return the result as a JSON array that strictly follows the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: movieRecommendationSchema,
      },
    });

    const jsonText = response.text.trim();
    const recommendations = JSON.parse(jsonText);
    return recommendations as Movie[];
  } catch (error) {
    console.error("Error getting movie recommendations:", error);
    throw new Error("Failed to fetch movie recommendations. Please try again.");
  }
};


export const generateMoviePoster = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Create a stylized, artistic movie poster based on this theme: "${prompt}". Minimalist, high contrast, cinematic lighting. Do not include any text or logos.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '3:4',
        },
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    
    if (base64ImageBytes) {
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
      console.error("Error generating movie poster: No image data found in API response.");
      return 'https://picsum.photos/300/400'; // Fallback image
    }
  } catch (error) {
    console.error("Error generating movie poster:", error);
    // Return a placeholder or throw an error
    return 'https://picsum.photos/300/400';
  }
};
