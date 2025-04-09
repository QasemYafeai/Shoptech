// app/products/[id]/page.tsx (Server Component)
import { notFound } from 'next/navigation';
import ProductDetailClient from './ProductDetailClient';

// Define proper types for Next.js Pages
interface ProductPageParams {
  id: string;
}

interface ProductPageProps {
  params: ProductPageParams;
  searchParams?: Record<string, string | string[] | undefined>;
}

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

// Fetch a single product by ID from your Express backend
async function getProductById(id: string): Promise<Product | null> {
  try {
    // Update this to use env variable for API URL in production
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${apiUrl}/products/${id}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  // Make sure params is properly awaited and validated
  if (!params || !params.id) {
    notFound();
  }

  const product = await getProductById(params.id);

  if (!product) {
    notFound(); 
  }

  // Pass product data to the client component
  return <ProductDetailClient product={product} />;
}