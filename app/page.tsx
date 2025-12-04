import ProductGrid from '@/components/ProductGrid'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">Welcome to Our Store</h1>
        <p className="text-xl text-gray-600">Discover amazing products at great prices</p>
      </div>
      <ProductGrid />
    </div>
  )
}