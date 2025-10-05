# LifeStream Frontend

A React Native (Expo) application for managing blood donation requests, donor search, and user profiles. This is the frontend for the LifeStream app that helps connect blood donors with those in need.

## 🩸 Features

- **User Authentication**: Register, login, and logout functionality
- **Profile Management**: Edit and view user profiles with medical information
- **Blood Donation Requests**: Create, view, and fulfill blood donation requests
- **Donation History**: Track your donation and request history
- **Search Donors**: Find donors based on blood type and location
- **Notifications**: Receive updates about requests and donations
- **Custom Drawer Navigation**: Smooth navigation with a custom drawer interface

## 📁 Project Structure

```
app/                    # Main app screens using Expo Router
├── _layout.tsx        # Root layout and navigation setup
├── index.tsx          # Home/landing page
├── auth.tsx           # Authentication flow
├── login.tsx          # Login screen
├── register.tsx       # Registration screen
├── profile.tsx        # User profile view
├── editProfile.tsx    # Profile editing
├── createRequest.tsx  # Create donation request
├── viewRequests.tsx   # Browse donation requests
├── fulfillRequest.tsx # Fulfill a donation request
├── searchDonors.tsx   # Find donors
├── donationHistory.tsx# Donation history
├── requestHistory.tsx # Request history
├── notifications.tsx  # Notifications center
└── about.tsx          # About page

assets/                # App icons, splash screens, and images
├── images/
│   ├── icon.png
│   ├── splash-icon.png
│   ├── favicon.png
│   └── android-icons...

components/            # Reusable UI components
├── CustomDrawer.tsx   # Custom drawer navigation component

context/               # React Context providers
├── DrawerContext.tsx  # Drawer state management
├── UserContext.tsx    # User authentication state

hooks/                 # Custom React hooks
├── useDrawer.ts       # Drawer functionality hook

utils/                 # Utility functions and configurations
├── api.ts            # API configuration and endpoints
├── onboarding.ts     # Onboarding flow utilities
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (Mac) or Android Studio/Emulator
- [Expo Go app](https://expo.dev/client) on your physical device (optional)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd LifeStream-Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # Create environment file
   cp .env.example .env
   
   # Edit .env with your backend configuration
   EXPO_PUBLIC_API_BASE_URL=http://your-backend-url:port
   ```

4. **Start the development server:**
   ```bash
   npx expo start
   ```

5. **Run the app:**
   - **Physical Device**: Scan QR code with Expo Go app
   - **iOS Simulator**: Press `i` in terminal
   - **Android Emulator**: Press `a` in terminal
   - **Web Browser**: Press `w` in terminal

## 📱 Available Scripts

- `npm start` — Start Expo development server
- `npm run android` — Run on Android device/emulator
- `npm run ios` — Run on iOS device/simulator (macOS only)
- `npm run web` — Run in web browser
- `npm run lint` — Run ESLint for code quality
- `npm run reset-project` — Reset project to clean state

## 🔧 Tech Stack

- **Framework**: React Native with Expo SDK ~54.0
- **Navigation**: Expo Router v6 (file-based routing)
- **UI Libraries**: Expo Vector Icons, React Native Reanimated
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Storage**: AsyncStorage
- **Development**: TypeScript, ESLint

## 🏗️ Architecture

This app uses Expo Router for file-based routing, making navigation intuitive and scalable. The project follows these patterns:

- **Context-based state management** for user authentication and drawer state
- **Custom hooks** for reusable logic
- **Utility-first approach** for API calls and common functions
- **Component composition** for reusable UI elements

## 🎨 Customization

- **App Branding**: Update icons in `assets/images/` and modify `app.json`
- **Navigation**: Customize drawer in `components/CustomDrawer.tsx`
- **Theming**: Modify colors and styles in component files
- **API Endpoints**: Update base URL and endpoints in `utils/api.ts`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## � Contributors

- **[Mohammad Rayan](https://github.com/Mohammad-Rayan)** - Full-stack Development, Project Lead
- **[Abdul Wahab Subhani](https://github.com/Abdul-Wahab-Subhani)** - Frontend Development

## �📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Links

- [LifeStream Backend Repository](link-to-backend-repo)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

## Authors
-- **[Abdul Wahab Subhani](https://github.com/Abdul-Wahab-Subhani)**
