import React, { useState } from 'react';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dashboardAPI, connectionsAPI, sessionsAPI, messagesAPI } from '../services/api';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Video, 
  Star, 
  Clock, 
  MapPin, 
  Award, 
  TrendingUp, 
  BookOpen, 
  Target,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Bell,
  CheckCircle,
  AlertCircle,
  User,
  Heart,
  Briefcase,
  Globe,
  ArrowRight,
  Activity,
  Zap,
  Coffee
} from 'lucide-react';

interface Connection {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  role: 'mentor' | 'mentee';
  status: 'active' | 'pending' | 'completed';
  expertise: string[];
  location: string;
  rating: number;
  totalSessions: number;
  upcomingSessions: number;
  lastActivity: string;
  connectionDate: string;
  matchScore: number;
}

interface Session {
  id: string;
  mentorName: string;
  menteeName: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'video' | 'in-person' | 'phone';
}

interface Activity {
  id: string;
  type: 'message' | 'session' | 'connection' | 'review';
  title: string;
  description: string;
  time: string;
  user: string;
  avatar: string;
}

const Home: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    totalConnections: 0,
    activeConnections: 0,
    totalSessions: 0,
    upcomingSessions: 0,
    averageRating: 0,
    responseRate: 0
  });

  // Load data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [dashboardData, connectionsData, sessionsData, activityData] = await Promise.all([
          dashboardAPI.getDashboardData(),
          connectionsAPI.getConnections(),
          sessionsAPI.getUpcomingSessions(),
          dashboardAPI.getActivity(10)
        ]);

        // Transform backend data to frontend format
        const transformedConnections = connectionsData.data.connections.map((conn: any) => ({
          id: conn.connection_id,
          name: conn.mentor_id === user?.id ? conn.mentee_name : conn.mentor_name,
          title: conn.mentor_id === user?.id ? 'Mentee' : conn.mentor_title || 'Mentor',
          company: 'Forvis Mazars', // Default company
          avatar: conn.mentor_id === user?.id ? conn.mentee_avatar : conn.mentor_avatar,
          role: conn.mentor_id === user?.id ? 'mentee' : 'mentor',
          status: conn.status === 'accepted' ? 'active' : conn.status,
          expertise: [], // Would need to fetch from expertise table
          location: conn.mentor_id === user?.id ? conn.mentee_location : conn.mentor_location,
          rating: conn.average_rating || 4.5,
          totalSessions: conn.total_sessions || 0,
          upcomingSessions: conn.upcoming_sessions || 0,
          lastActivity: new Date(conn.updated_at).toLocaleDateString(),
          connectionDate: new Date(conn.created_at).toLocaleDateString(),
          matchScore: 85
        }));

        const transformedSessions = sessionsData.data.sessions.map((session: any) => ({
          id: session.session_id,
          mentorName: session.mentor_name,
          menteeName: session.mentee_name,
          title: session.title,
          date: new Date(session.scheduled_at).toLocaleDateString(),
          time: new Date(session.scheduled_at).toLocaleTimeString(),
          duration: `${session.duration_minutes} min`,
          status: 'upcoming',
          type: 'video'
        }));

        setConnections(transformedConnections);
        setUpcomingSessions(transformedSessions);
        setRecentActivity(activityData.data.activities || []);
        setStats(dashboardData.data.stats || stats);

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Keep mock data as fallback
      } finally {
        setLoading(false);
      }
    };

    if (user && !user.isFirstLogin) {
      loadDashboardData();
    }
  }, [user]);

  const filteredConnections = connections.filter(connection => {
    const matchesSearch = connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         connection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         connection.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || connection.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'message': return MessageSquare;
      case 'session': return Video;
      case 'connection': return Users;
      case 'review': return Star;
      default: return Bell;
    }
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {loading && (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      )}
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.profile?.name || 'User'}! 👋
            </h1>
            <p className="text-blue-100 text-lg">
              {user?.profile?.role === 'mentor' 
                ? 'Ready to inspire and guide your mentees today?'
                : 'Continue your learning journey with your mentors'
              }
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Connections</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalConnections}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +2 this month
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Sessions</p>
              <p className="text-3xl font-bold text-gray-900">{stats.upcomingSessions}</p>
              <p className="text-sm text-blue-600 flex items-center mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                This week
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Video className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900">{stats.averageRating}</p>
              <p className="text-sm text-yellow-600 flex items-center mt-1">
                <Star className="w-4 h-4 mr-1 fill-current" />
                Excellent
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Response Rate</p>
              <p className="text-3xl font-bold text-gray-900">{stats.responseRate}%</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <Zap className="w-4 h-4 mr-1" />
                Fast responder
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-900" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow text-left group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Plus className="w-6 h-6 text-blue-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Find New Mentors</h3>
          <p className="text-gray-600 text-sm">Discover experienced professionals in your field</p>
        </button>

        <button className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow text-left group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Session</h3>
          <p className="text-gray-600 text-sm">Book a mentoring session with your connections</p>
        </button>

        <button className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow text-left group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <BookOpen className="w-6 h-6 text-blue-900" />
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-900 transition-colors" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Browse Resources</h3>
          <p className="text-gray-600 text-sm">Access learning materials and industry insights</p>
        </button>
      </div>

      {/* Upcoming Sessions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Sessions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Upcoming Sessions
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {upcomingSessions.slice(0, 3).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {session.type === 'video' && <Video className="w-5 h-5 text-blue-600" />}
                    {session.type === 'in-person' && <Users className="w-5 h-5 text-blue-600" />}
                    {session.type === 'phone' && <Coffee className="w-5 h-5 text-blue-600" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{session.title}</h4>
                    <p className="text-sm text-gray-600">
                      with {session.mentorName === 'You' ? session.menteeName : session.mentorName}
                    </p>
                    <p className="text-xs text-gray-500">{session.date} at {session.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{session.duration}</span>
                  <p className="text-xs text-gray-500 capitalize">{session.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </h3>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <img
                    src={activity.avatar}
                    alt={activity.user}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Icon className="w-4 h-4 text-blue-600" />
                      <h4 className="font-medium text-gray-900 text-sm">{activity.title}</h4>
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderConnections = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search connections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Connections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredConnections.map((connection) => (
          <div key={connection.id} className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <img
                  src={connection.avatar}
                  alt={connection.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{connection.name}</h3>
                  <p className="text-blue-600 font-medium text-sm">{connection.title}</p>
                  <p className="text-gray-600 text-xs">{connection.company}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(connection.status)}`}>
                {connection.status}
              </span>
            </div>

            {/* Role Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                connection.role === 'mentor' ? 'bg-blue-100 text-blue-900' : 'bg-teal-100 text-teal-800'
              }`}>
                {connection.role === 'mentor' ? '👨‍🏫 Mentor' : '🎓 Mentee'}
              </span>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{connection.location.split(',')[0]}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{connection.totalSessions}</div>
                <div className="text-xs text-gray-600">Sessions</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                  <span className="text-lg font-bold text-gray-900">{connection.rating}</span>
                </div>
                <div className="text-xs text-gray-600">Rating</div>
              </div>
            </div>

            {/* Expertise */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {connection.expertise.slice(0, 2).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {connection.expertise.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{connection.expertise.length - 2}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-1 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>Message</span>
              </button>
              <button className="flex items-center justify-center space-x-1 py-2 px-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Calendar className="w-4 h-4" />
                <span>Schedule</span>
              </button>
            </div>

            {/* Last Activity */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">Last activity: {connection.lastActivity}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredConnections.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No connections found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto px-12 sm:px-16 lg:px-20 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Overview</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('connections')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'connections'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>My Connections ({stats.totalConnections})</span>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'connections' && renderConnections()}
      </div>
    </div>
  );
};

export default Home;