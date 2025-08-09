# Shopie - Full-Stack E-Commerce Platform

Shopie is a full-stack e-commerce platform using Angular (frontend) and NestJS (backend). Customers can browse, search, and shop. Admins manage products. Includes authentication, cart system, and dynamic stock management.

## Features

- **User Authentication**: Secure login and registration for customers and admins
- **Product Management**: Admins can create, update, and delete products
- **Shopping Cart**: Customers can add products to their cart
- **Product Search**: Customers can search for products by name or description
- **Cloudinary Integration**: Product images are stored and served via Cloudinary
- **Admin Dashboard**: Dedicated admin interface for product management
- **Responsive Design**: Works on desktop and mobile devices

## Cloudinary Integration

This application uses Cloudinary for storing and serving product images. To set up Cloudinary:

1. Sign up for a free Cloudinary account at [https://cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret from your Cloudinary dashboard
3. Update the `.env` file in the backend with your Cloudinary credentials:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Setup Instructions

### Backend (NestJS)

1. Navigate to the `backend` directory
2. Install dependencies: `npm install`
3. Set up your PostgreSQL database and update the `DATABASE_URL` in the `.env` file
4. Update Cloudinary credentials in the `.env` file
5. Run database migrations: `npx prisma migrate dev`
6. Start the server: `npm run start`

### Frontend (Angular)

1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Start the development server: `npm run start`

## Usage

- **Customer Interface**: Access at `http://localhost:4200`
- **Admin Interface**: Access at `http://localhost:4200/admin` (requires admin login)
- **API Documentation**: Available at `http://localhost:3000/api` when the backend is running

## Development

This project uses:
- **Frontend**: Angular 15+ with TypeScript
- **Backend**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **Image Storage**: Cloudinary