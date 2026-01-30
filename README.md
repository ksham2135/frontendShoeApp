Frontend Shoe App

A modern frontend web application built with Vite, React, TypeScript, Tailwind CSS, and shadcn-ui, featuring a clean UI and Supabase integration.

🚀 Tech Stack

Vite – Fast frontend build tool

React – UI library

TypeScript – Type-safe JavaScript

Tailwind CSS – Utility-first CSS framework

shadcn-ui – Reusable UI components

Supabase – Backend-as-a-Service (Auth / Database)

📁 Project Setup
Prerequisites

Make sure you have installed:

Node.js (v18 or later recommended)

npm / yarn / pnpm

🔧 Installation

Clone the repository:

git clone https://github.com/your-username/frontendShoeApp.git
cd frontendShoeApp


Install dependencies:

npm install


Run the development server:

npm run dev


The app will be available at:

http://localhost:5173

🔐 Environment Variables

This project uses Supabase and requires environment variables.

Create a .env file locally (do not commit this file):

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
VITE_SUPABASE_PROJECT_ID=your_project_id


⚠️ Important:

Environment variables must start with VITE_ to be accessible in the browser.

Never expose Supabase service role keys in a frontend app.

🏗️ Build for Production
npm run build


Preview the production build locally:

npm run preview

☁️ Deployment (Vercel)

This project is fully compatible with Vercel.

Steps:

Push the project to GitHub

Import the repository into Vercel

Framework preset: Vite

Output directory: dist

Add environment variables in:

Project Settings → Environment Variables


Click Deploy

Vercel will automatically build and deploy the app.

🌍 Custom Domain

You can connect a custom domain via:

Vercel Dashboard → Project → Settings → Domains

🧪 Notes & Best Practices

.env files should be added to .gitignore

Only use public Supabase keys in the frontend

Styling is handled via Tailwind CSS and shadcn-ui

Project follows a modern, scalable frontend structure

📄 License

This project is licensed for personal and educational use.
