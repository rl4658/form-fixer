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

## 🚀 Setup Instructions

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/FormFixer.git
   cd FormFixer/Backend
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the `Backend` directory with the following keys:
     ```plaintext
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     MY_EMAIL=your_email
     MY_EMAIL_PASS=your_email_password
     SERVER_HOST=your_server_host
     ```

4. **Run the Server**:
   ```bash
   node index.js
   ```
   The server will start at `http://192.168.2.19:3000`.

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
