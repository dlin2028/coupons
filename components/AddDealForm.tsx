// components/AddDealForm.tsx
import React, { useState } from 'react';

interface Deal {
  id: number;
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}

interface AddDealFormProps {
  onAdd: (deal: Deal) => void;
}

const AddDealForm: React.FC<AddDealFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newDeal: Deal = {
      id: new Date().getTime(),
      title,
      description,
      price,
      imageUrl
    };
    onAdd(newDeal);
    setTitle('');
    setDescription('');
    setPrice('');
    setImageUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4">
      <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required />
      <input type="text" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required />
      <input type="text" placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)} required />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Add Deal
      </button>
    </form>
  );
};

export default AddDealForm;