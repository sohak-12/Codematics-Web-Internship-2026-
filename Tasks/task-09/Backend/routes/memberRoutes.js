import express from 'express';
import { getMembers, addMember, updateMember, deleteMember } from '../controllers/memberController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getMembers);
router.post('/', protect, addMember);
router.put('/:id', protect, updateMember);
router.delete('/:id', protect, deleteMember);

export default router;