<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Z58ccBFhh5DSBVcqrviRu-glmIE1vkr4

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
## Deploy to Vercel

1. Create a new project in Vercel
2. Connect your Git repository
3. Set the `GEMINI_API_KEY` environment variable in your Vercel project settings
4. Deploy!

Note: Make sure to set the `GEMINI_API_KEY` environment variable in your Vercel dashboard for the application to work correctly.
