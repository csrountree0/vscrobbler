import { useState, useEffect, useRef } from 'react';
import { fmlogin, getSK } from '../api/lastfmApi';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('sk') !== null);
  const isProcessing = useRef(false);

  useEffect(() => {
    const checkLogin = async () => {
      if (!isProcessing.current) {
        isProcessing.current = true;
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (token && !localStorage.getItem('sk')) {
          localStorage.setItem('token', token);
          let r = await getSK();
          if(r) {
            setIsLoggedIn(true);
            const basePath = '/vscrobbler/';
            window.history.replaceState({}, '', basePath);
          }
        }
        isProcessing.current = false;
      }
    };

    checkLogin();
  }, []);

  const handleLogin = async () => {
    await fmlogin();
  };

  const handleLogout = () => {
    localStorage.removeItem('sk');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <header className="bg-[#0a0a0a] py-4 px-4 sm:px-8 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex gap-4 sm:gap-6 text-gray-400">
          <a href="https://www.discogs.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-red-400 transition-colors">
            <div className="bg-white rounded-full">
              <img src="https://logosandtypes.com/wp-content/uploads/2024/07/discogs.svg" alt="Discogs" className="h-6 w-auto" />
            </div>
            <span className="hidden sm:inline">Discogs</span>
          </a>
          <a href="https://www.last.fm" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-red-400 transition-colors">
            <img src="https://cdn4.iconfinder.com/data/icons/iconsimple-logotypes/512/last_fm-512.png" alt="Last.fm" className="h-6 w-auto" />
            <span className="hidden sm:inline">Last.fm</span>
          </a>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white absolute left-1/2 -translate-x-1/2">vScrobbler</h1>
        {isLoggedIn ? (
          <button 
            onClick={handleLogout}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded hover:bg-red-500 text-sm sm:text-base"
          >
            Unlink
          </button>
        ) : (
          <button 
            onClick={handleLogin}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded hover:bg-red-500 cursor-pointer text-sm sm:text-base"
          >
            Link Last.fm
          </button>
        )}
      </div>
    </header>
  );
}

export default Header; 