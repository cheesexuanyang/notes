const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const noteController = require('../controllers/noteController');
const authMiddleware = require('../../authentication/middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Validation rules
const noteValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required')
];

// Routes
router.get('/', noteController.getNotes);
router.get('/:id', noteController.getNote);
router.post('/', noteValidation, noteController.createNote);
router.put('/:id', noteValidation, noteController.updateNote);
router.delete('/:id', noteController.deleteNote);

module.exports = router;