import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Video, Plus, Filter, List, Grid3x3 } from 'lucide-react';
import { mockAPI } from '../services/mockData';

interface CalendarEvent {
  id: string;
  title: string;
  type: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  attendees: string[];
  color: string;
  meetingLink?: string;
  description?: string;
}

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const response = await mockAPI.getCalendarEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-700 border-blue-300',
    green: 'bg-green-100 text-green-700 border-green-300',
    purple: 'bg-purple-100 text-purple-700 border-purple-300',
    orange: 'bg-orange-100 text-orange-700 border-orange-300',
    pink: 'bg-pink-100 text-pink-700 border-pink-300',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <CalendarIcon className="w-8 h-8" />
                <h1 className="text-4xl font-bold">Calendar & Schedule</h1>
              </div>
              <p className="text-xl text-blue-100">
                Manage your mentorship sessions, events, and important dates
              </p>
            </div>
            <button className="bg-white text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>New Event</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between">
            {/* Month Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  viewMode === 'month' ? 'bg-white shadow text-blue-900' : 'text-gray-600'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
                <span>Month</span>
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  viewMode === 'week' ? 'bg-white shadow text-blue-900' : 'text-gray-600'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Week</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  viewMode === 'list' ? 'bg-white shadow text-blue-900' : 'text-gray-600'
                }`}
              >
                <List className="w-4 h-4" />
                <span>List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'month' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            {/* Day Headers */}
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {dayNames.map(day => (
                <div key={day} className="p-4 text-center">
                  <span className="text-sm font-semibold text-gray-700">{day}</span>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {getDaysInMonth(currentDate).map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="min-h-[120px] bg-gray-50 border border-gray-200"></div>;
                }

                const dateEvents = getEventsForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();

                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={`min-h-[120px] border border-gray-200 p-2 cursor-pointer transition-all hover:bg-blue-50 ${
                      isToday ? 'bg-blue-50' : ''
                    } ${isSelected ? 'ring-2 ring-blue-900' : ''}`}
                  >
                    <div className={`text-sm font-semibold mb-2 ${
                      isToday ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dateEvents.slice(0, 2).map(event => (
                        <div
                          key={event.id}
                          className={`text-xs p-1 rounded border ${colorClasses[event.color as keyof typeof colorClasses]} truncate`}
                        >
                          {event.time} {event.title}
                        </div>
                      ))}
                      {dateEvents.length > 2 && (
                        <div className="text-xs text-gray-600 pl-1">
                          +{dateEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(event => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-l-4"
                style={{ borderLeftColor: event.color === 'blue' ? '#3b82f6' : event.color === 'green' ? '#10b981' : event.color === 'purple' ? '#8b5cf6' : event.color === 'orange' ? '#f97316' : '#ec4899' }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{event.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colorClasses[event.color as keyof typeof colorClasses]}`}>
                        {event.type}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time} ({event.duration} min)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {event.location === 'Virtual' ? (
                          <>
                            <Video className="w-4 h-4" />
                            <span>Virtual Meeting</span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {event.description && (
                      <p className="mt-2 text-sm text-gray-600">{event.description}</p>
                    )}
                  </div>
                  {event.meetingLink && (
                    <button className="ml-4 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium flex items-center space-x-2">
                      <Video className="w-4 h-4" />
                      <span>Join</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Events Summary */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming This Week</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.filter(e => {
              const eventDate = new Date(e.date);
              const weekFromNow = new Date();
              weekFromNow.setDate(weekFromNow.getDate() + 7);
              return eventDate >= new Date() && eventDate <= weekFromNow;
            }).slice(0, 3).map(event => (
              <div key={event.id} className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-900 transition-all">
                <div className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${colorClasses[event.color as keyof typeof colorClasses]}`}>
                  {event.type}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{event.title}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
