<div align="center">
  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Paw%20Prints.png" alt="PetVerse Logo" width="120" />

  # PetVerse 🐾
  
  **A Premium, AI-Powered Virtual Pet Universe**

  [Live Demo](https://your-demo-link.com) • [Report Bug](https://github.com/your-username/petverse/issues) • [Request Feature](https://github.com/your-username/petverse/issues)

  <br />

  ![Next JS](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js&logoColor=white)
  ![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_v4-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Firebase](https://img.shields.io/badge/Firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
  ![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=blue)
  ![Gemini AI](https://img.shields.io/badge/Gemini_1.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)
  ![Zustand](https://img.shields.io/badge/Zustand-4A3735?style=for-the-badge)
  
</div>

<br />

## 🌟 Overview

**PetVerse** is a production-grade, highly polished virtual pet simulator that blends gamification, artificial intelligence, and beautiful UI/UX design into a cohesive digital universe. Adopt a companion—from a cozy Panda to a cyberpunk Dragon—and manage their health, happiness, and energy.

Powered by **Google's Gemini 1.5 Flash AI**, your pet possesses a unique, dynamic personality that reacts emotionally to your actions. The entire application interface dynamically shifts its theme, color palette, and particle effects based on your chosen species, delivering a breathtaking and personalized experience.

## ✨ Core Features

- **🎨 Dynamic Species Theme Engine:** The entire UI (colors, fonts, micro-animations, floating canvas particles) transforms completely based on your pet's species (e.g., Neon Purple for Cats, Bamboo Green for Pandas).
- **🤖 AI Companion Chat:** Have real, context-aware conversations with your pet! The Gemini AI system prompt is dynamically injected with your pet's current mood, hunger levels, and innate personality.
- **🎮 Gamified Progression System:** Earn XP, collect coins, and level up your pet. Features a daily streak system, unlockable rarity-tiered achievements, and an evolutionary growth cycle.
- **📊 Advanced Wellbeing Analytics:** Beautiful, glassmorphic charts built with Recharts track your pet's 7-day wellbeing, mood history, and your interaction frequency.
- **⚡ Real-Time Sync & Offline Persistence:** Built with Firebase Firestore and Zustand to ensure lightning-fast UI updates, offline capability, and cross-device synchronization.
- **📱 PWA Ready:** Fully installable as a Progressive Web App (PWA) for a native-like app experience on both iOS and Android.

## 🛠️ Comprehensive Tech Stack

PetVerse was built using cutting-edge, modern web technologies:

### **Core Framework & Language**
- **[Next.js 15](https://nextjs.org/)** - React framework using the App Router and Server Components.
- **[React 19](https://react.dev/)** - For building the interactive user interface.
- **[TypeScript](https://www.typescriptlang.org/)** - For strict type-safety and robust code architecture.

### **Styling & UI/UX**
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework for rapid, responsive design.
- **Custom CSS Variables** - For the dynamic multi-theme engine and advanced glassmorphism effects.
- **[Lucide React](https://lucide.dev/)** - Beautiful, consistent SVG icons.
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible UI primitives (used for Toasts, Progress bars, etc.).

### **Animations & Visuals**
- **[Framer Motion](https://www.framer.com/motion/)** - For complex page transitions, micro-interactions, and layout animations.
- **[GSAP](https://gsap.com/)** - For high-performance JavaScript animations.
- **HTML5 Canvas** - Custom `ParticleCanvas` component rendering species-specific floating emojis and particles.

### **State Management & Data Architecture**
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight, fast global state management with `persist` middleware for local storage caching.
- **[Firebase](https://firebase.google.com/)** - 
  - **Firestore:** NoSQL database with real-time `onSnapshot` listeners.
  - **Authentication:** Secure Google OAuth and Email/Password sign-in.

### **Artificial Intelligence & Data Visualization**
- **[Google Generative AI SDK](https://ai.google.dev/)** - Integration with the `gemini-1.5-flash` model for intelligent pet conversations.
- **[Recharts](https://recharts.org/)** - Composable charting library used for the analytics dashboard with custom glassmorphic tooltips.

### **Tooling & Optimization**
- **[Next-PWA](https://github.com/shadowwalker/next-pwa)** - Zero-config PWA plugin for Next.js.
- **ESLint & Prettier** - Code linting and formatting.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- Node.js (v18.17.0 or higher)
- npm, yarn, or pnpm
- A [Firebase Project](https://console.firebase.google.com/)
- A [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/petverse.git
   cd petverse
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Copy the `.env.local.example` file to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   - Open `.env.local` and add your Firebase configuration and Gemini API Key:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Set up Firebase**
   - Go to your Firebase Console.
   - Enable **Authentication** (Google & Email/Password providers).
   - Enable **Firestore Database**. Start in test mode for local development, or configure security rules for production.

5. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to enter the universe!

## 📂 Project Architecture

```text
src/
├── app/                  # Next.js 15 App Router pages & API Routes
│   ├── (auth)/           # Protected authentication flows (Login/Signup)
│   ├── (dashboard)/      # Main application shell (Feed, Play, Chat, Analytics)
│   ├── api/chat/         # Gemini AI Route Handler
│   └── globals.css       # Global styles and dynamic Theme Engine CSS tokens
├── components/           # Reusable UI components
│   ├── dashboard/        # Sidebar, Topbar, Activity Widgets
│   ├── pet/              # Pet Avatar, Stat Meters, Progress Bars
│   ├── theme/            # Canvas Particle Generators
│   └── ui/               # Radix primitives & Framer Motion Toasts
├── lib/                  # Utilities and configurations
│   ├── firebase/         # Firebase initialization, Auth, and Firestore helpers
│   └── theme-engine/     # Species definition and color palette mapping
├── stores/               # Zustand global state
│   ├── useAuthStore.ts   # User session management
│   ├── useGameStore.ts   # XP, Coins, Achievements (Local Persisted)
│   └── usePetStore.ts    # Pet vitals with real-time Firestore sync
└── types/                # Strict TypeScript interfaces
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 💌 Acknowledgments

- Design inspiration drawn from modern glassmorphism and hyper-casual gaming UI.
- Emojis provided by [Animated Fluent Emojis](https://github.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis).
