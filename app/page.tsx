'use client'
import React, { useEffect, useState } from 'react';
import DealCard from "@/components/DealCard";
import { Deal } from '@/types/types';
import { Link } from 'react-router-dom';

// Initial deals data
const initialDeals: Deal[] = [
  { id: 1, title: '50% Off Fresh Apples', description: 'Crisp and delicious apples at half price!', code: 'apple50', imageUrl: '/images/apple.png', distance: 3, discountPercentage: 50, store: "Apple Orchard Grocery" },
  { id: 2, title: '30% Off Organic Milk', description: 'Pure organic milk for your family!', code: 'milk30', imageUrl: '/images/milk.png', distance: 5, discountPercentage: 30, store: "Dairy Delight Grocery" },
  { id: 3, title: '25% Off Bakery Bread', description: 'Freshly baked bread from our local bakery!', code: 'bread25', imageUrl: '/images/bread.png', distance: 2, discountPercentage: 25, store: "Bakery Lane Grocery" },
  { id: 4, title: 'Buy One Get One Free Eggs', description: 'Double up on farm-fresh eggs!', code: 'eggsbogo', imageUrl: '/images/eggs.png', distance: 8, discountPercentage: 100, store: "Eggstreme Grocery" },
  { id: 5, title: '60% Off Bananas', description: 'Sweet bananas at a sweet price!', code: 'banana60', imageUrl: '/images/banana.png', distance: 1, discountPercentage: 60, store: "Maggie's Grocery" },
  { id: 6, title: '70% Off Boxed Cereals', description: 'Start your day with great savings on cereals.', code: 'cereals70', imageUrl: '/images/cereals.png', distance: 10, discountPercentage: 70, store: "Cereal Box Grocery" },
  { id: 7, title: '50% Off Frozen Vegetables', description: 'Stock up on frozen veggies, half off today.', code: 'veggies50', imageUrl: '/images/vegetables.png', distance: 4, discountPercentage: 50, store: "Veggie Variety Grocery" },
  { id: 8, title: 'Buy One Get One Free Coffee', description: 'Wake up with this great deal on premium coffee.', code: 'coffeebogo', imageUrl: '/images/coffee.png', distance: 6, discountPercentage: 100, store: "Coffee Corner Grocery" }
];

export default function Home() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [maxDistance, setMaxDistance] = useState<number>(50);

  useEffect(() => {
    const storedDealsJson = localStorage.getItem('deals');
    if (storedDealsJson) {
      const storedDeals = JSON.parse(storedDealsJson);
      setDeals(storedDeals);
    } else {
      localStorage.setItem('deals', JSON.stringify(initialDeals));
      setDeals(initialDeals);
    }
  }, []);

  // Filter deals based on both search term and distance
  const filteredDeals = deals.filter(deal =>
    (deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    deal.distance <= maxDistance
  );

  const handleLogin = () => {
    const clientID = 'EAAAl-Kdj11vesbZ7IgOjBAuzuFfMzwbRRk_VnO8SCILMwPQ7OXmc8pQf6yAgfDx';
    const redirectURI = encodeURIComponent('http://localhost:3000/callback');
    const authURL = `https://connect.squareup.com/oauth2/authorize?client_id=${clientID}&response_type=code&redirect_uri=${redirectURI}`;

    window.location.href = authURL;
  };



  // Dropdown to select distance
  const handleDistanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMaxDistance(Number(e.target.value));
  };

  return (
    <>
      <header className="bg-black text-white font-bold p-4 flex justify-between items-center">
        <h1 className="text-xl">Square Coupons</h1>
        <div className="flex-grow mx-4">
          <input
            type="text"
            placeholder="Search deals..."
            className="w-full p-2 rounded bg-white text-black"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="bg-white hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
          onClick={() => window.location.href = '/suggest-deals'}
        >
          Maggie's Grocery
        </button>
      </header>
      <div className="max-w-full w-full px-5 py-5">
        Distance: <select
          className="mt-2 p-2 rounded bg-white text-black"
          onChange={handleDistanceChange}
        >
          <option value="50">50 miles</option>
          <option value="20">20 miles</option>
          <option value="5">5 miles</option>
          <option value="1">1 mile</option>
        </select>
        <hr></hr>
        <div className='py-5'>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </div></div>
    </>
  );
}
