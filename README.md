# Focus Timer 🎯

A minimalist yet powerful focus timer app built with React and TypeScript. Designed to help you maintain productivity with style and simplicity. The app features a distraction-free interface that helps you stay focused on your tasks.

## ✨ Features

- 🕒 Pomodoro Timer:
  - Focus sessions (25 minutes)
  - Automatic timer start on mode selection
  - Visual progress indicator
  - Browser tab title updates with current timer
- ☕ Break Timer Options:
  - Quick break (5 minutes)
  - Long break (15 minutes)
  - Seamless switching between focus and break modes
- 🎯 Focus Modes:
  - Standard Pomodoro mode
  - Disconnection mode (resets on movement)
- 🖼️ Dynamic Interface:
  - Beautiful background images that change automatically
  - Smooth transitions between modes
  - Clean and modern glass-morphism design
- 📱 Responsive Features:
  - Works on all devices
  - Adapts to screen size
  - Touch-friendly controls
- 🔔 Smart Notifications:
  - Mode change notifications
  - Break start/end alerts
  - Session completion messages
- 💡 User Experience:
  - One-click mode switching
  - Persistent task saving
  - Distraction-free interface
  - No pause option to maintain focus

## 🛠️ Technologies

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: 
  - shadcn/ui (Radix UI)
  - Lucide React Icons
- **Styling**: 
  - Tailwind CSS
  - CSS Animations
  - Glass-morphism effects
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

## 🖼️ Photos Management

When you add new JPEG photos to `public/photos`, optimize and register them with:

```sh
# 1. Convert and optimize new JPEGs to WebP
npm run photos:optimize

# 2. Regenerate the photo index for the carousel
npm run photos:generate
```

## 🤝 Contributing

Contributions are welcome! Feel free to open issues and submit pull requests.

## 📝 License

This project is open source and available under the MIT License.
