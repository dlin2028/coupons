'use client'
import React, { useEffect, useState } from 'react';
import AddDealForm from '@/components/AddDealForm';
import {Deal} from '@/types/types'

const AddDealPage: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);

  // Load deals from local storage on component mount
  useEffect(() => {
    const storedDealsJson = localStorage.getItem('deals');
    if (storedDealsJson) {
      const storedDeals: Deal[] = JSON.parse(storedDealsJson);
      setDeals(storedDeals);
    }
  }, []);

  // Function to add a new deal to the local storage
  const handleAddDeal = (newDeal: Deal) => {
    const updatedDeals = [...deals, newDeal];
    setDeals(updatedDeals);
    localStorage.setItem('deals', JSON.stringify(updatedDeals));
  };

  return (
    <div>
      <h1 className="text-xl font-bold text-center">Add a New Deal</h1>
      <AddDealForm onAdd={handleAddDeal} />
    </div>
  );
};

export default AddDealPage;
