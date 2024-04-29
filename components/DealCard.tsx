// components/DealCard.tsx
import React from 'react';
import Image from 'next/image';
import { Deal } from '@/types/types';

interface DealProps {
  deal: Deal;
}

const DealCard: React.FC<DealProps> = ({ deal }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white relative">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={deal.imageUrl}
          alt={deal.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 ease-in-out transform group-hover:scale-110"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900">{deal.title}</h3>
        <p className="text-gray-600">{deal.description}</p>
        <div className="mt-2">
          <span className="text-lg font-semibold text-red-500">CODE: {deal.code}</span>
          <div className="text-sm font-medium text-gray-700">Distance: {deal.distance} miles</div>
          <div className="text-sm font-medium text-gray-700">Store: {deal.store}</div>
        </div>
      </div>
    </div>
  );
};

export default DealCard;
