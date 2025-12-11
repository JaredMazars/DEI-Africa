// Mock Authentication Service - Works without backend
// All data is stored in localStorage

interface MockUser {
  id: string;
  email: string;
  password: string;
  isFirstLogin: boolean;
  profile?: any;
}

const USERS_KEY = 'mock_users';
const CURRENT_USER_KEY = 'mock_current_user';
const TOKEN_KEY = 'token';

// Initialize with some demo users
const initializeMockUsers = () => {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    const demoUsers: MockUser[] = [
      {
        id: 'demo-1',
        email: 'demo@forvismozars.com',
        password: 'demo123',
        isFirstLogin: false,
        profile: {
          role: 'mentee',
          name: 'Demo User',
          location: 'Nairobi, Kenya',
          expertise: ['Technology', 'Business'],
          interests: ['AI', 'Leadership'],
          experience: '3 years',
          goals: ['Career Growth', 'Networking'],
          availability: 'Weekends',
          languages: ['English', 'Swahili']
        }
      },
      {
        id: 'mentor-1',
        email: 'mentor@forvismozars.com',
        password: 'mentor123',
        isFirstLogin: false,
        profile: {
          role: 'mentor',
          name: 'Sarah Johnson',
          location: 'Lagos, Nigeria',
          expertise: ['Leadership', 'Technology', 'Business Strategy'],
          interests: ['Mentoring', 'Innovation'],
          experience: '10 years',
          goals: ['Give Back', 'Share Knowledge'],
          availability: 'Flexible',
          languages: ['English', 'Yoruba']
        }
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(demoUsers));
  }
};

export const mockAuthService = {
  // Register new user
  register: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    initializeMockUsers();
    const users: MockUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists with this email');
    }
    
    // Create new user
    const newUser: MockUser = {
      id: `user-${Date.now()}`,
      email,
      password,
      isFirstLogin: true
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Generate mock token
    const token = `mock-token-${newUser.id}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    
    return {
      success: true,
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          isFirstLogin: true
        },
        token
      }
    };
  },

  // Login user
  login: async (email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    initializeMockUsers();
    const users: MockUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Generate mock token
    const token = `mock-token-${user.id}`;
    localStorage.setItem(TOKEN_KEY, token);
    
    const userData = {
      id: user.id,
      email: user.email,
      isFirstLogin: user.isFirstLogin,
      profile: user.profile
    };
    
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    
    return {
      success: true,
      data: {
        user: userData,
        token
      }
    };
  },

  // Demo login
  demoLogin: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const demoUser = {
      id: 'demo-quick',
      email: 'quickdemo@forvismozars.com',
      isFirstLogin: false,
      profile: {
        role: 'mentee',
        name: 'Quick Demo User',
        location: 'Accra, Ghana',
        expertise: ['Consulting', 'Finance'],
        interests: ['Professional Development', 'Networking'],
        experience: '2 years',
        goals: ['Find a Mentor', 'Skill Development'],
        availability: 'Evenings',
        languages: ['English']
      }
    };
    
    const token = `mock-token-${demoUser.id}`;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(demoUser));
    localStorage.setItem('hasCompletedOnboarding', 'true');
    
    return {
      success: true,
      data: {
        user: demoUser,
        token
      }
    };
  },

  // Complete profile
  completeProfile: async (profileData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}');
    const users: MockUser[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    // Update user in users array
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex].profile = profileData;
      users[userIndex].isFirstLogin = false;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
    // Update current user
    currentUser.profile = profileData;
    currentUser.isFirstLogin = false;
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    localStorage.setItem('hasCompletedOnboarding', 'true');
    
    return {
      success: true,
      data: {
        profile: profileData
      }
    };
  },

  // Get current user
  getCurrentUser: () => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }
};
