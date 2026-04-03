import React from 'react';

const Loader = ({ fullScreen = false, text = "Loading..." }) => {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
      </div>
      {text && <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 min-h-screen bg-gray-50/80 dark:bg-bg-dark/80 backdrop-blur-sm flex items-center justify-center z-50">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="w-full py-12 flex items-center justify-center">
      {loaderContent}
    </div>
  );
};

export default Loader;
