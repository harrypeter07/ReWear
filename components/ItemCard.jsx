'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function ItemCard({ item }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col h-full">
      <Link href={`/items/${item.id}`} className="block">
        {/* Improved image handling with Next.js Image */}
        <div className="relative aspect-square mb-3 rounded overflow-hidden">
          <Image
            src={item.image || "/images/default.png"}
            alt={item.title || "Clothing item"}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <h2 className="font-semibold text-lg line-clamp-2">{item.title}</h2>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded ml-2">
              {item.category}
            </span>
          </div>

          <p className="text-gray-600 text-sm mt-1">{item.size || 'One Size'}</p>
          <p className="text-gray-500 text-sm mt-2 line-clamp-3">{item.description}</p>
        </div>
      </Link>

      {/* Action Buttons */}
      <div className="mt-4 flex gap-2">
        <Link 
          href={`/swap/${item.id}`} 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-3 rounded text-sm transition"
        >
          Request Swap
        </Link>
        {item.points && (
          <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm transition">
            {item.points} pts
          </button>
        )}
      </div>
    </div>
  );
}