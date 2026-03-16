Certainly! Below is a production-ready `src/index.js` for a MERN stack calculator backend. This code includes proper initialization, error handling, and startup logic.

// src/index.js

// Import necessary modules
import express from 'express';
import mongoose from'mongoose';
import dotenv from 'dotenv';
import calculatorRoutes from './routes/calculatorRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Load environment variables from.env file
dotenv.config();

// Create Express application
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Initialize database connection
connectDB();

// Define routes
app.use('/api/calculator', calculatorRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Define port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the app for testing purposes
export default app;


### Additional Files

#### routes/calculatorRoutes.js
// routes/calculatorRoutes.js

import { Router } from 'express';
import { add, subtract, multiply, divide } from '../controllers/calculatorController.js';

const router = Router();

router.post('/add', add);
router.post('/subtract', subtract);
router.post('/multiply', multiply);
router.post('/divide', divide);

export default router;


#### controllers/calculatorController.js
// controllers/calculatorController.js

export const add = (req, res) => {
  const { num1, num2 } = req.body;
  if (typeof num1!== 'number' || typeof num2!== 'number') {
    res.status(400).json({ message: 'Both inputs must be numbers' });
    return;
  }
  res.json({ result: num1 + num2 });
};

export const subtract = (req, res) => {
  const { num1, num2 } = req.body;
  if (typeof num1!== 'number' || typeof num2!== 'number') {
    res.status(400).json({ message: 'Both inputs must be numbers' });
    return;
  }
  res.json({ result: num1 - num2 });
};

export const multiply = (req, res) => {
  const { num1, num2 } = req.body;
  if (typeof num1!== 'number' || typeof num2!== 'number') {
    res.status(400).json({ message: 'Both inputs must be numbers' });
    return;
  }
  res.json({ result: num1 * num2 });
};

export const divide = (req, res) => {
  const { num1, num2 } = req.body;
  if (typeof num1!== 'number' || typeof num2!== 'number') {
    res.status(400).json({ message: 'Both inputs must be numbers' });
    return;
  }
  if (num2 === 0) {
    res.status(400).json({ message: 'Cannot divide by zero' });
    return;
  }
  res.json({ result: num1 / num2 });
};


#### middleware/errorMiddleware.js
// middleware/errorMiddleware.js

export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (err, req, res, next) => {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production'? null : err.stack,
  });
};


### Notes:
1. **Environment Variables**: Ensure you have a `.env` file with the necessary environment variables, such as `MONGO_URI` and `PORT`.
2. **Error Handling**: The `notFound` and `errorHandler` middleware functions provide centralized error handling.
3. **Routes and Controllers**: The calculator routes and controllers are separated for better organization.
4. **Type Checking**: Basic type checking is included in the controller functions to ensure the inputs are numbers.

This setup should give you a robust starting point for your MERN stack calculator backend.