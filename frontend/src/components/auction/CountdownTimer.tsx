import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endTime: Date;
  compact?: boolean;
  onComplete?: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  endTime, 
  compact = false,
  onComplete,
}) => {
  const calculateTimeLeft = () => {
    const difference = new Date(endTime).getTime() - new Date().getTime();
    
    if (difference <= 0) {
      if (onComplete) onComplete();
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatTime = (value: number) => {
    return value < 10 ? `0${value}` : value;
  };

  const isEnded = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  // For compact display (e.g. cards)
  if (compact) {
    if (isEnded) {
      return <span className="text-red-500 font-medium">Ended</span>;
    }
    
    // Just show most significant unit
    if (timeLeft.days > 0) {
      return <span className="text-white font-medium">{timeLeft.days}d {timeLeft.hours}h</span>;
    } else if (timeLeft.hours > 0) {
      return <span className="text-white font-medium">{timeLeft.hours}h {timeLeft.minutes}m</span>;
    } else {
      return <span className="text-white font-medium">{timeLeft.minutes}m {timeLeft.seconds}s</span>;
    }
  }

  // For detailed display (e.g. auction page)
  if (isEnded) {
    return <div className="text-red-500 font-bold text-lg">Auction Ended</div>;
  }

  return (
    <div className="flex space-x-2 text-white">
      {timeLeft.days > 0 && (
        <div className="text-center">
          <div className="bg-gray-900 px-2 py-1 rounded-md font-mono font-bold">
            {formatTime(timeLeft.days)}
          </div>
          <div className="text-xs text-gray-400 mt-1">Days</div>
        </div>
      )}

      <div className="text-center">
        <div className="bg-gray-900 px-2 py-1 rounded-md font-mono font-bold">
          {formatTime(timeLeft.hours)}
        </div>
        <div className="text-xs text-gray-400 mt-1">Hours</div>
      </div>

      <div className="text-center">
        <div className="bg-gray-900 px-2 py-1 rounded-md font-mono font-bold">
          {formatTime(timeLeft.minutes)}
        </div>
        <div className="text-xs text-gray-400 mt-1">Min</div>
      </div>

      <div className="text-center">
        <div className="bg-gray-900 px-2 py-1 rounded-md font-mono font-bold">
          {formatTime(timeLeft.seconds)}
        </div>
        <div className="text-xs text-gray-400 mt-1">Sec</div>
      </div>
    </div>
  );
};