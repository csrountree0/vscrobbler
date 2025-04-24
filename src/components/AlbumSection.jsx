import { useState } from 'react';
import { searchDiscogs } from '../api/discogsApi';

function AlbumSection({ onAlbumFound }) {
  const [albumInfo, setAlbumInfo] = useState({ title: '', artist: '', image: '' });
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');
  const [hasTimestamps, setHasTimestamps] = useState(true);

  const handleSearch = async () => {
    setError('');
    setHasTimestamps(true);
    const result = await searchDiscogs(searchText);
    
    if (result.success) {
      // Check if any track has a duration
      const hasValidTimestamps = result.data.params.timestamp.some(time => time > 0);
      setHasTimestamps(hasValidTimestamps);
      
      setAlbumInfo({
        title: result.data.title,
        artist: result.data.artist,
        image: result.data.image
      });
      onAlbumFound(result.data.params);
    } else {
      setError(result.error);
      setAlbumInfo({ title: '', artist: '', image: '' });
      onAlbumFound(null);
    }
  };

  const handleClear = () => {
    setSearchText('');
    setAlbumInfo({ title: '', artist: '', image: '' });
    setError('');
    setHasTimestamps(true);
    onAlbumFound(null);
  };

  return (
    <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-lg">
      <div className="flex gap-4 mb-8">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Enter Discogs Release Code or URL"
          className="flex-1 px-4 py-3 rounded bg-[#3a3a3a] text-white border-none focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button 
          className="px-6 py-3 bg-red-600 text-white rounded font-bold hover:bg-red-500 hover:scale-105 transition-all duration-200 cursor-pointer"
          onClick={handleSearch}
        >
          Search
        </button>
        {albumInfo.image && (
          <button 
            className="px-6 py-3 bg-gray-600 text-white rounded font-bold hover:bg-gray-500 hover:scale-105 transition-all duration-200 cursor-pointer"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </div>
      
      {error && (
        <p className="text-red-400 mb-4 text-center">{error}</p>
      )}
      
      {!hasTimestamps && albumInfo.image && (
        <p className="text-yellow-400 mb-4 text-center">
          Warning: This album doesn't have track durations. Please try to find a release with track durations.
        </p>
      )}
      
      <div className="flex flex-col items-center">
        {albumInfo.image ? (
          <>
            <div className="w-full text-center mb-4">
              <h2 className="text-2xl font-semibold mb-2 text-red-400">{albumInfo.title}</h2>
              <p className="text-gray-400 text-lg">{albumInfo.artist}</p>
            </div>
            <div className="max-w-[300px]">
              <img 
                src={albumInfo.image} 
                alt="Album cover" 
                className="w-full rounded shadow-lg"
              />
            </div>
          </>
        ) : (
          <div className="text-center text-gray-400">
            <h3 className="text-xl font-semibold mb-4">How to use vScrobbler</h3>
            <ol className="list-decimal list-inside space-y-2 text-left max-w-md mx-auto">
              <li>Find your album on <a href="https://www.discogs.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">Discogs.com</a></li>
              <li>Copy the release ID or URL (e.g., 16150880, [r14409008])</li>
              <li>Paste the ID or URL in the search box above</li>
              <li>Click Search to find your album</li>
              <li>Set the time and click Submit to scrobble</li>
            </ol>
            <p className="mt-6 text-sm">
              Note: You need to link your <a href="https://www.last.fm" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">Last.fm</a> account to submit scrobbles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AlbumSection; 