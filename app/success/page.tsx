'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart)

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
      <h1 className="text-4xl font-bold mb-4">Order Successful!</h1>
      <p className="text-xl text-gray-600 mb-8">
        Thank you for your purchase. You will receive an email confirmation shortly.
      </p>
      <Link
        href="/"
        className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 inline-block"
      >
        Continue Shopping
      </Link>
    </div>
  )
}