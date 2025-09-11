export interface PaymentConfirmationData {
  customerEmail: string;
  orderId: number;
  totalAmount: number;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
  paymentDate: string;
}

export const getPaymentConfirmationTemplate = (data: PaymentConfirmationData) => {
  const itemsHtml = data.items.map(item => `
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td style="padding: 15px 0; color: #1e293b;">${item.productName}</td>
      <td style="padding: 15px 0; text-align: center; color: #64748b;">${item.quantity}</td>
      <td style="padding: 15px 0; text-align: right; color: #1e293b; font-weight: bold;">$${item.price.toFixed(2)}</td>
      <td style="padding: 15px 0; text-align: right; color: #1e293b; font-weight: bold;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return {
    subject: `Payment Confirmation - Order #${data.orderId} | IM Investments`,
    text: `
      Thank you for your purchase!
      
      Order #${data.orderId}
      Total Amount: $${data.totalAmount.toFixed(2)}
      Payment Date: ${data.paymentDate}
      
      Items:
      ${data.items.map(item => `- ${item.productName} (Qty: ${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}
      
      Your order is being processed and you'll receive a shipping confirmation soon.
      
      Thank you for shopping with IM Investments!
    `,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payment Confirmation</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 30px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .header-text { color: #d1fae5; font-size: 16px; }
            .content { padding: 40px 30px; }
            .success-icon { width: 60px; height: 60px; background-color: #10b981; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; }
            .title { color: #1e293b; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
            .order-info { background-color: #f8fafc; padding: 25px; border-radius: 8px; margin: 30px 0; }
            .order-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .order-id { color: #1e293b; font-size: 18px; font-weight: bold; }
            .order-date { color: #64748b; font-size: 14px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table-header { background-color: #e2e8f0; }
            .table-header th { padding: 15px 10px; text-align: left; color: #1e293b; font-weight: bold; font-size: 14px; }
            .total-row { background-color: #f1f5f9; font-weight: bold; }
            .total-amount { color: #10b981; font-size: 20px; font-weight: bold; }
            .next-steps { background-color: #eff6ff; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #3b82f6; }
            .footer { background-color: #1e293b; color: #94a3b8; padding: 30px; text-align: center; font-size: 14px; }
            .support-info { margin: 20px 0; padding: 20px; background-color: #f8fafc; border-radius: 8px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">IM Investments</div>
              <div class="header-text">Payment Confirmation</div>
            </div>
            
            <div class="content">
              <div class="success-icon">
                <svg width="30" height="30" fill="white" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
              </div>
              
              <h1 class="title">Payment Successful! 🎉</h1>
              
              <p style="color: #64748b; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 30px;">
                Thank you for your purchase! Your payment has been processed successfully and your order is now being prepared.
              </p>
              
              <div class="order-info">
                <div class="order-header">
                  <div>
                    <div class="order-id">Order #${data.orderId}</div>
                    <div class="order-date">Placed on ${data.paymentDate}</div>
                  </div>
                  <div style="text-align: right;">
                    <div style="color: #10b981; font-size: 14px; font-weight: bold;">PAID</div>
                  </div>
                </div>
                
                <table class="items-table">
                  <thead class="table-header">
                    <tr>
                      <th>Product</th>
                      <th style="text-align: center;">Qty</th>
                      <th style="text-align: right;">Price</th>
                      <th style="text-align: right;">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                    <tr class="total-row">
                      <td colspan="3" style="padding: 20px 0; color: #1e293b; font-weight: bold; border-top: 2px solid #e2e8f0;">Total Amount:</td>
                      <td style="padding: 20px 0; text-align: right; border-top: 2px solid #e2e8f0;" class="total-amount">$${data.totalAmount.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="next-steps">
                <h3 style="color: #1e293b; margin-bottom: 15px; font-size: 18px;">What happens next?</h3>
                <ul style="color: #64748b; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Your order is being processed by our team</li>
                  <li>You'll receive a shipping confirmation within 24-48 hours</li>
                  <li>Track your order status in your dashboard</li>
                  <li>Estimated delivery: 3-5 business days</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.APP_BASE_URL || 'http://localhost:4200'}/customer/orders" 
                   style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 10px;">
                  Track Your Order
                </a>
                <a href="${process.env.APP_BASE_URL || 'http://localhost:4200'}/customer/marketplace" 
                   style="display: inline-block; background: white; color: #3b82f6; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; border: 2px solid #3b82f6; margin: 10px;">
                  Continue Shopping
                </a>
              </div>
              
              <div class="support-info">
                <h4 style="color: #1e293b; margin-bottom: 10px;">Need Help?</h4>
                <p style="color: #64748b; margin: 0;">
                  Our customer support team is here to help! Contact us at 
                  <a href="mailto:support@iminvestments.com" style="color: #3b82f6;">support@iminvestments.com</a> 
                  or call us at <strong>+254 769 380 557</strong>
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p style="margin-bottom: 10px;">Thank you for choosing IM Investments!</p>
              <p>© 2024 IM Investments. All rights reserved.</p>
              <p style="margin-top: 15px; font-size: 12px;">
                This email was sent to ${data.customerEmail}. 
                If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
};