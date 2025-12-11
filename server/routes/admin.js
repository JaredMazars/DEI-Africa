import express from 'express';
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';
import Connection from '../models/Connection.js';
import Session from '../models/Session.js';
import Message from '../models/Message.js';
import Review from '../models/Review.js';
import Opportunity from '../models/Opportunity.js';
import Expert from '../models/Expert.js';
import auth from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
    // In production, you would check user role from database
    // For now, we'll allow all authenticated users to access admin routes
    // if (req.user.role !== 'admin') {
    //     return res.status(403).json({ 
    //         success: false, 
    //         message: 'Admin access required' 
    //     });
    // }
    next();
};

// Get dashboard statistics
router.get('/stats', auth, requireAdmin, async (req, res) => {
    try {
        const [userStats, connectionStats, sessionStats] = await Promise.all([
            User.getUserStats(),
            Connection.getConnectionStats(),
            Session.getSessionStats()
        ]);

        const stats = {
            totalUsers: userStats.total_users,
            totalMentors: userStats.total_mentors,
            totalMentees: userStats.total_mentees,
            newUsersThisMonth: userStats.new_users_this_month,
            totalConnections: connectionStats.total_connections,
            activeConnections: connectionStats.active_connections,
            pendingConnections: connectionStats.pending_connections,
            newConnectionsThisMonth: connectionStats.new_connections_this_month,
            totalSessions: sessionStats.total_sessions,
            completedSessions: sessionStats.completed_sessions,
            upcomingSessions: sessionStats.upcoming_sessions,
            avgSessionDuration: sessionStats.avg_duration
        };

        res.json({
            success: true,
            data: { stats }
        });

    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics'
        });
    }
});

// Get all users with profiles
router.get('/users', auth, requireAdmin, async (req, res) => {
    try {
        const users = await User.getAll();

        res.json({
            success: true,
            data: { users }
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users'
        });
    }
});

// Get all connections for admin
router.get('/connections', auth, requireAdmin, async (req, res) => {
    try {
        const connections = await Connection.getConnectionStats();

        res.json({
            success: true,
            data: { connections }
        });

    } catch (error) {
        console.error('Error fetching connections:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch connections'
        });
    }
});

// Get mentors by expertise
router.get('/mentors', auth, async (req, res) => {
    try {
        const { expertise } = req.query;
        
        let mentors;
        if (expertise) {
            mentors = await UserProfile.getMentorsByExpertise(expertise);
        } else {
            mentors = await UserProfile.getAllMentors();
        }

        res.json({
            success: true,
            data: { mentors }
        });

    } catch (error) {
        console.error('Error fetching mentors:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch mentors'
        });
    }
});

// Get mentees by interests
router.get('/mentees', auth, async (req, res) => {
    try {
        const { interest } = req.query;
        
        let mentees;
        if (interest) {
            mentees = await UserProfile.getMenteesByInterests(interest);
        } else {
            mentees = await UserProfile.getAllMentees();
        }

        res.json({
            success: true,
            data: { mentees }
        });

    } catch (error) {
        console.error('Error fetching mentees:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch mentees'
        });
    }
});

// Update user status
router.put('/users/:userId/status', auth, requireAdmin, [
    body('is_active').isBoolean().withMessage('Status must be true or false')
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

        const { userId } = req.params;
        const { is_active } = req.body;

        await User.updateStatus(userId, is_active);

        res.json({
            success: true,
            message: 'User status updated successfully'
        });

    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user status'
        });
    }
});

export default router;