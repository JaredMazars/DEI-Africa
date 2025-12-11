import React, { useState, useEffect } from 'react';
import { Heart, Star, MapPin, Users, Award, Clock, MessageCircle, Calendar, ChevronRight, Filter, Search, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { connectionsAPI, adminAPI } from '../services/api';

interface Mentor {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  expertise: string[];
  experience: string;
  bio: string;
  hourlyRate: number;
  department: string;
  languages: string[];
  availability: 'available' | 'busy' | 'limited';
  responseTime: string;
  totalSessions: number;
  specializations: string[];
  matchScore?: number;
}

const MentorMatching: React.FC = () => {
  const { user } = useAuth();
  const [likedMentors, setLikedMentors] = useState<string[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allMentors, setAllMentors] = useState<Mentor[]>([]);

  // Load mentors from API
  useEffect(() => {
    const loadMentors = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getMentors();
        
        // Transform backend data to frontend format
        const transformedMentors = response.data.mentors.map((mentor: any) => ({
          id: mentor.user_id,
          name: mentor.name,
          title: mentor.experience || 'Professional',
          company: 'Forvis Mazars',
          location: mentor.location,
          avatar: mentor.profile_image_url || 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
          rating: 4.8, // Default rating
          reviewCount: 25, // Default review count
          expertise: mentor.expertise_list ? mentor.expertise_list.split(', ') : [],
          experience: mentor.experience,
          bio: mentor.bio || 'Experienced professional ready to mentor.',
          hourlyRate: 1000, // Default rate
          department: 'general',
          languages: mentor.languages_list ? mentor.languages_list.split(', ') : ['English'],
          availability: 'available',
          responseTime: '< 4 hours',
          totalSessions: 50, // Default
          specializations: mentor.expertise_list ? mentor.expertise_list.split(', ').slice(0, 3) : [],
          matchScore: Math.floor(Math.random() * 20) + 80 // Random match score 80-100
        }));

        setAllMentors(transformedMentors);
      } catch (error) {
        console.error('Error loading mentors:', error);
        // Keep empty array as fallback
      } finally {
        setLoading(false);
      }
    };

    loadMentors();
  }, []);

  // Filter mentors based on user preferences and search
  const getFilteredMentors = () => {
    let filtered = allMentors;

    // Filter by user's interests/expertise preferences if available
    const userInterests = user?.profile?.interests || [];
    if (userInterests.length > 0) {
      filtered = filtered.filter(mentor => 
        mentor.expertise.some(exp => 
          userInterests.some(interest => 
            exp.toLowerCase().includes(interest.toLowerCase()) ||
            interest.toLowerCase().includes(exp.toLowerCase())
          )
        )
      );
    }

    // Filter by user's location preference if available
    const userLocation = user?.profile?.location;
    if (userLocation && selectedLocation === '') {
      // If no specific location filter is set, prefer mentors from same region
      const userCountry = userLocation.split(',')[1]?.trim();
      if (userCountry) {
        const sameRegionMentors = filtered.filter(mentor => 
          mentor.location.includes(userCountry)
        );
        const otherMentors = filtered.filter(mentor => 
          !mentor.location.includes(userCountry)
        );
        filtered = [...sameRegionMentors, ...otherMentors];
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by selected expertise
    if (selectedExpertise.length > 0) {
      filtered = filtered.filter(mentor =>
        mentor.expertise.some(exp => selectedExpertise.includes(exp))
      );
    }

    // Filter by location
    if (selectedLocation) {
      filtered = filtered.filter(mentor =>
        mentor.location.toLowerCase().includes(selectedLocation.toLowerCase())
      );
    }

    // Sort by match score
    return filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  };

  const filteredMentors = getFilteredMentors();

  const handleLike = (mentorId: string) => {
    if (likedMentors.includes(mentorId)) {
      setLikedMentors(likedMentors.filter(id => id !== mentorId));
    } else {
      setLikedMentors([...likedMentors, mentorId]);
    }
  };

  const handleViewProfile = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowMentorModal(true);
  };

  const handleConnect = async (mentorId: string) => {
    try {
      if (user?.profile?.role === 'mentee') {
        await connectionsAPI.createConnection(mentorId, user.id);
        alert('Connection request sent successfully!');
      } else {
        await connectionsAPI.createConnection(user?.id || '', mentorId);
        alert('Connection request sent successfully!');
      }
    } catch (error) {
      console.error('Error creating connection:', error);
      alert('Failed to send connection request. Please try again.');
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-yellow-100 text-yellow-800';
      case 'busy': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'available': return 'Available';
      case 'limited': return 'Limited';
      case 'busy': return 'Busy';
      default: return 'Unknown';
    }
  };

  const allExpertiseAreas = Array.from(new Set(allMentors.flatMap(m => m.expertise)));
  const allLocations = Array.from(new Set(allMentors.map(m => m.location.split(',')[1]?.trim()).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.profile?.role === 'mentee' ? 'Find Your Mentor' : 'Connect with Mentees'}
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.profile?.role === 'mentee' 
                  ? 'Discover experienced professionals matched to your interests'
                  : 'Share your expertise with aspiring professionals'
                }
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search mentors by name, title, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {showFilters && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expertise Areas</label>
                    <div className="flex flex-wrap gap-2">
                      {allExpertiseAreas.slice(0, 8).map((expertise) => (
                        <button
                          key={expertise}
                          onClick={() => {
                            if (selectedExpertise.includes(expertise)) {
                              setSelectedExpertise(selectedExpertise.filter(e => e !== expertise));
                            } else {
                              setSelectedExpertise([...selectedExpertise, expertise]);
                            }
                          }}
                          className={`px-3 py-1 text-sm rounded-full transition-colors ${
                            selectedExpertise.includes(expertise)
                              ? 'bg-blue-600 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {expertise}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Locations</option>
                      {allLocations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading mentors...</p>
          </div>
        )}
        
        <div className="mb-6 flex items-center justify-between">
          <div className="text-lg font-medium text-gray-900">
            {filteredMentors.length} mentor{filteredMentors.length !== 1 ? 's' : ''} found
            {userInterests.length > 0 && (
              <span className="text-blue-600 ml-2">
                (matched to your interests: {userInterests.join(', ')})
              </span>
            )}
            <div className="text-sm text-gray-500 mt-1">
              <Link to="/preferences" className="text-blue-600 hover:text-blue-700 font-medium">
                Update your preferences →
              </Link>
            </div>
          </div>
          {likedMentors.length > 0 && (
            <div className="text-sm text-blue-600 font-medium">
              {likedMentors.length} mentor{likedMentors.length !== 1 ? 's' : ''} liked
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <div key={mentor.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 overflow-hidden">
              <div className="p-6">
                {/* Match Score Badge */}
                {mentor.matchScore && (
                  <div className="flex justify-end mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      {mentor.matchScore}% Match
                    </span>
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{mentor.name}</h3>
                      <p className="text-blue-600 font-medium text-sm">{mentor.title}</p>
                      <p className="text-gray-600 text-xs">{mentor.company}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLike(mentor.id)}
                    className={`p-2 transition-colors ${
                      likedMentors.includes(mentor.id)
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedMentors.includes(mentor.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-medium">{mentor.rating}</span>
                    <span>({mentor.reviewCount})</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{mentor.location.split(',')[0]}</span>
                  </div>
                </div>

                {/* Availability and Rate */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getAvailabilityColor(mentor.availability)}`}>
                    {getAvailabilityText(mentor.availability)}
                  </span>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">R{mentor.hourlyRate}</div>
                    <div className="text-xs text-gray-600">/hour</div>
                  </div>
                </div>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {mentor.expertise.slice(0, 2).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {mentor.expertise.length > 2 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{mentor.expertise.length - 2} more
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button 
                    onClick={() => handleViewProfile(mentor)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl text-sm font-medium transition-colors"
                  >
                    View Profile
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                    <button 
                      onClick={() => handleConnect(mentor.id)}
                      className="border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Connect</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mentors found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Liked Mentors Summary */}
      {likedMentors.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500 fill-current" />
              <span className="font-medium text-gray-900">
                {likedMentors.length} mentor{likedMentors.length !== 1 ? 's' : ''} liked
              </span>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1">
              <span>View Liked Mentors</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Mentor Profile Modal */}
      {showMentorModal && selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <img
                    src={selectedMentor.avatar}
                    alt={selectedMentor.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedMentor.name}</h2>
                    <p className="text-xl text-blue-600 font-medium">{selectedMentor.title}</p>
                    <p className="text-gray-600">{selectedMentor.company}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedMentor.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4" />
                        <span>{selectedMentor.experience}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowMentorModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  ×
                </button>
              </div>

              {selectedMentor.matchScore && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-800 font-medium">Match Score</span>
                    <span className="text-2xl font-bold text-blue-600">{selectedMentor.matchScore}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${selectedMentor.matchScore}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{selectedMentor.rating}</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{selectedMentor.totalSessions}</div>
                  <div className="text-sm text-gray-600">Sessions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">R{selectedMentor.hourlyRate}</div>
                  <div className="text-sm text-gray-600">Per Hour</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">{selectedMentor.bio}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedMentor.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specializations</h3>
                <div className="text-gray-700">
                  {selectedMentor.specializations.join(' • ')}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages</h3>
                <div className="text-gray-700">
                  {selectedMentor.languages.join(', ')}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowMentorModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-xl text-sm font-medium transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl text-sm font-medium transition-colors">
                  Connect & Book Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorMatching;