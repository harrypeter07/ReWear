import ItemCard from '@/components/ItemCard';

// Mock data - replace with real data fetching
const getItems = async () => {
  // In a real app, you would fetch from your API:
  // const res = await fetch('/api/items');
  // return await res.json();

  return [
    {
      id: 1,
      title: "Vintage Denim Jacket",
      category: "Jackets",
      description: "Light wash denim jacket from the 90s in excellent condition",
      size: "M",
      image: "/denim-jacket.jpg",
      points: 150
    },
    {
      id: 2,
      title: "Floral Summer Dress",
      category: "Dresses",
      description: "Lightweight cotton dress with floral pattern",
      size: "S",
      image: "/floral-dress.jpg",
      points: 100
    },
    {
      id: 3,
      title: "Classic White Sneakers",
      category: "Shoes",
      description: "Like-new condition, size 9",
      size: "9",
      image: "/sneakers.jpg"
    }
  ];
};

export default async function ItemsPage() {
  const items = await getItems();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
        <div className="flex gap-4">
          <select className="border rounded px-3 py-2 text-sm">
            <option>All Categories</option>
            <option>Jackets</option>
            <option>Dresses</option>
            <option>Shoes</option>
          </select>
          <select className="border rounded px-3 py-2 text-sm">
            <option>Sort By</option>
            <option>Newest</option>
            <option>Points: Low to High</option>
          </select>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No items available yet</p>
          <Link 
            href="/items/new" 
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            List an Item
          </Link>
        </div>
      )}
    </div>
  );
}