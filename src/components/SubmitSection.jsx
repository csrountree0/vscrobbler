import { useState, useEffect } from 'react';
import { submit_scrobble } from '../api/lastfmApi';

function SubmitSection({ searchParams, submitMessage, setSubmitMessage }) {
  const [currentTime, setCurrentTime] = useState('');
  const [isTimeManual, setIsTimeManual] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check login status
    if (localStorage.getItem('sk')) {
      setIsLoggedIn(true);
    }
  }, []);

  // Function to update time
  const updateTime = () => {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);
  };

  // Set initial time
  useEffect(() => {
    updateTime();
  }, []);

  // Set up interval for time updates if not manual
  useEffect(() => {
    let interval;
    if (!isTimeManual) {
      interval = setInterval(updateTime, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimeManual]);

  const handleTimeChange = (e) => {
    setCurrentTime(e.target.value);
    setIsTimeManual(true);
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      alert('Please log in to Last.fm first');
      return;
    }

    if (!searchParams) {
      alert('Please search for an album first');
      return;
    }

    const params = { ...searchParams };
    params.sk = localStorage.getItem('sk');
    const success = await submit_scrobble(params, currentTime);
    if (success) {
      setSubmitMessage({ text: 'Album Scrobbled!', color: 'text-green-400' });
    } else {
      setSubmitMessage({ text: 'An error occurred.', color: 'text-red-400' });
    }
  };

  return (
    <div className="bg-[#2a2a2a] p-8 rounded-lg shadow-lg flex flex-col gap-4 items-center">
      <div className="flex gap-4">
        <input
          type="time"
          value={currentTime}
          onChange={handleTimeChange}
          className="px-4 py-3 rounded bg-[#3a3a3a] text-white border-none focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button 
          className="px-6 py-3 bg-red-600 text-white rounded font-bold hover:bg-red-500 hover:scale-105 transition-all duration-200 cursor-pointer"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      {submitMessage.text && (
        <p className={`text-center ${submitMessage.color}`}>
          {submitMessage.text}
        </p>
      )}
    </div>
  );
}

export default SubmitSection; 