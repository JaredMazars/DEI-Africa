import express from 'express';
import User from '../models/User.js';
import UserProfile from '../models/UserProfile.js';
import UserExpertise from '../models/UserExpertise.js';
import UserInterests from '../models/UserInterests.js';
import UserGoals from '../models/UserGoals.js';
import UserLanguages from '../models/UserLanguages.js';
import auth from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Get user preferences
router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.user_id;

        const [profile, expertise, interests, goals, languages] = await Promise.all([
            UserProfile.findByUserId(userId),
            UserExpertise.findByUserId(userId),
            UserInterests.findByUserId(userId),
            UserGoals.findByUserId(userId),
            UserLanguages.findByUserId(userId)
        ]);

        const preferences = {
            mentorPreferences: {
                preferredExpertise: interests.map(i => i.interest),
                preferredLocation: profile?.location ? [profile.location] : [],
                preferredExperience: [],
                preferredLanguages: languages.map(l => l.language),
                sessionFrequency: profile?.availability || '1-2 sessions/week',
                communicationStyle: 'structured'
            },
            availability: {
                timeSlots: ['morning', 'afternoon'],
                timezone: 'GMT+1',
                maxSessionsPerWeek: 2
            },
            notifications: {
                emailNotifications: true,
                sessionReminders: true,
                newConnectionRequests: true,
                weeklyDigest: true
            }
        };

        res.json({
            success: true,
            data: { preferences }
        });

    } catch (error) {
        console.error('Error fetching preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch preferences'
        });
    }
});

// Update user preferences
router.put('/', auth, [
    body('mentorPreferences.preferredExpertise').isArray().withMessage('Preferred expertise must be an array'),
    body('mentorPreferences.preferredLocation').isArray().withMessage('Preferred location must be an array'),
    body('mentorPreferences.preferredLanguages').isArray().withMessage('Preferred languages must be an array')
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

        const userId = req.user.user_id;
        const { mentorPreferences, availability, notifications } = req.body;

        // Update interests (used for mentor matching)
        if (mentorPreferences.preferredExpertise) {
            await UserInterests.updateUserInterests(userId, mentorPreferences.preferredExpertise);
        }

        // Update languages
        if (mentorPreferences.preferredLanguages) {
            await UserLanguages.updateUserLanguages(userId, mentorPreferences.preferredLanguages);
        }

        // Update profile availability
        if (availability.maxSessionsPerWeek) {
            const profile = await UserProfile.findByUserId(userId);
            if (profile) {
                await UserProfile.update(userId, {
                    ...profile,
                    availability: `${availability.maxSessionsPerWeek} sessions/week`
                });
            }
        }

        // In a real implementation, you would also save availability and notification preferences
        // to separate tables or extend the UserProfiles table

        res.json({
            success: true,
            message: 'Preferences updated successfully'
        });

    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update preferences'
        });
    }
});

// Get mentor recommendations based on user preferences
router.get('/mentor-recommendations', auth, async (req, res) => {
    try {
        const userId = req.user.user_id;

        // Get user's interests to match with mentor expertise
        const userInterests = await UserInterests.findByUserId(userId);
        const userProfile = await UserProfile.findByUserId(userId);

        let mentors = await UserProfile.getAllMentors();

        // Filter mentors based on user interests
        if (userInterests.length > 0) {
            const interestNames = userInterests.map(i => i.interest);
            
            mentors = mentors.filter(mentor => {
                // Get mentor's expertise
                const mentorExpertise = mentor.expertise_list ? 
                    mentor.expertise_list.split(', ') : [];
                
                // Check if any mentor expertise matches user interests
                return mentorExpertise.some(expertise =>
                    interestNames.some(interest =>
                        expertise.toLowerCase().includes(interest.toLowerCase()) ||
                        interest.toLowerCase().includes(expertise.toLowerCase())
                    )
                );
            });
        }

        // Prioritize mentors from same region if user has location
        if (userProfile?.location) {
            const userCountry = userProfile.location.split(',')[1]?.trim();
            if (userCountry) {
                mentors.sort((a, b) => {
                    const aMatchesLocation = a.location?.includes(userCountry) ? 1 : 0;
                    const bMatchesLocation = b.location?.includes(userCountry) ? 1 : 0;
                    return bMatchesLocation - aMatchesLocation;
                });
            }
        }

        res.json({
            success: true,
            data: { mentors: mentors.slice(0, 20) } // Limit to top 20 recommendations
        });

    } catch (error) {
        console.error('Error getting mentor recommendations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get mentor recommendations'
        });
    }
});

export default router;