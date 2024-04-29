'use client'
import { useState } from 'react';

const CheckoutPage = () => {
    // List of items in cart with updated images and quantities
    const [items, setItems] = useState([
        { id: 1, name: 'Apple', price: 0.50, quantity: 4, imageUrl: '/images/apple.png' },
        { id: 2, name: 'Pear', price: 0.70, quantity: 6, imageUrl: '/images/pear.png' },
        { id: 3, name: 'Banana', price: 0.30, quantity: 7, imageUrl: '/images/banana.png' }
    ]);

    // Coupon code and discount states
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [donateDiscount, setDonateDiscount] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Function to handle coupon code
    const applyCoupon = () => {
        if (couponCode.toLowerCase() === 'banana60') {
            const banana = items.find(item => item.name.toLowerCase() === 'banana');
            if (banana) {
                setDiscount(banana.price * 0.60 * banana.quantity);
            }
        }
    };

    // Calculate total price
    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.07; // Example tax rate of 7%
    const totalPrice = subtotal + tax - (donateDiscount ? 0 : discount);

    return (
        <div>
            {/* Header / Top Bar */}
            <header className="bg-green-700 text-white p-4 w-full">
                <h1 className="text-xl font-bold text-center">Maggie's Grocery</h1>
            </header>
            <div className="container mx-auto mt-10 grid grid-cols-2 gap-4">
                <div className="bg-gray-100 p-4">
                    <h2 className="text-2xl font-bold mb-5">Your Items</h2>
                    {items.map(item => (
                        <div key={item.id} className="flex items-center justify-between my-2 p-2 border-b">
                            <img src={item.imageUrl} alt={item.name} className="w-16 h-16 mr-2" />
                            <span className="flex-1">{item.quantity} x {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="bg-white p-4 shadow">
                    <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                    <div className="mb-2">
                        <label className="block mb-2">
                            Coupon Code:
                            <input 
                                type="text" 
                                placeholder="Enter Code" 
                                value={couponCode} 
                                onChange={(e) => setCouponCode(e.target.value)}
                                className="ml-2 border p-1"
                            />
                        </label>
                        <button 
                            onClick={applyCoupon}
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Apply
                        </button>
                    </div>
                    {discount > 0 && (
                        <div>
                            <p className="text-green-500">Discount applied: -${discount.toFixed(2)}</p>
                            <label className="flex items-center space-x-2">
                                <input 
                                    type="checkbox"
                                    checked={donateDiscount}
                                    onChange={() => setDonateDiscount(!donateDiscount)}
                                />
                                <span>Donate discount to the Chicago Food Depository</span>
                            </label>
                        </div>
                    )}
                    <p>Subtotal: ${subtotal.toFixed(2)}</p>
                    <p>Tax (7%): ${tax.toFixed(2)}</p>
                    <p className="font-bold text-lg">Total: ${totalPrice.toFixed(2)}</p>
                    <button 
                        className="mt-2 text-blue-700 underline"
                        onClick={() => setShowModal(true)}
                    >
                        Learn more about the Chicago Food Depository
                    </button>
                    {showModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
                            <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg">
                                <h3 className="text-lg font-bold">Chicago Food Depository</h3>
                                <p>The Chicago Food Depository is a non-profit organization that acts as a food bank, providing food assistance to the people in need in the Chicago area. They rely on donations to help feed the hungry and also provide education on food insecurity.</p>
                                <button 
                                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
