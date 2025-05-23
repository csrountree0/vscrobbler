import { useState } from 'react';
//import { getSK } from './lastfmstuff';
import { searchDiscogs } from './api/discogsApi';
import Header from './components/Header';
import AlbumSection from './components/AlbumSection';
import SubmitSection from './components/SubmitSection';

function App() {
  const [searchParams, setSearchParams] = useState(null);
  const [submitMessage, setSubmitMessage] = useState({ text: '', color: '' });

  const handleAlbumFound = (params) => {
    setSearchParams(params);
    setSubmitMessage({ text: '', color: '' }); // Clear message on new search
  };

  const handleClear = () => {
    setSearchParams(null);
    setSubmitMessage({ text: '', color: '' }); // Clear message when album is cleared
  };

  return (
    <div className="min-h-screen w-full bg-[#1a1a1a] text-white flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto my-4 sm:my-8 px-4 sm:px-8 space-y-4 sm:space-y-8">
        <AlbumSection onAlbumFound={handleAlbumFound} onClear={handleClear} />
        <SubmitSection searchParams={searchParams} submitMessage={submitMessage} setSubmitMessage={setSubmitMessage} />
      </main>
    </div>
  );
}

export default App;
