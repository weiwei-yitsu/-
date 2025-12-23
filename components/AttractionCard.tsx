
import React from 'react';
import { Attraction } from '../types';

interface AttractionCardProps {
  attraction: Attraction;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction }) => {
  // 優先使用景點圖片，若無則顯示佔位圖
  const imageUrl = attraction.images.length > 0 
    ? attraction.images[0].src 
    : `https://images.unsplash.com/photo-1513413173476-2aa219808396?auto=format&fit=crop&w=800&q=80`;

  return (
    <div className="group flex flex-col h-full bg-white border border-gray-100 card-transition overflow-hidden">
      {/* 圖片區域 */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={imageUrl}
          alt={attraction.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1513413173476-2aa219808396?auto=format&fit=crop&w=800&q=80';
          }}
        />
        {/* 類別標籤 */}
        {attraction.category[0] && (
          <div className="absolute top-4 left-4">
            <span className="bg-white/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 text-black">
              {attraction.category[0].name}
            </span>
          </div>
        )}
      </div>

      {/* 資訊區域 */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-blue-900 transition-colors">
            {attraction.name}
          </h3>
          <span className="text-[11px] font-medium text-gray-400 mt-1.5 uppercase tracking-tighter">
            ID: {attraction.id}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4 text-gray-400">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <span className="text-xs font-medium truncate">{attraction.address}</span>
        </div>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-6 flex-grow">
          {attraction.introduction || "這是一個充滿故事的台北景點，等待您的親自探訪。"}
        </p>

        <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
          <a 
            href={attraction.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors inline-flex items-center gap-2"
          >
            探索詳情
            <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AttractionCard;
