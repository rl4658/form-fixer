# FormFixer Backend

This repository contains the backend code for the **FormFixer** project, a user management system built with Node.js and MongoDB. The backend is designed to handle authentication, registration, profile management, and file uploads while maintaining a clean and modular code structure.

---

## 🛠️ Technologies Used

### **Languages**
- **JavaScript** (Node.js for backend)

### **Frameworks and Libraries**
- **Express.js**: Backend routing and middleware management.
- **Multer**: Handles file uploads.

### **Database**
- **MongoDB**: Stores user data securely.

### **Tools and Utilities**
- **dotenv**: Manages environment variables.
- **bcrypt**: Hashes passwords for secure storage.
- **jsonwebtoken**: Implements user authentication using JSON Web Tokens.
- **nodemailer**: Sends email notifications and verification links.

---

## 📂 Project Structure

```
├── Backend
│   ├── Database
│   │   └── Connect.js            # MongoDB connection
│   ├── Helpers
│   │   └── Time.js               # Date and time utility functions
│   ├── Middleware
│   │   ├── JwtAuth.js            # JWT-based authentication middleware
│   │   └── Logger.js             # Logs incoming requests with timestamps
│   ├── Routes
│   │   └── UserRoutes.js         # User-related routes (registration, login, profile update)
│   ├── Services
│   │   ├── EmailService.js       # Email handling service using Nodemailer
│   │   └── SecurityService.js    # Password hashing and verification service
│   └── index.js                  # Main server entry point
```

---

## ⚙️ Features

1. **Authentication**:
   - Implements JWT-based authentication to secure routes.
   - Verifies tokens before granting access to restricted resources.

2. **User Registration**:
   - Accepts user details, hashes passwords with `bcrypt`, and stores them in MongoDB.
   - Sends an email verification link during registration.

3. **Login Functionality**:
   - Authenticates users by verifying email and password.
   - Issues a JWT token for session management.

4. **Profile Picture Upload**:
   - Allows users to upload a profile picture.
   - Saves the file on the server and updates the user's profile in MongoDB.

5. **Utilities**:
   - **Custom Date Formatting**: Utility functions to handle date and time operations.
   - **Request Logging**: Logs incoming requests with timestamps for debugging and monitoring.

6. **Modular Design**:
   - Code is organized into reusable modules (e.g., database connection, middleware, services) for maintainability and scalability.

---

## 📖 Detailed File Overview

### **Database**
- **`Connect.js`**: Establishes a connection to the MongoDB database and exports the `FormFixer` database instance.

### **Helpers**
- **`Time.js`**: Provides utility methods for formatting dates, converting to 12-hour time, and comparing dates.

### **Middleware**
- **`JwtAuth.js`**: Middleware for verifying JSON Web Tokens in requests.
- **`Logger.js`**: Logs incoming requests with timestamps using the `CustomDate` utility.

### **Routes**
- **`UserRoutes.js`**:
  - **Register**: Handles user registration, hashes passwords, and sends email verification links.
  - **Login**: Authenticates users and generates JWT tokens.
  - **Profile Picture Upload**: Updates the user's profile picture and stores it in the database.

### **Services**
- **`EmailService.js`**: Sends emails using `nodemailer` (e.g., verification emails).
- **`SecurityService.js`**: Handles password hashing and verification with `bcrypt`.

### **Main Entry Point**
- **`index.js`**:
  - Sets up Express middleware, routes, and serves static files.
  - Starts the server and listens for incoming connections.

---

# FormFixer Frontend

This repository contains the **frontend** code for the **FormFixer** project, a fitness-focused AI application that helps users master exercise forms using video analysis. The application is built using **React Native** and **Expo** for a seamless mobile experience.

---

## 🛠️ Technologies Used

### **Languages**
- **TypeScript** and **JavaScript** (React Native for frontend development)

### **Frameworks and Libraries**
- **Expo**: For cross-platform app development.
- **React Native Vision Camera**: Provides video processing and camera functionality.
- **TensorFlow Lite**: Runs machine learning models on-device for real-time pose estimation.
- **Skia**: Handles drawing and rendering.
- **Expo Router**: Provides routing for navigation.
- **Haptics API**: Adds tactile feedback for user interactions.

### **Assets**
- Custom fonts (`Bakbakone.ttf`, `Inter.ttf`, and `Roboto-Regular.ttf`).
- Background images, icons, and placeholders for enhanced UI.

---

## 📂 Project Structure

```
├── Frontend
│   ├── app
│   │   ├── (tabs)
│   │   │   ├── AccountSettingPage.tsx      # User account management page
│   │   │   ├── Home.tsx                    # Main dashboard with forms and progress
│   │   │   ├── Settings.tsx                # User settings page
│   │   │   ├── Video.tsx                   # Video analysis page with TensorFlow Lite integration
│   │   │   ├── _layout.tsx                 # Tab layout for navigation
│   │   ├── +not-found.tsx                  # 404 error page
│   │   ├── _layout.tsx                     # Root layout with font loading and splash screen
│   │   ├── hooks
│   │   │   ├── GlobalStyleContext.tsx      # Customizable global styles (colors, fonts)
│   │   │   ├── UserContext.tsx             # User context for authentication and profile data
│   │   ├── index.tsx                       # Login page
│   │   ├── register.tsx                    # Registration page
│   │   └── forgotPassword.tsx              # Password reset page
│   ├── assets                              # Fonts and images
│   │   ├── fonts
│   │   │   ├── Bakbakone.ttf
│   │   │   ├── Inter.ttf
│   │   │   └── Roboto-Regular.ttf
│   │   ├── images
│   │       ├── loginbg.jpg                 # Login background
│   │       ├── signupbg.png                # Signup background
│   │       ├── homebg.png                  # Home page background
│   │       ├── graph.png                   # Graph icon for progress
│   │       ├── check.png                   # Checkmark icon for completed forms
│   │       ├── benchpress.jpg              # Example exercise image
│   │       └── splashscreen_logo.png       # Splash screen logo
│   ├── Fetchers                            # API request utilities
│   │   ├── Auth
│   │   │   ├── AuthDelete.ts
│   │   │   ├── AuthGet.ts
│   │   │   ├── AuthPost.ts
│   │   │   ├── AuthPut.ts
│   │   ├── NoAuth
│   │       ├── Get.ts
│   │       ├── Post.ts
│   │       ├── Put.ts
│   ├── .env                                # Environment variables
│   ├── build_instructions.txt              # Build setup instructions
│   ├── package.json                        # Project dependencies
│   ├── tsconfig.json                       # TypeScript configuration
│   └── metro.config.js                     # Expo Metro bundler configuration
```

---

## ⚙️ Features

### 1. **Authentication and User Management**
- **Login/Register**: Allows users to securely create accounts and log in.
- **Forgot Password**: Enables users to reset their passwords using email verification.
- **User Context**: Maintains session state and user profile data.

### 2. **Video Analysis**
- **Real-Time Pose Estimation**: Processes user movements with TensorFlow Lite for fitness feedback.
- **Confidence Threshold Control**: Adjustable settings for upper and lower body pose detection.
- **Customizable Overlay**: Displays keypoints and connections in real-time.

### 3. **User Interface**
- **Modern Design**: Clean, dark-themed UI with red and white accents.
- **Progress Dashboard**: Tracks forms mastered and remaining exercises.
- **Custom Fonts and Assets**: Enhances readability and aesthetic appeal.

### 4. **Responsive Navigation**
- **Tabs**: Includes `Home`, `Settings`, and `Video` sections.
- **404 Page**: Handles undefined routes gracefully.

### 5. **Global Styling**
- Centralized styling for consistent UI elements across the app.
- Customizable colors, font sizes, and font families via `GlobalStyleContext`.

---

## 📖 File Highlights

### **Key Pages**
- **`Home.tsx`**: Displays progress, mastered forms, and exercise options.
- **`Video.tsx`**: Processes real-time video for pose analysis.
- **`Settings.tsx`**: Allows users to manage notifications, profile pictures, and account settings.
- **`AccountSettingPage.tsx`**: Handles user-specific details and updates.

### **Global Styling**
- **`GlobalStyleContext.tsx`**: Centralized styles for colors, fonts, and sizes.
- **`UserContext.tsx`**: Manages user authentication and profile data.

### **APIs**
- `Fetchers/Auth`: Handles authenticated API requests (e.g., login, profile updates).
- `Fetchers/NoAuth`: Manages non-authenticated requests (e.g., forgot password).
