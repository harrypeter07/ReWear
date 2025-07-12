'use client';
import { useState } from 'react';

export default function ItemForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    size: '',
    condition: '',
    uploaderId: '', // can be hardcoded for now
    imageFile: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setForm(prev => ({ ...prev, imageFile: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.imageFile) {
      alert("Please upload an image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      const payload = {
        title: form.title,
        description: form.description,
        category: form.category,
        size: form.size,
        condition: form.condition,
        uploaderId: form.uploaderId || "64f5cdd83e5b110fc1aeff98", // Replace with actual user ID
        images: [base64Image]
      };

      await onSubmit(payload);
    };
    reader.readAsDataURL(form.imageFile);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="text" name="title" placeholder="Title" onChange={handleChange} required />
      <textarea name="description" placeholder="Description" onChange={handleChange} required />
      <input type="text" name="category" placeholder="Category" onChange={handleChange} required />
      <input type="text" name="size" placeholder="Size" onChange={handleChange} required />
      <input type="text" name="condition" placeholder="Condition" onChange={handleChange} required />
      <input type="file" name="imageFile" accept="image/*" onChange={handleFileChange} required />
      <button type="submit">Submit</button>
    </form>
  );
}
