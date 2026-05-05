import { useState } from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-spin"></div>
        <div className="absolute inset-1 bg-white rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
