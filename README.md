# Focus Timer 🎯

A minimalist yet powerful focus timer app built with React and TypeScript. Designed to help you maintain productivity with style and simplicity.

## ✨ Features

- 🕒 Customizable Pomodoro timer (25 minutes default)
- ☕ Break timer options:
  - Short break (5 minutes)
  - Long break (15 minutes)
- 🎵 Ambient nature sounds for enhanced focus
- 🖼️ Beautiful background images that change automatically
- 🌗 Clean and modern UI with visual feedback
- 📱 Fully responsive design for all devices
- 🔔 Toast notifications for timer events
- ⌨️ Keyboard shortcuts for quick control

## 🛠️ Technologies

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: 
  - shadcn/ui (Radix UI)
  - Lucide React Icons
- **Styling**: 
  - Tailwind CSS
  - CSS Animations
- **State Management**: React Hooks
- **Development**:
  - TypeScript
  - ESLint
  - PostCSS

## 🚀 Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm (comes with Node.js)

### Installation

```sh
# Clone the repository
git clone https://github.com/yourusername/focus.git
cd focus

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080/focus/`

## 📦 Deployment

### GitHub Pages Deployment

The project is configured for automatic deployment to GitHub Pages:

1. Ensure your repository is public
2. Configure GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
3. The deployment will be triggered automatically on push to main
4. Access your app at: `https://<your-username>.github.io/focus/`

### Manual Deployment

```sh
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

## 📝 License

This project is open source and available under the MIT License.
