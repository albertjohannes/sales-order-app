# Warung Order App

This app is a mock ordering system for warungs (small shops) in Indonesia. It is designed for demo and offline development purposes only. All data is mocked and there are no real API calls or sensitive credentials in this repository.

## Features
- Browse and filter products by brand
- Add items to cart
- View order history and order details
- Simulate placing orders and confirming receipts
- Multi-language support (Bahasa Indonesia & English)

## Project Structure

```
warung-order-app/
  ├── app/                # App screens and navigation
  ├── assets/             # Images and fonts
  ├── components/         # Reusable UI components
  ├── constants/          # App-wide constants
  ├── contexts/           # React contexts (cart, language)
  ├── data/               # Mock data (products, transactions, translations)
  ├── hooks/              # Custom React hooks
  ├── services/           # Local storage service
  ├── scripts/            # Utility scripts
  ├── package.json        # Project dependencies
  └── README.md           # This file
```

## Usage

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the app: `npm start`

## Screenshots

Below are some example screens from the app (images are mock/demo only):

- **Home**: Product catalog with banner carousel
  ![Home Screen](docs/images/home-screen.png)

- **Cart**: Shopping cart with quantity management
  ![Cart Screen](docs/images/cart-screen.png)

- **History**: Transaction history and receipts
  ![History Screen](docs/images/history-screen.png)

## Notes
- **No real API integration**: All data is local and mocked for demo purposes.
- **No sensitive credentials**: This repository does not contain any real API keys, tokens, or company secrets.
- **Safe for public sharing**: All company-specific and sensitive information has been removed.

## License
MIT
