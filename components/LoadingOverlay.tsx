
import React from 'react';
import { SparklesIcon } from './icons';

const messages = [
  "Styling your pixels...",
  "Tailoring the perfect look...",
  "Warming up the AI's fashion sense...",
  "This might take a moment...",
  "Generating your virtual outfit...",
  "Almost ready for the runway..."
];

const LoadingOverlay: React.FC = () => {
    const [message, setMessage] = React.useState(messages[0]);

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = messages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % messages.length;
                return messages[nextIndex];
            });
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);


  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex flex-col items-center justify-center z-50">
      <div className="relative flex items-center justify-center">
        <div className="w-24 h-24 border-4 border-purple-500/30 rounded-full"></div>
        <div className="w-24 h-24 border-4 border-t-purple-500 rounded-full animate-spin absolute"></div>
        <SparklesIcon className="w-10 h-10 text-purple-400 absolute" />
      </div>
      <p className="mt-6 text-lg font-semibold text-gray-200 animate-pulse transition-all duration-500">{message}</p>
    </div>
  );
};

export default LoadingOverlay;
