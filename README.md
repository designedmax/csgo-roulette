# CS:GO Roulette Telegram Mini App

A Telegram Mini App that allows users to participate in a CS:GO skin roulette with a 40% chance to win.

## Features

- Telegram Web App integration
- 40% chance to win CS:GO skins
- Firebase backend for data storage
- Market.csgo.com API integration for skin management
- Modern UI with Tailwind CSS

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following variable:
   ```
   MARKET_CSGO_API_KEY=your_market_csgo_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your GitHub repository
5. Add the following environment variable:
   - `MARKET_CSGO_API_KEY`: Your market.csgo.com API key
6. Click "Deploy"

### Firebase Setup

The Firebase configuration is already set up with the following project:
- Project ID: cs-roll
- Database URL: https://cs-roll-default-rtdb.europe-west1.firebasedatabase.app

To deploy Firebase security rules:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Deploy Firestore rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

4. Deploy Realtime Database rules:
   ```bash
   firebase deploy --only database
   ```

## Telegram Bot Setup

1. Create a new bot using [@BotFather](https://t.me/BotFather)
2. Enable the Web App feature for your bot
3. Set the Web App URL to your deployed Vercel URL (e.g., `https://your-app.vercel.app`)

## Market.csgo.com API

1. Register for an API key at market.csgo.com
2. Add the API key to your `.env.local` file for local development
3. Add the API key to Vercel environment variables for production

## Security

- Firestore rules allow public read access to game results
- Only authenticated users can create new game entries
- Realtime Database rules validate data structure
- API keys are stored securely in environment variables

## License

MIT 