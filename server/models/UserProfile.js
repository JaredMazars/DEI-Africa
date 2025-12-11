import { executeQuery } from '../config/database.js';

class UserProfile {
    constructor(data) {
        this.profile_id = data.profile_id;
        this.user_id = data.user_id;
        this.role = data.role;
        this.name = data.name;
        this.location = data.location;
        this.experience = data.experience;
        this.availability = data.availability;
        this.bio = data.bio;
        this.profile_image_url = data.profile_image_url;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    static async create(profileData) {
        try {
            const query = `
                INSERT INTO UserProfiles (user_id, role, name, location, experience, availability, bio, profile_image_url, created_at, updated_at)
                OUTPUT INSERTED.*
                VALUES ('${profileData.user_id}', '${profileData.role}', '${profileData.name}', 
                        '${profileData.location}', '${profileData.experience}', '${profileData.availability}', 
                        ${profileData.bio ? `'${profileData.bio.replace(/'/g, "''")}'` : 'NULL'}, 
                        ${profileData.profile_image_url ? `'${profileData.profile_image_url}'` : 'NULL'}, 
                        GETDATE(), GETDATE())
            `;
            
            const result = await executeQuery(query);
            return new UserProfile(result.recordset[0]);
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    }

    static async findByUserId(userId) {
        try {
            const query = `SELECT * FROM UserProfiles WHERE user_id = '${userId}'`;
            const result = await executeQuery(query);
            
            return result.recordset.length > 0 ? new UserProfile(result.recordset[0]) : null;
        } catch (error) {
            console.error('Error finding profile by user ID:', error);
            throw error;
        }
    }

    static async update(userId, updateData) {
        try {
            const query = `
                UPDATE UserProfiles 
                SET name = '${updateData.name}', 
                    location = '${updateData.location}', 
                    experience = '${updateData.experience}', 
                    availability = '${updateData.availability}', 
                    bio = ${updateData.bio ? `'${updateData.bio.replace(/'/g, "''")}'` : 'NULL'}, 
                    profile_image_url = ${updateData.profile_image_url ? `'${updateData.profile_image_url}'` : 'NULL'},
                    updated_at = GETDATE()
                OUTPUT INSERTED.*
                WHERE user_id = '${userId}'
            `;
            
            const result = await executeQuery(query);
            return result.recordset.length > 0 ? new UserProfile(result.recordset[0]) : null;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }

    static async getMentorsByExpertise(expertise) {
        try {
            const query = `
                SELECT DISTINCT up.*, ue.expertise
                FROM UserProfiles up
                INNER JOIN UserExpertise ue ON up.user_id = ue.user_id
                WHERE up.role = 'mentor' AND ue.expertise LIKE '%${expertise}%'
                ORDER BY up.created_at DESC
            `;
            
            const result = await executeQuery(query);
            return result.recordset.map(profile => new UserProfile(profile));
        } catch (error) {
            console.error('Error getting mentors by expertise:', error);
            throw error;
        }
    }

    static async getMenteesByInterests(interest) {
        try {
            const query = `
                SELECT DISTINCT up.*, ui.interest
                FROM UserProfiles up
                INNER JOIN UserInterests ui ON up.user_id = ui.user_id
                WHERE up.role = 'mentee' AND ui.interest LIKE '%${interest}%'
                ORDER BY up.created_at DESC
            `;
            
            const result = await executeQuery(query);
            return result.recordset.map(profile => new UserProfile(profile));
        } catch (error) {
            console.error('Error getting mentees by interests:', error);
            throw error;
        }
    }

    static async getAllMentors() {
        try {
            const query = `
                SELECT up.*, 
                       STRING_AGG(ue.expertise, ', ') as expertise_list,
                       STRING_AGG(ui.interest, ', ') as interests_list,
                       STRING_AGG(ul.language, ', ') as languages_list
                FROM UserProfiles up
                LEFT JOIN UserExpertise ue ON up.user_id = ue.user_id
                LEFT JOIN UserInterests ui ON up.user_id = ui.user_id
                LEFT JOIN UserLanguages ul ON up.user_id = ul.user_id
                WHERE up.role = 'mentor'
                GROUP BY up.profile_id, up.user_id, up.role, up.name, up.location, 
                         up.experience, up.availability, up.bio, up.profile_image_url, 
                         up.created_at, up.updated_at
                ORDER BY up.created_at DESC
            `;
            
            const result = await executeQuery(query);
            return result.recordset.map(profile => new UserProfile(profile));
        } catch (error) {
            console.error('Error getting all mentors:', error);
            throw error;
        }
    }

    static async getAllMentees() {
        try {
            const query = `
                SELECT up.*, 
                       STRING_AGG(ue.expertise, ', ') as expertise_list,
                       STRING_AGG(ui.interest, ', ') as interests_list,
                       STRING_AGG(ul.language, ', ') as languages_list
                FROM UserProfiles up
                LEFT JOIN UserExpertise ue ON up.user_id = ue.user_id
                LEFT JOIN UserInterests ui ON up.user_id = ui.user_id
                LEFT JOIN UserLanguages ul ON up.user_id = ul.user_id
                WHERE up.role = 'mentee'
                GROUP BY up.profile_id, up.user_id, up.role, up.name, up.location, 
                         up.experience, up.availability, up.bio, up.profile_image_url, 
                         up.created_at, up.updated_at
                ORDER BY up.created_at DESC
            `;
            
            const result = await executeQuery(query);
            return result.recordset.map(profile => new UserProfile(profile));
        } catch (error) {
            console.error('Error getting all mentees:', error);
            throw error;
        }
    }
}

export default UserProfile;