'use client';
import { useState } from 'react';
import Link from 'next/link';
import ItemCard from '@/components/ItemCard';

// Mock data - replace with real data fetching
const userListings = [
  {
    id: 1,
    title: "Vintage Denim Jacket",
    category: "Jackets",
    description: "Listed 3 days ago",
    image: "/denim-jacket.jpg",
    status: "Available",
    points: 150
  },
  {
    id: 2,
    title: "Floral Summer Dress",
    category: "Dresses",
    description: "Listed 1 week ago",
    image: "/floral-dress.jpg",
    status: "Pending Swap",
    points: 100
  }
];

const userPurchases = [
  {
    id: 3,
    title: "Classic White Sneakers",
    category: "Shoes",
    description: "Swap completed 2 days ago",
    image: "/sneakers.jpg",
    status: "Completed",
    points: 200
  }
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('listings');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <Link 
          href="/items/new" 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          + List New Item
        </Link>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('listings')}
            className={`py-4 px-1 font-medium text-sm border-b-2 transition ${activeTab === 'listings' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            My Listings ({userListings.length})
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`py-4 px-1 font-medium text-sm border-b-2 transition ${activeTab === 'purchases' ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            My Purchases ({userPurchases.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mb-8">
        {activeTab === 'listings' ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Items You're Offering</h2>
            {userListings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userListings.map((item) => (
                  <div key={item.id} className="relative">
                    <ItemCard item={item} />
                    <span className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${item.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-4">You haven't listed any items yet</p>
                <Link 
                  href="/items/new" 
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  List Your First Item
                </Link>
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Items You've Acquired</h2>
            {userPurchases.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPurchases.map((item) => (
                  <div key={item.id} className="relative">
                    <ItemCard item={item} />
                    <span className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">You haven't acquired any items yet</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium">Swap completed</p>
              <p className="text-sm text-gray-500">White Sneakers • 2 days ago</p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <p className="font-medium">Swap request received</p>
              <p className="text-sm text-gray-500">Floral Dress • 1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}