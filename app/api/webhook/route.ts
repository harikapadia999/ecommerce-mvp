import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'
import { sendOrderConfirmation } from '@/lib/sendgrid'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      const items = JSON.parse(session.metadata?.items || '[]')
      
      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_email: session.customer_email,
          total_amount: session.amount_total! / 100,
          status: 'paid',
          stripe_payment_id: session.payment_intent as string,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }))

      await supabase.from('order_items').insert(orderItems)

      // Send confirmation email
      await sendOrderConfirmation(
        session.customer_email!,
        order.id,
        items,
        session.amount_total! / 100
      )

      console.log('Order created successfully:', order.id)
    } catch (error) {
      console.error('Error processing order:', error)
    }
  }

  return NextResponse.json({ received: true })
}