
import React, { useState } from 'react';
import { editImage } from '../services/geminiService';
import { fileToBase64 } from '../utils/imageUtils';
import Spinner from './Spinner';

interface OriginalImage {
    file: File;
    base64: string;
    mimeType: string;
    dataUrl: string;
}

const ImageEditor: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [originalImage, setOriginalImage] = useState<OriginalImage | null>(null);
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const { base64, mimeType, dataUrl } = await fileToBase64(file);
                setOriginalImage({ file, base64, mimeType, dataUrl });
                setEditedImage(null);
                setError(null);
            } catch (err) {
                setError('Failed to read image file.');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt) {
            setError('Please enter an editing prompt.');
            return;
        }
        if (!originalImage) {
            setError('Please upload an image to edit.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setEditedImage(null);

        try {
            const imageUrl = await editImage(prompt, originalImage.base64, originalImage.mimeType);
            setEditedImage(imageUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const ImagePlaceholder = ({ children }: { children: React.ReactNode }) => (
        <div className="w-full aspect-square bg-gray-700 rounded-lg flex flex-col items-center justify-center p-4 text-center">
            {children}
        </div>
    );
    
    return (
        <div className="flex flex-col gap-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label htmlFor="image-upload" className="block text-sm font-medium text-gray-300 mb-2">
                        Upload Image
                    </label>
                    <label
                        htmlFor="image-upload"
                        className="relative cursor-pointer bg-gray-700 border-2 border-dashed border-gray-500 rounded-md p-6 flex flex-col items-center justify-center hover:border-blue-500 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-4-4V6a4 4 0 014-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293H12a4 4 0 014 4v1.586a1 1 0 01-.293.707l-1.414 1.414a1 1 0 00-.707.293H9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                        <span className="mt-2 block text-sm font-medium text-gray-300">{originalImage ? originalImage.file.name : 'Click to upload an image'}</span>
                        <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>
                <div>
                    <label htmlFor="edit-prompt" className="block text-sm font-medium text-gray-300 mb-2">
                        Editing Prompt
                    </label>
                    <textarea
                        id="edit-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Add a retro filter, remove the background"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-none h-24"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading || !originalImage}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-transform duration-200 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? <Spinner /> : 'Edit Image'}
                </button>
            </form>
            {error && <div className="text-red-400 bg-red-900/50 p-3 rounded-md">{error}</div>}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-center text-gray-400">Original</h3>
                    {originalImage ? (
                        <div className="w-full aspect-square bg-gray-700 rounded-lg overflow-hidden">
                            <img src={originalImage.dataUrl} alt="Original" className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        // FIX: Pass children to ImagePlaceholder component to satisfy its prop requirements.
                        <ImagePlaceholder>
                           <p className="text-gray-500">Your uploaded image will appear here</p>
                        </ImagePlaceholder>
                    )}
                </div>
                <div>
                     <h3 className="text-lg font-semibold mb-2 text-center text-gray-400">Edited</h3>
                    {isLoading ? (
                        // FIX: Pass children to ImagePlaceholder component to satisfy its prop requirements.
                        <ImagePlaceholder>
                             <Spinner size="lg" />
                             <p className="mt-2 text-gray-400">Applying your edits...</p>
                        </ImagePlaceholder>
                    ) : editedImage ? (
                        <div className="w-full aspect-square bg-gray-700 rounded-lg overflow-hidden">
                            <img src={editedImage} alt="Edited" className="w-full h-full object-contain" />
                        </div>
                    ) : (
                        // FIX: Pass children to ImagePlaceholder component to satisfy its prop requirements.
                        <ImagePlaceholder>
                           <p className="text-gray-500">Your edited image will appear here</p>
                        </ImagePlaceholder>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;
