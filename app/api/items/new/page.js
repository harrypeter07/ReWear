'use client';
import ItemForm from "@/components/ItemForm";
import { useRouter } from 'next/navigation';

export default function AddItemPage() {
  const router = useRouter();

  const handleCreate = async (data) => {
    const res = await fetch("/api/items/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (res.ok) {
      alert("Item created successfully!");
      router.push("/items");
    } else {
      alert(`Error: ${result.error}`);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Add New Item</h1>
      <ItemForm onSubmit={handleCreate} />
    </main>
  );
}
