import express from 'express';
import { getIssues, issueBook, returnBook, deleteIssue } from '../controllers/IssueController.js';

const router = express.Router();

router.get('/', getIssues);
router.post('/', issueBook);
router.put('/:id', returnBook);
router.delete('/:id', deleteIssue); 

export default router;