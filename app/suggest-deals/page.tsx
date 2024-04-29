'use client';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('body');

const SuggestDeals = () => {
  const [items, setItems] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentDeal, setCurrentDeal] = useState({
    id: 0,
    title: '',
    description: '',
    code: '',
    imageUrl: '/path/to/default/image.png',
    distance: 0,
    discountPercentage: 10  // Default discount percentage
  });

  const wasteData = {
    apple: { goingToWaste: 5, expectedSold: 71 },
    banana: { goingToWaste: 30, expectedSold: 38 }
  };

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/square');
      const data = await response.json();
      const filteredItems = data.objects.filter(obj => obj.type === 'ITEM');
      setItems(filteredItems);
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const generateCouponCode = () => {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const calculateDiscount = (item) => {
    let name = item.item_data.name.toLowerCase();
    let basePrice = item.item_data.variations[0].item_variation_data.price_money.amount / 100;
    if (name.includes('apple')) {
      let discount = wasteData.apple.goingToWaste / (wasteData.apple.expectedSold + wasteData.apple.goingToWaste);
      return basePrice * (1 - discount);
    } else if (name.includes('banana')) {
      // Fixed 60% discount for bananas
      return basePrice * 0.40; // 60% off means selling at 40% of the base price
    }
    return basePrice;
  };

  const handleSaveDeal = () => {
    const newDeal = { ...currentDeal };
    const existingDealsJson = localStorage.getItem('deals');
    const existingDeals = existingDealsJson ? JSON.parse(existingDealsJson) : [];
    localStorage.setItem('deals', JSON.stringify([...existingDeals, newDeal]));
    console.log('Adding new deal:', newDeal);
    setModalIsOpen(false); // Close modal after saving
  };

  const handleAddDealClick = (item) => {
    let discount = calculateDiscount(item);
    let imageUrl = '/path/to/default/image.png'; // Fallback default image
    let itemName = item.item_data.name.toLowerCase();
    let basePrice = item.item_data.variations[0].item_variation_data.price_money.amount / 100;
    let discountPercentage = ((1 - (discount / basePrice)) * 100).toFixed(0);

    if (itemName.includes('apple')) {
      imageUrl = '/images/apple.png';
    } else if (itemName.includes('banana')) {
      imageUrl = '/images/banana.png';
    }

    setCurrentDeal({
      id: new Date().getTime(),
      title: `Save Now! ${discountPercentage}% Off on ${item.item_data.name}`, // Improved title with dynamic discount percentage and item name
      description: `Special offer on ${item.item_data.name} - ${discountPercentage}% off. Don't miss this great deal!`, // Default description with dynamic details
      code: generateCouponCode(),
      imageUrl: imageUrl,
      distance: Math.floor(Math.random() * 50) + 1,
      discountPercentage: discountPercentage
    });
    setModalIsOpen(true);
  };

  return (
    <div>
      <header className="bg-green-700 text-white p-4 w-full">
        <h1 className="text-xl font-bold text-center">Maggie's Grocery</h1>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-center my-6">Suggested Deals</h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => {
            let name = item.item_data.name.toLowerCase();
            let imageUrl = '/path/to/default/image.png'; // Fallback image
            let stock = 0; // Default stock
            let suggestedPrice = calculateDiscount(item).toFixed(2); // Calculated suggested price

            if (name.includes('apple')) {
              imageUrl = '/images/apple.png';
              stock = 81; // Example stock number for apples
            } else if (name.includes('banana')) {
              imageUrl = '/images/banana.png';
              stock = 68; // Example stock number for bananas
            }

            return (
              <li key={item.item_data.variations[0].item_variation_data.item_id} className="bg-white shadow-lg rounded-lg p-4 hover:bg-gray-50">
                <div className="flex flex-col items-center">
                  <img src={imageUrl} alt={item.item_data.name} className="w-24 h-24 object-cover rounded-full" />
                  <h2 className="text-lg font-semibold">{item.item_data.name}</h2>
                  <p className="text-sm text-gray-600 mb-1">
                    Price: ${item.item_data.variations[0].item_variation_data.price_money.amount / 100}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    Suggested Price: ${suggestedPrice}
                  </p>
                  <p className="text-sm text-gray-600">Stock: {stock}</p>
                  <p className="text-sm text-blue-600">Expected Sold: {name.includes('banana') ? wasteData.banana.expectedSold : wasteData.apple.expectedSold}</p>
                  <button
                    className="mt-4 bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleAddDealClick(item)}>
                    Add Deal
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          contentLabel="Deal Modal"
        >
          <div className="flex flex-col space-y-4 p-4">
            <h2 className="text-xl font-semibold">Edit Deal</h2>
            <label className="block">
              <span className="text-gray-700">Deal Title</span>
              <input type="text" className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={currentDeal.title} onChange={(e) => setCurrentDeal({ ...currentDeal, title: e.target.value })} />
            </label>
            <label className="block">
              <span className="text-gray-700">Deal Description</span>
              <textarea
                className="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                value={currentDeal.description}
                onChange={(e) => setCurrentDeal({ ...currentDeal, description: e.target.value })}
                rows="3"
              ></textarea>
            </label>
            <label className="block">
              <span className="text-gray-700">Coupon Code</span>
              <input type="text" className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={currentDeal.code} onChange={(e) => setCurrentDeal({ ...currentDeal, code: e.target.value })} />
            </label>
            <label className="block">
              <span className="text-gray-700">Discount Percentage</span>
              <input type="number" className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={currentDeal.discountPercentage} min="0" max="100" onChange={(e) => setCurrentDeal({ ...currentDeal, discountPercentage: parseInt(e.target.value) })} />
            </label>
            <label className="block">
              <span className="text-gray-700">Image URL</span>
              <input type="text" className="form-input mt-1 block w-full rounded-md border-gray-300 shadow-sm" value={currentDeal.imageUrl} onChange={(e) => setCurrentDeal({ ...currentDeal, imageUrl: e.target.value })} />
            </label>
            <button className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded" onClick={handleSaveDeal}>Save Deal</button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default SuggestDeals;
