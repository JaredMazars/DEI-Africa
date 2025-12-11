import { useState, useEffect } from 'react';
import { Search, Filter, Star, MapPin, Briefcase, Clock, CheckCircle, TrendingUp, Heart } from 'lucide-react';
import { mockAPI } from '../services/mockData';

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  expertise: string[];
  bio: string;
  availability: string;
  languages: string[];
  rating: number;
  totalMentees: number;
  image: string;
  verified: boolean;
}

export default function MentorDiscovery() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [loading, setLoading] = useState(true);
  const [savedMentors, setSavedMentors] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadMentors();
  }, []);

  useEffect(() => {
    filterMentors();
  }, [searchQuery, selectedExpertise, selectedLocation, mentors]);

  const loadMentors = async () => {
    try {
      const response = await mockAPI.getMentors();
      setMentors(response.data);
      setFilteredMentors(response.data);
    } catch (error) {
      console.error('Failed to load mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMentors = () => {
    let filtered = mentors;

    if (searchQuery) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mentor.expertise.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedExpertise !== 'all') {
      filtered = filtered.filter(mentor =>
        mentor.expertise.includes(selectedExpertise)
      );
    }

    if (selectedLocation !== 'all') {
      filtered = filtered.filter(mentor =>
        mentor.location.includes(selectedLocation)
      );
    }

    setFilteredMentors(filtered);
  };

  const toggleSaveMentor = (mentorId: string) => {
    setSavedMentors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(mentorId)) {
        newSet.delete(mentorId);
      } else {
        newSet.add(mentorId);
      }
      return newSet;
    });
  };

  const calculateMatchScore = () => {
    const baseScore = 70 + Math.random() * 25;
    return Math.round(baseScore);
  };

  const expertiseOptions = ['all', 'Audit & Assurance', 'Consulting', 'Financial Advisory', 'Tax', 'Sustainability', 'Legal Services', 'Technology & Digital', 'Risk Consulting', 'Private Client Services'];
  const locationOptions = ['all', 'London', 'Paris', 'Frankfurt', 'Madrid', 'Brussels', 'Singapore', 'New York'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header with Forvis Mazars Branding */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-[1920px] mx-auto px-12 sm:px-16 lg:px-20 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3 text-white">Professional Mentorship Network</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Connect with experienced professionals from Forvis Mazars. 
              Find mentors who align with your career goals and professional development needs.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-12 sm:px-16 lg:px-20 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, role, or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedExpertise}
                  onChange={(e) => setSelectedExpertise(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent appearance-none bg-white transition-all"
                >
                  {expertiseOptions.map(option => (
                    <option key={option} value={option}>
                      {option === 'all' ? 'All Expertise' : option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="md:col-span-3">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent appearance-none bg-white transition-all"
                >
                  {locationOptions.map(option => (
                    <option key={option} value={option}>
                      {option === 'all' ? 'All Locations' : option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {(searchQuery || selectedExpertise !== 'all' || selectedLocation !== 'all') && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchQuery && (
                <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-lg text-sm font-medium">
                  Search: {searchQuery}
                </span>
              )}
              {selectedExpertise !== 'all' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-lg text-sm font-medium">
                  {selectedExpertise}
                </span>
              )}
              {selectedLocation !== 'all' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-lg text-sm font-medium">
                  {selectedLocation}
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedExpertise('all');
                  setSelectedLocation('all');
                }}
                className="text-sm text-blue-900 hover:text-blue-800 font-medium"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredMentors.length}</span> mentors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => {
            const matchScore = calculateMatchScore();
            const isSaved = savedMentors.has(mentor.id);

            return (
              <div
                key={mentor.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 group hover:scale-[1.02]"
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-900 to-blue-800">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold text-gray-900">{matchScore}% Match</span>
                  </div>
                  <button
                    onClick={() => toggleSaveMentor(mentor.id)}
                    className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all"
                  >
                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                  </button>
                  {mentor.verified && (
                    <div className="absolute bottom-4 left-4 bg-green-500 text-white rounded-full px-3 py-1 flex items-center space-x-1 text-xs font-medium">
                      <CheckCircle className="w-4 h-4" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-900 transition-colors">
                      {mentor.name}
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center space-x-1">
                      <Briefcase className="w-4 h-4" />
                      <span>{mentor.role}</span>
                    </p>
                    <p className="text-sm text-blue-900 font-medium">{mentor.company}</p>
                  </div>

                  <div className="flex items-center space-x-1 text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{mentor.location}</span>
                  </div>

                  <div className="flex items-center space-x-4 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-900">{mentor.rating}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {mentor.totalMentees} mentees
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Expertise</p>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.slice(0, 3).map((exp, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-50 text-blue-900 rounded-lg text-xs font-medium border border-blue-200"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm mb-4">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="text-gray-600">Available: <span className="font-medium text-green-600">{mentor.availability}</span></span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {mentor.bio}
                  </p>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-900 hover:bg-blue-800 text-white py-2.5 rounded-lg font-semibold transition-all shadow-sm">
                      Connect
                    </button>
                    <button className="px-4 py-2.5 border-2 border-blue-900 text-blue-900 hover:bg-blue-50 rounded-lg font-semibold transition-all">
                      View
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No mentors found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedExpertise('all');
                setSelectedLocation('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}