import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';
import UserExpertise from '../models/UserExpertise.js';
import UserInterests from '../models/UserInterests.js';
import UserGoals from '../models/UserGoals.js';
import UserLanguages from '../models/UserLanguages.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Demo login (bypasses database) - for testing purposes
router.post('/demo-login', async (req, res) => {
    try {
        const { email } = req.body;
        
        // Generate a demo token
        const token = jwt.sign(
            { userId: 'demo-user-123', email: email || 'demo@example.com' },
            process.env.JWT_SECRET || 'demo-secret-key-change-in-production',
            { expiresIn: '7d' }
        );

        // Return demo user with completed profile
        res.json({
            success: true,
            message: 'Demo login successful',
            data: {
                user: {
                    id: 'demo-user-123',
                    email: email || 'demo@example.com',
                    isFirstLogin: false,
                    profile: {
                        role: 'mentee',
                        name: 'Demo User',
                        location: 'Nairobi, Kenya',
                        expertise: ['Technology', 'Software Development'],
                        interests: ['AI', 'Web Development'],
                        experience: '2 years',
                        goals: ['Learn new skills', 'Network with mentors'],
                        availability: 'Weekends',
                        languages: ['English', 'Swahili']
                    }
                },
                token
            }
        });
    } catch (error) {
        console.error('Demo login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during demo login'
        });
    }
});

// Register new user
router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
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

        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create new user
        const user = await User.create({ email, password });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user.user_id,
                    email: user.email,
                    isFirstLogin: true
                },
                token
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
});

// Login user
router.post('/login', [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
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

        const { email, password } = req.body;

        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Validate password
        const isValidPassword = await user.validatePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user has completed profile
        const profile = await UserProfile.findByUserId(user.user_id);
        const isFirstLogin = !profile;

        // Update last login
        await User.updateLastLogin(user.user_id);

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.user_id,
                    email: user.email,
                    isFirstLogin,
                    profile: profile || null
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await UserProfile.findByUserId(req.user.user_id);
        
        res.json({
            success: true,
            data: {
                user: {
                    id: req.user.user_id,
                    email: req.user.email,
                    isFirstLogin: !profile,
                    profile: profile || null
                }
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error getting profile'
        });
    }
});

// Complete onboarding profile
router.post('/complete-profile', auth, [
    body('role').isIn(['mentor', 'mentee']).withMessage('Role must be mentor or mentee'),
    body('name').notEmpty().withMessage('Name is required'),
    body('location').notEmpty().withMessage('Location is required'),
    body('experience').notEmpty().withMessage('Experience is required'),
    body('availability').notEmpty().withMessage('Availability is required'),
    body('expertise').isArray().withMessage('Expertise must be an array'),
    body('interests').isArray().withMessage('Interests must be an array'),
    body('goals').isArray().withMessage('Goals must be an array'),
    body('languages').isArray().withMessage('Languages must be an array')
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

        const { expertise, interests, goals, languages, ...profileData } = req.body;
        profileData.user_id = req.user.user_id;

        // Create profile
        const profile = await UserProfile.create(profileData);

        // Create expertise entries
        if (expertise && expertise.length > 0) {
            await UserExpertise.create(req.user.user_id, expertise);
        }

        // Create interests entries
        if (interests && interests.length > 0) {
            await UserInterests.create(req.user.user_id, interests);
        }

        // Create goals entries
        if (goals && goals.length > 0) {
            await UserGoals.create(req.user.user_id, goals);
        }

        // Create languages entries
        if (languages && languages.length > 0) {
            await UserLanguages.create(req.user.user_id, languages);
        }

        res.json({
            success: true,
            message: 'Profile completed successfully',
            data: { profile }
        });

    } catch (error) {
        console.error('Complete profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error completing profile'
        });
    }
});

export default router;