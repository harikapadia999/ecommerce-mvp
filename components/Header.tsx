'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart } from 'lucide-react'

export default function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems())

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            E-Commerce MVP
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-blue-600">
              Products
            </Link>
            <Link href="/cart" className="relative hover:text-blue-600">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}