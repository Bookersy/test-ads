# AdFlow - Simple Ad Network

A website where you can:
- **Create ads** with name, image, and link
- **Get a code snippet** to add ads to any website
- **Track clicks** on your ads in real time

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up the database:
   ```bash
   npm run db:generate
   npm run db:push
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## How it works

### Create an ad
1. Sign up or log in
2. Go to **Dashboard** → **New ad**
3. Enter ad name, image URL, and link URL

### Add ads to your website
1. Copy the snippet from your dashboard
2. Paste it before `</body>` on any page:
   ```html
   <script src="https://your-domain.com/snippet/script.js"></script>
   ```
3. Optional: Add `<div data-adflow></div>` where you want the ad to appear

### Track clicks
- Every click on your ad is counted
- View click stats in your dashboard next to each ad

## Preview
Visit `/preview` to see the snippet in action on a sample page.
