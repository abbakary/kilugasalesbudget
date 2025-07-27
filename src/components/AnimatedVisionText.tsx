import React, { useState, useEffect } from 'react';

const AnimatedVisionText: React.FC = () => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const colors = [
    'text-yellow-500',
    'text-blue-500',
    'text-yellow-600',
    'text-blue-600',
    'text-yellow-400',
    'text-blue-400'
  ];

  const visionText = "Trust you can take a year to build but a minute to destroy";

  useEffect(() => {
    const colorInterval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % colors.length);
    }, 1000); // Change color every second

    const visibilityInterval = setInterval(() => {
      setIsVisible(prev => !prev);
    }, 3000); // Fade in/out every 3 seconds

    return () => {
      clearInterval(colorInterval);
      clearInterval(visibilityInterval);
    };
  }, [colors.length]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-3 z-40 overflow-hidden">
      <div className="relative">
        {/* Moving text animation */}
        <div className="animate-marquee whitespace-nowrap">
          <span 
            className={`inline-block px-4 text-lg font-bold transition-all duration-500 ${
              colors[currentColorIndex]
            } ${
              isVisible ? 'opacity-100' : 'opacity-70'
            }`}
            style={{
              textShadow: '0 0 10px currentColor',
              animation: 'bounce 2s infinite'
            }}
          >
            {visionText}
          </span>
          <span 
            className={`inline-block px-4 text-lg font-bold transition-all duration-500 ${
              colors[(currentColorIndex + 1) % colors.length]
            } ${
              isVisible ? 'opacity-100' : 'opacity-70'
            }`}
            style={{
              textShadow: '0 0 10px currentColor',
              animation: 'bounce 2s infinite 0.5s'
            }}
          >
            {visionText}
          </span>
          <span 
            className={`inline-block px-4 text-lg font-bold transition-all duration-500 ${
              colors[(currentColorIndex + 2) % colors.length]
            } ${
              isVisible ? 'opacity-100' : 'opacity-70'
            }`}
            style={{
              textShadow: '0 0 10px currentColor',
              animation: 'bounce 2s infinite 1s'
            }}
          >
            {visionText}
          </span>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translate3d(100%, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-3px);
          }
          60% {
            transform: translateY(-1px);
          }
        }
        
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default AnimatedVisionText;
