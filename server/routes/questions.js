import express from 'express';
import User from '../models/User.js';
import Question from '../models/Question.js';
import auth from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get all questions
router.get('/', auth, async (req, res) => {
    try {
        const questions = await Question.getAll();
        
        res.json({
            success: true,
            data: { questions }
        });

    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch questions'
        });
    }
});

// Create new question
router.post('/', auth, [
    body('title').notEmpty().withMessage('Question title is required'),
    body('content').notEmpty().withMessage('Question content is required'),
    body('tags').optional().isString()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const questionData = {
            user_id: req.user.user_id,
            ...req.body
        };

        const question = await Question.create(questionData);

        res.status(201).json({
            success: true,
            message: 'Question posted successfully',
            data: { question }
        });

    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to post question'
        });
    }
});

// Get question by ID
router.get('/:questionId', auth, async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await Question.findById(questionId);
        
        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        res.json({
            success: true,
            data: { question }
        });

    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch question'
        });
    }
});

// Mark question as answered
router.put('/:questionId/answered', auth, async (req, res) => {
    try {
        const { questionId } = req.params;

        await Question.markAsAnswered(questionId);

        res.json({
            success: true,
            message: 'Question marked as answered'
        });

    } catch (error) {
        console.error('Error marking question as answered:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark question as answered'
        });
    }
});

export default router;