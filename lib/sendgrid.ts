import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export const sendOrderConfirmation = async (
  email: string,
  orderId: string,
  items: any[],
  total: number
) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Order Confirmation - #${orderId}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order ID: ${orderId}</p>
      <h2>Order Details:</h2>
      <ul>
        ${items.map(item => `
          <li>${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}</li>
        `).join('')}
      </ul>
      <h3>Total: $${total.toFixed(2)}</h3>
      <p>We'll send you a shipping confirmation when your order ships.</p>
    `,
  }

  try {
    await sgMail.send(msg)
    return { success: true }
  } catch (error) {
    console.error('SendGrid error:', error)
    return { success: false, error }
  }
}

export default sgMail