export const getWelcomeTemplate = (email: string) => {
  return {
    subject: 'Welcome to IM Investments - Your Account is Ready!',
    text: `Welcome to IM Investments! Your account has been created successfully. Start exploring our amazing products and enjoy shopping with us.`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to IM Investments</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .header-text { color: #e0e7ff; font-size: 16px; }
            .content { padding: 40px 30px; }
            .welcome-title { color: #1e293b; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
            .welcome-text { color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 30px; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .features { background-color: #f8fafc; padding: 30px; border-radius: 8px; margin: 30px 0; }
            .feature { display: flex; align-items: center; margin-bottom: 15px; }
            .feature-icon { width: 20px; height: 20px; background-color: #3b82f6; border-radius: 50%; margin-right: 15px; }
            .footer { background-color: #1e293b; color: #94a3b8; padding: 30px; text-align: center; font-size: 14px; }
            .social-links { margin: 20px 0; }
            .social-link { display: inline-block; margin: 0 10px; color: #3b82f6; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">IM Investments</div>
              <div class="header-text">Your Trusted E-Commerce Partner</div>
            </div>
            
            <div class="content">
              <h1 class="welcome-title">Welcome to IM Investments! 🎉</h1>
              
              <p class="welcome-text">
                Hi there! We're thrilled to have you join our community of smart shoppers. 
                Your account has been successfully created and you're all set to start exploring 
                our amazing collection of products.
              </p>
              
              <div class="features">
                <h3 style="color: #1e293b; margin-bottom: 20px;">What you can do now:</h3>
                <div class="feature">
                  <div class="feature-icon"></div>
                  <span>Browse thousands of quality products</span>
                </div>
                <div class="feature">
                  <div class="feature-icon"></div>
                  <span>Add items to your cart and wishlist</span>
                </div>
                <div class="feature">
                  <div class="feature-icon"></div>
                  <span>Track your orders in real-time</span>
                </div>
                <div class="feature">
                  <div class="feature-icon"></div>
                  <span>Enjoy exclusive deals and offers</span>
                </div>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.APP_BASE_URL || 'http://localhost:4200'}/customer/marketplace" class="cta-button">
                  Start Shopping Now
                </a>
              </div>
              
              <p class="welcome-text">
                If you have any questions or need assistance, our support team is here to help. 
                Feel free to reach out to us at any time.
              </p>
            </div>
            
            <div class="footer">
              <div class="social-links">
                <a href="#" class="social-link">Facebook</a>
                <a href="#" class="social-link">Twitter</a>
                <a href="#" class="social-link">Instagram</a>
              </div>
              <p>© 2024 IM Investments. All rights reserved.</p>
              <p>Contact us: support@iminvestments.com | +254 769 380 557</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
};