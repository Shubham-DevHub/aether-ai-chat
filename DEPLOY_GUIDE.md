# 🚀 Complete Deployment & GitHub Publishing Guide

This guide describes how to import your **Aether AI** full-stack chat application into a GitHub repository and deploy it to Vercel step-by-step.

---

## 📁 Step 1: Initialize Git and Push to GitHub

If you haven't initialized Git locally or uploaded your code to GitHub yet, run the following setup commands inside your terminal:

1. **Download your App code** (via the AI Studio settings/export menu, or clone it if you already have it synced).
2. Open your project folder in your local terminal and initialize Git:
   ```bash
   git init
   ```
3. Add all files to staging (`.gitignore` will automatically prevent bulky `node_modules` and built files from entering):
   ```bash
   git add .
   ```
4. Commit the pristine files:
   ```bash
   git commit -m "feat: publish full-stack Aether AI with dynamic color palettes and serverless support"
   ```
5. Create a new repository on your **[GitHub Account](https://github.com/new)** (keep it public or private). Do not check any default README or gitignore templates since we already have clean ones configured.
6. Copy the git remote configuration commands from GitHub and run them:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
   git push -u origin main
   ```

---

## ⚡ Step 2: Deploy to Vercel (Zero-Config)

Vercel detects Vite configurations automatically and spins up global edge hosting alongside the Serverless API we created.

1. Go to the **[Vercel Dashboard](https://vercel.com/dashboard)** and log in with your GitHub account.
2. Click **Add New...** -> **Project**.
3. Import your newly created repository from the list of repositories shown.
4. Keep the default build settings:
   - **Framework Preset**: Vite (detected automatically).
   - **Build Command**: `vite build` (or leave default `npm run build`).
   - **Output Directory**: `dist` (detected automatically).
5. Deploy! Vercel will build your static react elements and spin up the Serverless Function at `/api/chat` instantly.

---

## 🔑 Step 3: Add Your Gemini API Key to Vercel

To get real-world answers rather than the built-in offline simulator:

1. Inside your Vercel Project Dashboard, navigate to the **Settings** tab.
2. Select **Environment Variables** in the left sidebar menu.
3. Add a new key:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: `YourActualGeminiAPIKey` (which you can generate from [Google AI Studio](https://aistudio.google.com))
4. Click **Save**.
5. Trigger a **Redeploy** on Vercel (or make a small git commit and push) to refresh the production containers with the active API key.

---

## ✨ Features Added For Production
* **Vercel Routing**: Added a `vercel.json` rewrite configuration that proxies incoming requests cleanly and serves standard Vite single page routes handles safely.
* **Serverless Functions API**: Configured `/api/chat.ts` to power serverless computing under Vercel Node runtimes while preserving the beautiful multi-modal capability.
