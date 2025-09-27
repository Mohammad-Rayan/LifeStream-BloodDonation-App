# LifeStream Blood Donation App

A comprehensive blood donation platform connecting donors with recipients in need. This repository contains both the frontend mobile application and backend API server.

## 🩸 About LifeStream

LifeStream is a full-stack application designed to streamline blood donation processes by:
- Connecting blood donors with recipients
- Managing donation requests and history
- Providing real-time notifications
- Facilitating donor search by blood type and location

## 📁 Project Structure

This monorepo contains two main components:

### **[LifeStream-Backend](./LifeStream-Backend/)**
Node.js/Express API server with MongoDB integration
- User authentication and authorization
- Blood request management
- RESTful API endpoints
- Request logging and middleware

### **[LifeStream-Frontend](./LifeStream-Frontend/)**
React Native/Expo cross-platform mobile application
- User-friendly mobile interface
- Profile and donation management
- Real-time notifications
- Custom navigation system

## 🚀 Quick Start

Each project has its own detailed setup instructions:

1. **Backend Setup**: See [LifeStream-Backend/README.md](./LifeStream-Backend/README.md)
2. **Frontend Setup**: See [LifeStream-Frontend/README.md](./LifeStream-Frontend/README.md)

## 🛠️ Technology Stack

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful API design

**Frontend:**
- React Native with Expo
- TypeScript
- Context API for state management
- Custom navigation components

## 📝 Environment Setup

Both projects include `.env.example` files with required environment variables. Copy these files to `.env` and configure with your own values before running the applications.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Made with ❤️ for the blood donation community**