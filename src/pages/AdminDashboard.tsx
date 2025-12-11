import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BookOpen, Calendar, MessageSquare, 
  Briefcase, Award, Settings, LogOut, Search, Plus, Edit, 
  Trash2, Eye, Filter, Download, Upload, TrendingUp, 
  Activity, UserCheck, FileText, Globe, Shield, Bell,
  ChevronDown, MoreVertical, X, Check, AlertCircle, Save
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const openModal = (type: string, item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    setFormData(item || {});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType('');
    setEditingItem(null);
    setFormData({});
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    console.log('Saving:', modalType, formData);
    alert(`${editingItem ? 'Updated' : 'Created'} ${modalType} successfully!`);
    closeModal();
  };

  // Dummy Stats Data
  const stats = [
    { label: 'Total Users', value: '2,847', change: '+12.5%', icon: Users, color: 'blue' },
    { label: 'Active Mentors', value: '342', change: '+8.2%', icon: UserCheck, color: 'green' },
    { label: 'Sessions This Month', value: '1,238', change: '+23.1%', icon: Calendar, color: 'purple' },
    { label: 'Resources', value: '567', change: '+5.3%', icon: BookOpen, color: 'orange' },
  ];

  // Dummy Users Data
  const users = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@forvismazars.com', role: 'Mentor', status: 'Active', joined: '2024-01-15', sessions: 45, rating: 4.9 },
    { id: 2, name: 'Michael Chen', email: 'michael.c@forvismazars.com', role: 'Mentee', status: 'Active', joined: '2024-02-20', sessions: 12, rating: 4.7 },
    { id: 3, name: 'Dr. Emily Rodriguez', email: 'emily.r@forvismazars.com', role: 'Mentor', status: 'Active', joined: '2023-11-10', sessions: 89, rating: 5.0 },
    { id: 4, name: 'James Wilson', email: 'james.w@forvismazars.com', role: 'Mentor', status: 'Inactive', joined: '2024-03-05', sessions: 23, rating: 4.8 },
    { id: 5, name: 'Aisha Patel', email: 'aisha.p@forvismazars.com', role: 'Mentee', status: 'Active', joined: '2024-01-28', sessions: 8, rating: 4.6 },
    { id: 6, name: 'David Thompson', email: 'david.t@forvismazars.com', role: 'Admin', status: 'Active', joined: '2023-09-12', sessions: 156, rating: 4.9 },
  ];

  // Dummy Resources Data
  const resources = [
    { id: 1, title: 'Leadership Excellence Guide', type: 'PDF', category: 'Leadership', downloads: 523, size: '2.4 MB', uploaded: '2024-01-10' },
    { id: 2, title: 'DEI Best Practices Workshop', type: 'Video', category: 'DEI', downloads: 892, size: '156 MB', uploaded: '2024-01-15' },
    { id: 3, title: 'Mentorship Framework 2024', type: 'PDF', category: 'Mentorship', downloads: 671, size: '1.8 MB', uploaded: '2024-02-01' },
    { id: 4, title: 'Career Development Toolkit', type: 'Document', category: 'Career', downloads: 445, size: '3.2 MB', uploaded: '2024-02-10' },
    { id: 5, title: 'Technical Skills Roadmap', type: 'PDF', category: 'Technical', downloads: 389, size: '4.1 MB', uploaded: '2024-02-18' },
  ];

  // Dummy Sessions Data
  const sessions = [
    { id: 1, mentor: 'Dr. Emily Rodriguez', mentee: 'Michael Chen', topic: 'Career Planning', date: '2024-03-15', time: '14:00', status: 'Completed', rating: 5 },
    { id: 2, mentor: 'Sarah Johnson', mentee: 'Aisha Patel', topic: 'Leadership Skills', date: '2024-03-16', time: '10:00', status: 'Scheduled', rating: null },
    { id: 3, mentor: 'James Wilson', mentee: 'Michael Chen', topic: 'Technical Review', date: '2024-03-14', time: '15:30', status: 'Completed', rating: 4 },
    { id: 4, mentor: 'Dr. Emily Rodriguez', mentee: 'Aisha Patel', topic: 'Goal Setting', date: '2024-03-17', time: '11:00', status: 'Scheduled', rating: null },
  ];

  // Dummy Activities Data
  const recentActivities = [
    { user: 'Sarah Johnson', action: 'completed a mentoring session', time: '5 minutes ago', icon: Check, color: 'green' },
    { user: 'Michael Chen', action: 'uploaded a new resource', time: '23 minutes ago', icon: Upload, color: 'blue' },
    { user: 'Emily Rodriguez', action: 'updated profile information', time: '1 hour ago', icon: Edit, color: 'purple' },
    { user: 'System', action: 'generated monthly analytics report', time: '2 hours ago', icon: FileText, color: 'orange' },
    { user: 'Aisha Patel', action: 'joined a new discussion forum', time: '3 hours ago', icon: MessageSquare, color: 'indigo' },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
              <span className="text-green-600 text-sm font-semibold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">User Growth</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View Details</button>
          </div>
          <div className="h-64 flex items-end justify-around space-x-2">
            {[65, 78, 85, 92, 88, 95, 100, 105, 98, 110, 115, 120].map((height, i) => (
              <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer" style={{ height: `${height}%` }} title={`Month ${i + 1}`} />
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-500">
            <span>Jan</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Session Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Session Statistics</h3>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed Sessions</span>
              <span className="text-sm font-bold text-gray-900">1,238</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Scheduled Sessions</span>
              <span className="text-sm font-bold text-gray-900">342</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Cancelled Sessions</span>
              <span className="text-sm font-bold text-gray-900">45</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }} />
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">96.4%</div>
                <div className="text-sm text-gray-600">Completion Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`w-10 h-10 rounded-full bg-${activity.color}-100 flex items-center justify-center flex-shrink-0`}>
                <activity.icon className={`w-5 h-5 text-${activity.color}-600`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage all platform users, roles, and permissions</p>
        </div>
        <button
          onClick={() => openModal('user')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>All Roles</option>
            <option>Mentors</option>
            <option>Mentees</option>
            <option>Admins</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sessions</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'Mentor' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{user.sessions}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-gray-900">{user.rating}</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{user.joined}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => openModal('user', user)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">1-6</span> of <span className="font-medium">2,847</span> users
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">Previous</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">3</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resource Library</h2>
          <p className="text-sm text-gray-600 mt-1">Manage documents, videos, and learning materials</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium flex items-center space-x-2">
            <Download className="w-5 h-5" />
            <span>Export</span>
          </button>
          <button
            onClick={() => openModal('resource')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Resource</span>
          </button>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <FileText className="w-16 h-16 text-white opacity-50" />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  resource.type === 'PDF' ? 'bg-red-100 text-red-800' :
                  resource.type === 'Video' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {resource.type}
                </span>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <MoreVertical className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span className="flex items-center">
                  <Download className="w-4 h-4 mr-1" />
                  {resource.downloads}
                </span>
                <span>{resource.size}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500">{resource.uploaded}</span>
                <div className="flex space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => openModal('resource', resource)}
                    className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Session Management</h2>
          <p className="text-sm text-gray-600 mt-1">View and manage all mentoring sessions</p>
        </div>
        <button
          onClick={() => openModal('session')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Schedule Session</span>
        </button>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Mentor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Mentee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Topic</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Rating</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{session.mentor}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{session.mentee}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{session.topic}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{session.date}</div>
                    <div className="text-xs text-gray-500">{session.time}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      session.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      session.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {session.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {session.rating ? (
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{session.rating}</span>
                        <span className="text-yellow-400 ml-1">★</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button 
                        onClick={() => openModal('session', session)}
                        className="p-2 hover:bg-gray-100 rounded-lg">
                        <Edit className="w-4 h-4 text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDiscussions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Discussion Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage community discussions and forums</p>
        </div>
        <button
          onClick={() => openModal('discussion')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Discussion</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {[
            { id: 1, title: 'Best practices for DEI mentorship', author: 'Sarah Johnson', category: 'DEI', replies: 45, views: 892, date: '2024-03-10', pinned: true },
            { id: 2, title: 'How to overcome imposter syndrome', author: 'Michael Chen', category: 'Career', replies: 32, views: 654, date: '2024-03-12', pinned: false },
            { id: 3, title: 'Technical leadership skills development', author: 'Dr. Emily Rodriguez', category: 'Technical', replies: 28, views: 543, date: '2024-03-14', pinned: false },
            { id: 4, title: 'Work-life balance strategies', author: 'James Wilson', category: 'General', replies: 56, views: 1023, date: '2024-03-15', pinned: false },
            { id: 5, title: 'Effective communication in remote teams', author: 'Aisha Patel', category: 'Communication', replies: 41, views: 789, date: '2024-03-16', pinned: false },
          ].map((discussion) => (
            <div key={discussion.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {discussion.pinned && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Pinned</span>
                    )}
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">{discussion.category}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{discussion.title}</h3>
                  <p className="text-sm text-gray-600">Started by {discussion.author} • {discussion.date}</p>
                  <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                    <span className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      {discussion.replies} replies
                    </span>
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {discussion.views} views
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={() => openModal('discussion', discussion)}
                    className="p-2 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOpportunities = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Opportunities Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage workshops, events, and programs</p>
        </div>
        <button
          onClick={() => openModal('opportunity')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Opportunity</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 1, title: 'Leadership Excellence Workshop', type: 'Workshop', date: '2024-04-15', participants: 45, status: 'Open', image: '🎓' },
          { id: 2, title: 'DEI Summit 2024', type: 'Conference', date: '2024-05-20', participants: 156, status: 'Open', image: '🌍' },
          { id: 3, title: 'Mentorship Masterclass', type: 'Program', date: '2024-04-10', participants: 32, status: 'Full', image: '🚀' },
          { id: 4, title: 'Tech Leadership Forum', type: 'Event', date: '2024-04-25', participants: 89, status: 'Open', image: '💻' },
          { id: 5, title: 'Career Development Series', type: 'Program', date: '2024-05-01', participants: 67, status: 'Open', image: '📈' },
          { id: 6, title: 'Networking Mixer', type: 'Event', date: '2024-03-30', participants: 124, status: 'Full', image: '🤝' },
        ].map((opportunity) => (
          <div key={opportunity.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{opportunity.image}</div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                opportunity.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {opportunity.status}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{opportunity.title}</h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                {opportunity.type}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {opportunity.date}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {opportunity.participants} participants
              </div>
            </div>
            <div className="flex space-x-2 pt-4 border-t border-gray-200">
              <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium">
                View Details
              </button>
              <button 
                onClick={() => openModal('opportunity', opportunity)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Edit className="w-4 h-4 text-blue-600" />
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Achievements & Badges</h2>
          <p className="text-sm text-gray-600 mt-1">Manage gamification and user achievements</p>
        </div>
        <button
          onClick={() => alert('Create Achievement - Coming Soon!')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create Achievement</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { id: 1, name: 'First Steps', description: 'Complete your first session', icon: '🌟', earned: 847, color: 'blue' },
          { id: 2, name: 'Mentor Master', description: 'Complete 50+ sessions', icon: '👑', earned: 156, color: 'purple' },
          { id: 3, name: 'Knowledge Seeker', description: 'Access 25+ resources', icon: '📚', earned: 523, color: 'green' },
          { id: 4, name: 'Community Builder', description: 'Make 10+ connections', icon: '🤝', earned: 689, color: 'orange' },
          { id: 5, name: 'Top Rated', description: 'Achieve 5.0 rating', icon: '⭐', earned: 234, color: 'yellow' },
          { id: 6, name: 'Discussion Leader', description: 'Start 5+ discussions', icon: '💬', earned: 412, color: 'indigo' },
          { id: 7, name: 'Early Adopter', description: 'Join in first month', icon: '🚀', earned: 298, color: 'pink' },
          { id: 8, name: 'Consistent Learner', description: '30-day streak', icon: '🔥', earned: 567, color: 'red' },
        ].map((achievement) => (
          <div key={achievement.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="text-5xl mb-3">{achievement.icon}</div>
              <h3 className="font-bold text-gray-900 mb-2">{achievement.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
              <div className="pt-4 border-t border-gray-200">
                <div className="text-2xl font-bold text-blue-600">{achievement.earned}</div>
                <div className="text-xs text-gray-500">users earned</div>
              </div>
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  Edit
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Platform Settings</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">General Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
              <input type="text" defaultValue="DEI Africa Café" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
              <input type="email" defaultValue="support@forvismazars.com" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>UTC+2 (Cape Town)</option>
                <option>UTC+0 (London)</option>
                <option>UTC-5 (New York)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Notifications</h3>
          <div className="space-y-4">
            {['Email notifications', 'Push notifications', 'Session reminders', 'Activity alerts'].map((item) => (
              <label key={item} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <span className="text-sm font-medium text-gray-700">{item}</span>
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </label>
            ))}
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Security</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
              <input type="number" defaultValue="30" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password Complexity</label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
            <label className="flex items-center space-x-3">
              <input type="checkbox" defaultChecked className="rounded border-gray-300" />
              <span className="text-sm text-gray-700">Require 2FA for admins</span>
            </label>
          </div>
        </div>

        {/* Platform Features */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Features</h3>
          <div className="space-y-4">
            {['User registration', 'Mentor matching', 'Video sessions', 'Resource downloads', 'Discussion forums'].map((item) => (
              <label key={item} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <span className="text-sm font-medium text-gray-700">{item}</span>
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
          Cancel
        </button>
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
          Save Changes
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="w-8 h-8 text-yellow-400" />
            <div>
              <div className="font-bold text-lg">Admin Portal</div>
              <div className="text-xs text-blue-200">Forvis Mazars</div>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'users', icon: Users, label: 'Users' },
              { id: 'resources', icon: BookOpen, label: 'Resources' },
              { id: 'sessions', icon: Calendar, label: 'Sessions' },
              { id: 'discussions', icon: MessageSquare, label: 'Discussions' },
              { id: 'opportunities', icon: Briefcase, label: 'Opportunities' },
              { id: 'achievements', icon: Award, label: 'Achievements' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-6 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
              </h1>
              <p className="text-sm text-gray-600">Welcome back, Administrator</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  A
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Admin User</div>
                  <div className="text-xs text-gray-500">Super Admin</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'users' && renderUsers()}
          {activeSection === 'resources' && renderResources()}
          {activeSection === 'sessions' && renderSessions()}
          {activeSection === 'discussions' && renderDiscussions()}
          {activeSection === 'opportunities' && renderOpportunities()}
          {activeSection === 'achievements' && renderAchievements()}
          {activeSection === 'settings' && renderSettings()}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? 'Edit' : 'Add New'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              {modalType === 'user' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="user@forvismazars.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select
                      value={formData.role || ''}
                      onChange={(e) => handleFormChange('role', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Mentor">Mentor</option>
                      <option value="Mentee">Mentee</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status || ''}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              )}

              {modalType === 'resource' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resource Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter resource title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      <option value="Leadership">Leadership</option>
                      <option value="DEI">DEI</option>
                      <option value="Mentorship">Mentorship</option>
                      <option value="Career">Career Development</option>
                      <option value="Technical">Technical Skills</option>
                      <option value="Communication">Communication</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resource Type</label>
                    <select
                      value={formData.type || ''}
                      onChange={(e) => handleFormChange('type', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      <option value="PDF">PDF Document</option>
                      <option value="Video">Video</option>
                      <option value="Document">Document</option>
                      <option value="Presentation">Presentation</option>
                      <option value="Audio">Audio</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief description of the resource"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, DOC, VIDEO (max 100MB)</p>
                      <input type="file" className="hidden" />
                    </div>
                  </div>
                </div>
              )}

              {modalType === 'session' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Topic</label>
                    <input
                      type="text"
                      value={formData.topic || ''}
                      onChange={(e) => handleFormChange('topic', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Career Development Strategy"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mentor</label>
                      <select
                        value={formData.mentor || ''}
                        onChange={(e) => handleFormChange('mentor', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Mentor</option>
                        <option value="Dr. Emily Rodriguez">Dr. Emily Rodriguez</option>
                        <option value="Sarah Johnson">Sarah Johnson</option>
                        <option value="James Wilson">James Wilson</option>
                        <option value="David Thompson">David Thompson</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Mentee</label>
                      <select
                        value={formData.mentee || ''}
                        onChange={(e) => handleFormChange('mentee', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Mentee</option>
                        <option value="Michael Chen">Michael Chen</option>
                        <option value="Aisha Patel">Aisha Patel</option>
                        <option value="John Smith">John Smith</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <input
                        type="date"
                        value={formData.date || ''}
                        onChange={(e) => handleFormChange('date', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                      <input
                        type="time"
                        value={formData.time || ''}
                        onChange={(e) => handleFormChange('time', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                    <select
                      value={formData.duration || ''}
                      onChange={(e) => handleFormChange('duration', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Duration</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link (Optional)</label>
                    <input
                      type="url"
                      value={formData.meetingLink || ''}
                      onChange={(e) => handleFormChange('meetingLink', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://zoom.us/j/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => handleFormChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Any additional information for this session..."
                    />
                  </div>
                </div>
              )}

              {modalType === 'discussion' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discussion Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter discussion topic"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => handleFormChange('category', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      <option value="General">General Discussion</option>
                      <option value="Career">Career Advice</option>
                      <option value="DEI">DEI Topics</option>
                      <option value="Technical">Technical Questions</option>
                      <option value="Mentorship">Mentorship Tips</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe the discussion topic in detail..."
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.pinned || false}
                      onChange={(e) => handleFormChange('pinned', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="text-sm text-gray-700">Pin this discussion to the top</label>
                  </div>
                </div>
              )}

              {modalType === 'opportunity' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opportunity Title</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Senior Leadership Workshop"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={formData.type || ''}
                      onChange={(e) => handleFormChange('type', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Event">Event</option>
                      <option value="Program">Program</option>
                      <option value="Conference">Conference</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => handleFormChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Detailed description of the opportunity..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate || ''}
                        onChange={(e) => handleFormChange('startDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate || ''}
                        onChange={(e) => handleFormChange('endDate', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registration Link</label>
                    <input
                      type="url"
                      value={formData.link || ''}
                      onChange={(e) => handleFormChange('link', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingItem ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
