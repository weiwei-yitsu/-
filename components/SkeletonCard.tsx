
import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white overflow-hidden border border-gray-100 flex flex-col h-full animate-pulse">
      <div className="aspect-[4/3] bg-gray-200" />
      <div className="p-5 flex flex-col flex-grow">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-50 rounded w-full" />
          <div className="h-3 bg-gray-50 rounded w-full" />
          <div className="h-3 bg-gray-50 rounded w-2/3" />
        </div>
        <div className="pt-4 border-t border-gray-50 mt-auto">
          <div className="h-3 bg-gray-50 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
