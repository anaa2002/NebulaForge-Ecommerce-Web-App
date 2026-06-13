# Nebula Forge

*The ultimate destination for premium cosmic hardware.*

## About

Nebula Forge is a full-stack, high-performance e-commerce platform built to handle specialized hardware inventory with precision. Featuring secure authentication, real-time cart state management, and seamless Stripe integration, it provides a smooth, enterprise-grade shopping experience.


## Tech Stack

* **Frontend:** React, Vite, Axios, React Context API.
* **Backend:** Node.js, Express, MongoDB/Mongoose.
* **Payments:** Stripe API (with Webhooks for secure order verification).
* **Authentication:** JWT-based system with secure token refresh logic.

## Key Features

* **Secure Payment Flow:** Fully integrated Stripe checkout with webhook verification to guarantee payment success.
* **Database Inventory Management:** Automatic inventory updates via webhooks using atomic `$inc` operations.
* **Custom Auth Flow:** Secure, token-refreshed authentication with guest checkout fallback support.
* **UX:** Search functionality enhanced with custom debounce hooks to optimize API calls.
* **Modular Architecture:** Clean file structure for controllers, middleware, models, and contexts.

## Setup Guide

### 1. Installation

Clone the repository:

```bash
git clone https://github.com/anaa2002/NebulaForge-Ecommerce-Web-App.git

```

### 2. Environment Variables

Create a `.env` file in the root of both directories.
**Backend:**

* `MONGODB_URI`
* `STRIPE_SECRET_KEY`
* `STRIPE_WEBHOOK_SECRET`
* `JWT_SECRET`

**Frontend:**

* `VITE_API_BASE_URL`
* `VITE_STRIPE_PUBLISHABLE_KEY`

### 3. Run Locally

* **Backend:** `npm run dev`
* **Frontend:** `npm run dev`

