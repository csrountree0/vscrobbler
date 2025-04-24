import { useState } from 'react';
import { searchDiscogs } from '../api/discogsApi';

function AlbumSection({ onAlbumFound, onClear }) {
  const [albumInfo, setAlbumInfo] = useState({ title: '', artist: '', image: '', params: null });
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState('');
  const [hasTimestamps, setHasTimestamps] = useState(true);
  const [manualDurations, setManualDurations] = useState([]);
  const [showDurationForm, setShowDurationForm] = useState(false);

  const handleSearch = async () => {
    setError('');
    setHasTimestamps(true);
    setShowDurationForm(false);
    const result = await searchDiscogs(searchText);
    
    if (result.success) {
      // Check if any track has a duration
      const hasValidTimestamps = result.data.params.timestamp.some(time => time > 0);
      setHasTimestamps(hasValidTimestamps);
      
      setAlbumInfo({
        title: result.data.title,
        artist: result.data.artist,
        image: result.data.image,
        params: result.data.params
      });

      if (!hasValidTimestamps) {
        setManualDurations(new Array(result.data.params.track.length).fill({ minutes: '', seconds: '' }));
        setShowDurationForm(true);
      }

      onAlbumFound(result.data.params);
    } else {
      setError(result.error);
      setAlbumInfo({ title: '', artist: '', image: '', params: null });
      onAlbumFound(null);
    }
  };

  const handleDurationChange = (index, field, value) => {
    const newDurations = [...manualDurations];
    newDurations[index] = {
      ...newDurations[index],
      [field]: value
    };
    setManualDurations(newDurations);
  };

  const handleDurationSubmit = () => {
    // Convert minutes and seconds to total seconds
    const durationsInSeconds = manualDurations.map(duration => {
      const minutes = parseInt(duration.minutes) || 0;
      const seconds = parseInt(duration.seconds) || 0;
      return (minutes * 60) + seconds;
    });

    // Update the params with new durations
    const updatedParams = { ...albumInfo.params };
    updatedParams.timestamp = durationsInSeconds;
    
    setHasTimestamps(true);
    setShowDurationForm(false);
    onAlbumFound(updatedParams);
  };

  const handleClear = () => {
    setSearchText('');
    setAlbumInfo({ title: '', artist: '', image: '', params: null });
    setError('');
    setHasTimestamps(true);
    setShowDurationForm(false);
    onClear();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-[#2a2a2a] p-4 sm:p-8 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative w-full">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter Discogs Release Code or URL"
            className="w-full px-4 py-2 sm:py-3 rounded bg-[#3a3a3a] text-white border-none focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base pr-10"
          />
          <button 
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        {albumInfo.image && (
          <button 
            className="px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded font-bold hover:bg-gray-500 hover:scale-105 transition-all duration-200 cursor-pointer text-sm sm:text-base"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </div>
      
      {error && (
        <p className="text-red-400 mb-4 text-center">{error}</p>
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
            {!hasTimestamps && albumInfo.image && (
              <div className="mt-4 text-yellow-400 text-center">
                <p>Warning: This release doesn't have track durations. Add them manually, or find a release with track durations.</p>
                {!showDurationForm && (
                  <button 
                    className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded font-bold hover:bg-yellow-500 hover:scale-105 transition-all duration-200 cursor-pointer"
                    onClick={() => setShowDurationForm(true)}
                  >
                    Add Track Durations
                  </button>
                )}
              </div>
            )}
            {showDurationForm && albumInfo.params && (
              <div className="mt-4 p-4 bg-[#3a3a3a] rounded-lg w-full max-w-md">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">Enter Track Durations</h3>
                <div className="space-y-3">
                  {albumInfo.params.track.map((track, index) => (
                    <div key={index} className="flex items-center justify-center gap-4">
                      <span className="text-gray-400 w-48 text-center">{track}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={manualDurations[index]?.minutes || ''}
                          onChange={(e) => handleDurationChange(index, 'minutes', e.target.value)}
                          placeholder="MM"
                          min="0"
                          className="px-3 py-2 rounded bg-[#2a2a2a] text-white border-none focus:outline-none focus:ring-2 focus:ring-red-500 w-16 text-center"
                        />
                        <span className="text-gray-400 text-xl">:</span>
                        <input
                          type="number"
                          value={manualDurations[index]?.seconds || ''}
                          onChange={(e) => handleDurationChange(index, 'seconds', e.target.value)}
                          placeholder="SS"
                          min="0"
                          max="59"
                          className="px-3 py-2 rounded bg-[#2a2a2a] text-white border-none focus:outline-none focus:ring-2 focus:ring-red-500 w-16 text-center"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <button 
                    className="px-4 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-500 hover:scale-105 transition-all duration-200 cursor-pointer"
                    onClick={handleDurationSubmit}
                  >
                    Save Durations
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-400">
            <h3 className="text-xl font-semibold mb-4">How to use vScrobbler</h3>
            <ol className="list-decimal list-inside space-y-2 text-left max-w-md mx-auto">
              <li>Find your album on <a href="https://www.discogs.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">Discogs.com</a></li>
              <li>Copy the release ID or URL (e.g., 16150880, [r14409008])</li>
              <li>Paste the ID or URL in the search box above</li>
              <li>Press Enter or click the magnifying glass to find your album</li>
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