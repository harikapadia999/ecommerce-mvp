'use client'

import { useCartStore } from '@/store/cartStore'
import Image from 'next/image'
import Link from 'next/link'
import { Trash2, Plus, Minus } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleCheckout = async () => {
    if (!email) {
      alert('Please enter your email')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, email }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise
      await stripe?.redirectToCheckout({ sessionId })
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Checkout failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 mb-4 flex gap-4">
              <div className="relative w-24 h-24">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-blue-600 font-bold">${item.price.toFixed(2)}</p>
                
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-auto text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
            >
              {loading ? 'Processing...' : 'Proceed to Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}