import express from 'express';
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';
import Connection from '../models/Connection.js';
import Session from '../models/Session.js';
import Message from '../models/Message.js';
import Review from '../models/Review.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get user dashboard data
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [
            userProfile,
            connections,
            upcomingSessions,
            recentMessages,
            userRating,
            connectionStats
        ] = await Promise.all([
            UserProfile.findByUserId(userId),
            Connection.getConnectionsWithDetails(userId),
            Session.getUpcomingSessions(userId),
            Message.getRecentMessages(userId, 5),
            Review.getUserAverageRating(userId),
            Connection.getConnectionStats()
        ]);

        // Calculate user-specific stats
        const userStats = {
            totalConnections: connections.length,
            activeConnections: connections.filter(c => c.status === 'accepted').length,
            totalSessions: connections.reduce((sum, c) => sum + (c.total_sessions || 0), 0),
            upcomingSessions: upcomingSessions.length,
            averageRating: userRating.average_rating || 0,
            reviewCount: userRating.review_count || 0,
            responseRate: 95 // This would be calculated based on actual response data
        };

        // Format recent activity
        const recentActivity = recentMessages.map(message => ({
            id: message.message_id,
            type: 'message',
            title: `New message from ${message.sender_name}`,
            description: message.message_text.substring(0, 100) + '...',
            time: message.created_at,
            user: message.sender_name,
            avatar: message.sender_avatar
        }));

        res.json({
            success: true,
            data: {
                profile: userProfile,
                connections,
                upcomingSessions,
                recentActivity,
                stats: userStats,
                platformStats: connectionStats
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data'
        });
    }
});

// Get user activity feed
router.get('/activity', auth, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { limit = 10 } = req.query;

        const [recentMessages, recentReviews] = await Promise.all([
            Message.getRecentMessages(userId, parseInt(limit) / 2),
            Review.getRecentReviews(userId, parseInt(limit) / 2)
        ]);

        // Combine and format activities
        const activities = [
            ...recentMessages.map(message => ({
                id: message.message_id,
                type: 'message',
                title: `New message from ${message.sender_name}`,
                description: message.message_text.substring(0, 100) + '...',
                time: message.created_at,
                user: message.sender_name,
                avatar: message.sender_avatar
            })),
            ...recentReviews.map(review => ({
                id: review.review_id,
                type: 'review',
                title: `New review from ${review.reviewer_name}`,
                description: `${review.rating} stars: ${review.review_text?.substring(0, 100) || 'No comment'}`,
                time: review.created_at,
                user: review.reviewer_name,
                avatar: review.reviewer_avatar
            }))
        ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, parseInt(limit));

        res.json({
            success: true,
            data: { activities }
        });

    } catch (error) {
        console.error('Error fetching activity feed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activity feed'
        });
    }
});

export default router;