# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```
Silverscisor
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ logo.png
├─ README.md
├─ src
│  ├─ .env
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets
│  │  ├─ background-clip.svg
│  │  ├─ images
│  │  │  └─ herosvg.png
│  │  └─ react.svg
│  ├─ components
│  │  ├─ auth
│  │  │  ├─ ForgotPassword.jsx
│  │  │  ├─ hooks
│  │  │  ├─ Login.jsx
│  │  │  ├─ ResetPassword.jsx
│  │  │  ├─ services
│  │  │  │  ├─ login.js
│  │  │  │  └─ signup.js
│  │  │  └─ Signup.jsx
│  │  ├─ AuthPage.jsx
│  │  ├─ common
│  │  │  ├─ LoadingSpinner.jsx
│  │  │  ├─ Modal.jsx
│  │  │  └─ ProtectedRoute.jsx
│  │  ├─ customer
│  │  │  ├─ BookingForm.jsx
│  │  │  ├─ ConfirmationModal.jsx
│  │  │  ├─ CustomerBookingHistory.jsx
│  │  │  ├─ CustomerBottomNav.jsx
│  │  │  ├─ CustomerHeader.jsx
│  │  │  ├─ CustomerHeroSection.jsx
│  │  │  ├─ CustomerHomePage.jsx
│  │  │  ├─ CustomerProfileModal.jsx
│  │  │  ├─ hooks
│  │  │  ├─ services
│  │  │  └─ ServiceSelection.jsx
│  │  ├─ salon
│  │  │  ├─ hooks
│  │  │  ├─ SalonBookingsList.jsx
│  │  │  ├─ SalonBottomNav.jsx
│  │  │  ├─ SalonDashboardPage.jsx
│  │  │  ├─ SalonHeader.jsx
│  │  │  ├─ salonQueue
│  │  │  │  ├─ LiveQueueStatus.jsx
│  │  │  │  └─ QueueManager.jsx
│  │  │  ├─ SalonSidebar.jsx
│  │  │  ├─ SalonStats.jsx
│  │  │  └─ services
│  │  └─ services
│  │     └─ app.js
│  ├─ context
│  │  ├─ AuthContext.jsx
│  │  ├─ BookingContext.jsx
│  │  ├─ NotificationContext.jsx
│  │  ├─ QueueContext.jsx
│  │  └─ ThemeContext.jsx
│  ├─ hooks
│  │  ├─ useApi.js
│  │  ├─ useDebounce.js
│  │  └─ useLocalStorage.js
│  ├─ index.css
│  ├─ main.jsx
│  ├─ store
│  │  ├─ authSlice.js
│  │  └─ index.js
│  └─ util
│     ├─ AnimatedClipSVG.jsx
│     ├─ AnimatedScissors.jsx
│     ├─ AnimatedScissorsIcon.jsx
│     ├─ Ballpit.jsx
│     ├─ CustomerModalBackgroundSVG.jsx
│     ├─ DecorativeBackground.jsx
│     ├─ DecorativeSVG.jsx
│     ├─ DecorativeSVGLoginDark.jsx
│     ├─ DecorativeSVGSignup.jsx
│     ├─ DecorativeSVGSignupDark.jsx
│     ├─ LoginBackgroundPattern.jsx
│     └─ SalonMorphIcon.jsx
├─ vercel.json
└─ vite.config.js

```