import React, { useState } from 'react';
import { Camera, MapPin, Briefcase, Mail, Phone, Calendar, Star, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const achievements = [
    { icon: Star, title: 'Top Rated Mentee', description: '4.9/5 average rating from mentors' },
    { icon: Award, title: 'Quick Learner', description: 'Completed 15 courses this year' },
    { icon: TrendingUp, title: 'Growth Focused', description: '50+ hours of mentoring sessions' }
  ];

  const completedSessions = [
    {
      mentor: 'Dr. Emily Rodriguez',
      topic: 'Leadership Development',
      date: '2024-01-10',
      rating: 5,
      feedback: 'Excellent session with great insights on team management.'
    },
    {
      mentor: 'James Wilson',
      topic: 'Technical Skills Review',
      date: '2024-01-08',
      rating: 5,
      feedback: 'Very helpful guidance on system architecture patterns.'
    },
    {
      mentor: 'Sarah Johnson',
      topic: 'Career Planning',
      date: '2024-01-05',
      rating: 4,
      feedback: 'Great advice on career progression and goal setting.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header with Forvis Mazars Branding */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-[1920px] mx-auto px-12 sm:px-16 lg:px-20 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3 text-white">My Profile</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Manage your professional profile and track your development
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        {/* Cover Photo */}
        <div className="h-32 bg-gradient-to-r from-blue-900 to-blue-800 relative">
          <button className="absolute bottom-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-medium transition-colors">
            <Camera className="w-4 h-4 inline mr-1" />
            Edit Cover
          </button>
        </div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex items-end space-x-4 -mt-16 mb-4">
            <div className="relative">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg"
              />
              <button className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 pt-16">
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="text-gray-600">Professional Growth Enthusiast</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>Cape Town, South Afric</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined January 2024</span>
                </div>
              </div>
            </div>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
        <div className="flex space-x-8 px-6">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'sessions', label: 'Sessions' },
            { key: 'achievements', label: 'Achievements' },
            { key: 'settings', label: 'Settings' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-4 px-2 border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* About */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                I'm a passionate professional focused on continuous learning and growth. Currently seeking mentorship 
                in leadership development, technical skills, and career advancement. I believe in the power of 
                meaningful connections and knowledge sharing.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Leadership', 'Product Management', 'Analytics', 'Team Building'].map(skill => (
                  <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Completed session with Dr. Emily Rodriguez</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Earned "Quick Learner" achievement</p>
                    <p className="text-xs text-gray-500">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-900">Joined DEI Africa Cafe community</p>
                    <p className="text-xs text-gray-500">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mentorship Activities CTA */}
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Mentorship Activities</h3>
              <p className="text-blue-100 text-sm mb-4">
                Explore interactive tools to strengthen your mentorship journey
              </p>
              <button
                onClick={() => navigate('/mentorship-activities')}
                className="w-full bg-white text-blue-900 hover:bg-blue-50 px-4 py-3 rounded-lg font-semibold transition-colors"
              >
                Explore Activities →
              </button>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sessions Completed</span>
                  <span className="text-sm font-semibold text-gray-900">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mentors Connected</span>
                  <span className="text-sm font-semibold text-gray-900">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Resources Accessed</span>
                  <span className="text-sm font-semibold text-gray-900">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Rating</span>
                  <span className="text-sm font-semibold text-gray-900">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Completed Sessions</h2>
          <div className="space-y-6">
            {completedSessions.map((session, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{session.topic}</h3>
                    <p className="text-sm text-gray-600">with {session.mentor}</p>
                    <p className="text-xs text-gray-500">{session.date}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < session.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{session.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center p-6 border border-gray-200 rounded-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{achievement.title}</h3>
                <p className="text-sm text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue={user?.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
              />
            </div>
            <div className="flex space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                Save Changes
              </button>
              <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-2 rounded-lg font-medium transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Profile;