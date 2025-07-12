// lib/db.js
import clientPromise from './mongodb';

export async function getDB() {
  const client = await clientPromise;
  return client.db('rewear_db');
}

export async function getCollections() {
  const db = await getDB();
  return {
    users: db.collection('users'),
    items: db.collection('items'),
    swaps: db.collection('swap_requests'),
    notifications: db.collection('notifications'),
  };
}
