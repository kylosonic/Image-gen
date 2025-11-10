
import React, { useState } from 'react';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';

type Tab = 'generate' | 'edit';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generate');

  const TabButton = ({ tab, label }: { tab: Tab, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`w-full py-3 px-4 text-sm font-bold transition-colors duration-300 focus:outline-none ${
        activeTab === tab
          ? 'bg-blue-600 text-white'
          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col items-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center my-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Gemini Image Studio
          </h1>
          <p className="text-gray-400 mt-2">Create and modify images with the power of AI</p>
        </header>

        <main>
          <div className="flex w-full max-w-md mx-auto rounded-lg overflow-hidden border border-gray-700 mb-8">
            <TabButton tab="generate" label="Generate Image" />
            <TabButton tab="edit" label="Edit Image" />
          </div>

          <div className="bg-gray-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-gray-700">
            {activeTab === 'generate' && <ImageGenerator />}
            {activeTab === 'edit' && <ImageEditor />}
          </div>
        </main>
        
        <footer className="text-center text-gray-500 mt-8 text-sm">
          <p>Powered by Google Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
