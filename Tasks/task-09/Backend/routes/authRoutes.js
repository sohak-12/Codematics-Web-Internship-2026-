import express from 'express';
import { loginController } from '../controllers/authController.js'; 

const router = express.Router();

// Now this will work because the controller is defined
router.post('/login', loginController);

export default router;