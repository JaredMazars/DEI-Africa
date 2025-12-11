import { executeQuery } from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
    constructor(data) {
        this.user_id = data.user_id;
        this.email = data.email;
        this.password_hash = data.password_hash;
        this.is_active = data.is_active;
        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    }

    static async create(userData) {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 12);
            
            const query = `
                INSERT INTO Users (email, password_hash, is_active, created_at, updated_at)
                OUTPUT INSERTED.*
                VALUES ('${userData.email}', '${hashedPassword}', 1, GETDATE(), GETDATE())
            `;
            
            const result = await executeQuery(query);
            return new User(result.recordset[0]);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    static async findByEmail(email) {
        try {
            const query = `SELECT * FROM Users WHERE email = '${email}' AND is_active = 1`;
            const result = await executeQuery(query);
            
            return result.recordset.length > 0 ? new User(result.recordset[0]) : null;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw error;
        }
    }

    static async findById(userId) {
        try {
            const query = `SELECT * FROM Users WHERE user_id = '${userId}' AND is_active = 1`;
            const result = await executeQuery(query);
            
            return result.recordset.length > 0 ? new User(result.recordset[0]) : null;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error;
        }
    }

    static async getAll() {
        try {
            const query = `
                SELECT u.*, up.name, up.role, up.location, up.bio, up.profile_image_url
                FROM Users u
                LEFT JOIN UserProfiles up ON u.user_id = up.user_id
                WHERE u.is_active = 1
                ORDER BY u.created_at DESC
            `;
            
            const result = await executeQuery(query);
            return result.recordset.map(user => new User(user));
        } catch (error) {
            console.error('Error getting all users:', error);
            throw error;
        }
    }

    static async updateLastLogin(userId) {
        try {
            const query = `UPDATE Users SET updated_at = GETDATE() WHERE user_id = '${userId}'`;
            await executeQuery(query);
        } catch (error) {
            console.error('Error updating last login:', error);
            throw error;
        }
    }

    async validatePassword(password) {
        return await bcrypt.compare(password, this.password_hash);
    }

    static async getUserStats() {
        try {
            const query = `
                SELECT 
                    COUNT(*) as total_users,
                    SUM(CASE WHEN up.role = 'mentor' THEN 1 ELSE 0 END) as total_mentors,
                    SUM(CASE WHEN up.role = 'mentee' THEN 1 ELSE 0 END) as total_mentees,
                    COUNT(CASE WHEN u.created_at >= DATEADD(month, -1, GETDATE()) THEN 1 END) as new_users_this_month
                FROM Users u
                LEFT JOIN UserProfiles up ON u.user_id = up.user_id
                WHERE u.is_active = 1
            `;
            
            const result = await executeQuery(query);
            return result.recordset[0];
        } catch (error) {
            console.error('Error getting user stats:', error);
            throw error;
        }
    }

    static async updateStatus(userId, isActive) {
        try {
            const query = `
                UPDATE Users 
                SET is_active = ${isActive ? 1 : 0}, updated_at = GETDATE() 
                WHERE user_id = '${userId}'
            `;
            await executeQuery(query);
        } catch (error) {
            console.error('Error updating user status:', error);
            throw error;
        }
    }
}

export default User;