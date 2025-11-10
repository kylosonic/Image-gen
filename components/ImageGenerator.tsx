
import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { AspectRatio } from '../types';
import { ASPECT_RATIOS } from '../constants';
import Spinner from './Spinner';

const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateImage(prompt, aspectRatio);
      setGeneratedImage(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
            Image Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A majestic lion wearing a crown, cinematic lighting"
            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none h-24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Aspect Ratio
          </label>
          <div className="flex flex-wrap gap-2">
            {ASPECT_RATIOS.map((ratio) => (
              <label key={ratio} className="cursor-pointer">
                <input
                  type="radio"
                  name="aspectRatio"
                  value={ratio}
                  checked={aspectRatio === ratio}
                  onChange={() => setAspectRatio(ratio)}
                  className="sr-only"
                />
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    aspectRatio === ratio
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
                  }`}
                >
                  {ratio}
                </span>
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-transform duration-200 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? <Spinner /> : 'Generate Image'}
        </button>
      </form>
      {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>}
      <div className="mt-4 w-full aspect-square bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
        {isLoading && (
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-2 text-gray-400">Generating your masterpiece...</p>
          </div>
        )}
        {generatedImage && (
          <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
        )}
        {!isLoading && !generatedImage && (
            <div className="text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p>Your generated image will appear here</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenerator;
