import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCog,
  FileText,
  BookOpen,
  Briefcase,
  Bell,
  ClipboardList,
  LogOut,
  Shield
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/overview', label: 'Overview', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/mentors', label: 'Mentors', icon: UserCog },
    { path: '/admin/experts', label: 'Experts', icon: Users },
    { path: '/admin/content', label: 'Content', icon: FileText },
    { path: '/admin/resources', label: 'Resources', icon: BookOpen },
    { path: '/admin/opportunities', label: 'Jobs', icon: Briefcase },
    { path: '/admin/collaboration', label: 'Collaboration', icon: Users },
    { path: '/admin/notifications', label: 'Announcements', icon: Bell },
    { path: '/admin/audit', label: 'Audit Log', icon: ClipboardList }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-blue-600">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-lg rounded-lg p-2">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Admin Console</h1>
              <p className="text-xs text-blue-200">DEI Africa Café</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-white text-blue-900 shadow-lg font-semibold'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-600">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-blue-100 hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

