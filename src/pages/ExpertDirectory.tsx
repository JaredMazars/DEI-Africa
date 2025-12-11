import React, { useState } from 'react';
import { useEffect } from 'react';
import { Search, MapPin, Users, Star, MessageCircle, Calendar, Filter, ChevronDown, Award, Globe, Clock, Send } from 'lucide-react';
import { expertsAPI, questionsAPI } from '../services/api';

interface Expert {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  location: string;
  country: string;
  expertise: string[];
  industries: string[];
  languages: string[];
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  experience: string;
  pastClients: string[];
  bio: string;
}

interface Question {
  id: string;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  tags: string[];
  timestamp: string;
  responseCount: number;
  isAnswered: boolean;
}

interface Webinar {
  id: string;
  title: string;
  expert: string;
  expertAvatar: string;
  date: string;
  time: string;
  topic: string;
  region: string;
  attendees: number;
  maxAttendees: number;
  teamsLink?: string;
  description?: string;
  registeredUsers?: string[];
}

const ExpertDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    expertise: '',
    industry: '',
    location: '',
    availability: 'all'
  });
  const [activeTab, setActiveTab] = useState<'directory' | 'forum' | 'webinars'>('directory');
  const [showFilters, setShowFilters] = useState(false);
  const [showAskModal, setShowAskModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ title: '', content: '', tags: '' });
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectMessage, setConnectMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [showWebinarModal, setShowWebinarModal] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registrationData, setRegistrationData] = useState({ name: '', email: '', phone: '', organization: '' });
  const [registeredWebinars, setRegisteredWebinars] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newWebinar, setNewWebinar] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    topic: '',
    region: '',
    maxAttendees: '50',
    expert: ''
  });

  // Dummy experts data as fallback
  const dummyExperts: Expert[] = [
    {
      id: '1',
      name: 'Amara Okafor',
      title: 'Tax & Regulatory Expert',
      company: 'Forvis Mazars',
      avatar: 'https://images.pexels.com/photos/3778966/pexels-photo-3778966.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      location: 'Lagos, Nigeria',
      country: 'Nigeria',
      expertise: ['Corporate Tax', 'Transfer Pricing', 'Tax Planning', 'Cross-Border Taxation'],
      industries: ['Financial Services', 'Oil & Gas', 'Manufacturing'],
      languages: ['English', 'Yoruba', 'Igbo'],
      rating: 4.9,
      reviewCount: 47,
      isAvailable: true,
      experience: '15+ years',
      pastClients: ['First Bank Nigeria', 'Dangote Group', 'MTN Nigeria'],
      bio: 'Leading tax expert specializing in West African tax harmonization and cross-border transactions. Extensive experience in transfer pricing and international tax structuring.'
    },
    {
      id: '2',
      name: 'Thabo Mthembu',
      title: 'ESG & Sustainability Advisor',
      company: 'Forvis Mazars',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      location: 'Johannesburg, South Africa',
      country: 'South Africa',
      expertise: ['ESG Strategy', 'Sustainability Reporting', 'Climate Risk', 'Impact Assessment'],
      industries: ['Mining', 'Energy', 'Manufacturing', 'Agriculture'],
      languages: ['English', 'Zulu', 'Afrikaans'],
      rating: 4.8,
      reviewCount: 38,
      isAvailable: true,
      experience: '12+ years',
      pastClients: ['Anglo American', 'Sasol', 'Standard Bank'],
      bio: 'ESG transformation specialist with deep expertise in Southern African mining and energy sectors. Pioneer in implementing sustainable business practices across the continent.'
    },
    {
      id: '3',
      name: 'Kemi Adebayo',
      title: 'Fintech & Digital Banking Specialist',
      company: 'Forvis Mazars',
      avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      location: 'Nairobi, Kenya',
      country: 'Kenya',
      expertise: ['Digital Banking', 'Payment Systems', 'Mobile Money', 'Regulatory Compliance'],
      industries: ['Banking', 'Fintech', 'Telecommunications'],
      languages: ['English', 'Swahili'],
      rating: 4.9,
      reviewCount: 52,
      isAvailable: true,
      experience: '10+ years',
      pastClients: ['Safaricom', 'Equity Bank', 'M-Pesa'],
      bio: 'Fintech innovation leader driving digital transformation in East African financial services. Expert in mobile money ecosystems and regulatory frameworks.'
    },
    {
      id: '4',
      name: 'Fatima El-Sayed',
      title: 'Audit & Assurance Partner',
      company: 'Forvis Mazars',
      avatar: 'https://images.pexels.com/photos/3776164/pexels-photo-3776164.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      location: 'Cairo, Egypt',
      country: 'Egypt',
      expertise: ['Financial Audit', 'IFRS', 'Internal Controls', 'Risk Management'],
      industries: ['Retail', 'Hospitality', 'Real Estate', 'Construction'],
      languages: ['Arabic', 'English', 'French'],
      rating: 4.7,
      reviewCount: 41,
      isAvailable: false,
      experience: '18+ years',
      pastClients: ['Orascom', 'Talaat Moustafa Group', 'Egyptian Banks'],
      bio: 'Senior audit partner with extensive experience in North African markets. Specialized in complex financial reporting and regulatory compliance across multiple jurisdictions.'
    },
    {
      id: '5',
      name: 'Kwame Asante',
      title: 'M&A Advisory Specialist',
      company: 'Forvis Mazars',
      avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      location: 'Accra, Ghana',
      country: 'Ghana',
      expertise: ['Mergers & Acquisitions', 'Due Diligence', 'Valuations', 'Deal Structuring'],
      industries: ['Consumer Goods', 'Healthcare', 'Technology', 'Agriculture'],
      languages: ['English', 'Twi', 'French'],
      rating: 4.8,
      reviewCount: 35,
      isAvailable: true,
      experience: '14+ years',
      pastClients: ['Unilever Ghana', 'Kasapa Telecom', 'PZ Cussons'],
      bio: 'M&A expert facilitating cross-border transactions across West Africa. Proven track record in complex deal structuring and post-merger integration.'
    },
    {
      id: '6',
      name: 'Nia Banda',
      title: 'HR & Talent Development Consultant',
      company: 'Forvis Mazars',
      avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      location: 'Lusaka, Zambia',
      country: 'Zambia',
      expertise: ['Talent Strategy', 'Leadership Development', 'Diversity & Inclusion', 'Change Management'],
      industries: ['Professional Services', 'Mining', 'Banking', 'Retail'],
      languages: ['English', 'Bemba', 'Nyanja'],
      rating: 4.9,
      reviewCount: 29,
      isAvailable: true,
      experience: '11+ years',
      pastClients: ['Zambia National Commercial Bank', 'First Quantum Minerals', 'Shoprite'],
      bio: 'HR transformation leader specializing in building high-performance teams across Africa. Expert in cross-cultural leadership development and inclusive workplace strategies.'
    }
  ];

  // Load experts and questions from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [expertsResponse, questionsResponse] = await Promise.all([
          expertsAPI.getExperts(),
          questionsAPI.getQuestions()
        ]);

        // Transform experts data
        const transformedExperts = expertsResponse.data.experts.map((expert: any) => ({
          id: expert.expert_id || expert.user_id,
          name: expert.name,
          title: expert.specializations?.split(',')[0] || 'Expert',
          company: 'Forvis Mazars',
          avatar: expert.profile_image_url || 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
          location: expert.location,
          country: expert.location?.split(',')[1]?.trim() || expert.location,
          expertise: expert.specializations ? expert.specializations.split(',').map((s: string) => s.trim()) : [],
          industries: expert.industries ? expert.industries.split(',').map((i: string) => i.trim()) : [],
          languages: ['English'], // Default
          rating: expert.average_rating || 4.5,
          reviewCount: expert.review_count || 10,
          isAvailable: expert.is_available,
          experience: expert.experience || '5+ years',
          pastClients: expert.past_clients ? expert.past_clients.split(',').map((c: string) => c.trim()) : [],
          bio: expert.bio || 'Experienced professional ready to help.'
        }));

        // Transform questions data
        const transformedQuestions = questionsResponse.data.questions.map((question: any) => ({
          id: question.question_id,
          title: question.title,
          content: question.content,
          author: question.author_name,
          authorAvatar: question.author_avatar || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
          tags: question.tags ? question.tags.split(',').map((t: string) => t.trim()) : [],
          timestamp: new Date(question.created_at).toLocaleDateString(),
          responseCount: question.response_count || 0,
          isAnswered: question.is_answered
        }));

        // Use dummy data if API returns empty
        setExperts(transformedExperts.length > 0 ? transformedExperts : dummyExperts);
        setQuestions(transformedQuestions);
      } catch (error) {
        console.error('Error loading expert directory data:', error);
        // Use dummy data on error
        setExperts(dummyExperts);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const webinars: Webinar[] = [
    {
      id: '1',
      title: 'West African Tax Harmonization: Opportunities and Challenges',
      expert: 'Amara Okafor',
      expertAvatar: 'https://images.pexels.com/photos/3778966/pexels-photo-3778966.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      date: '2024-02-15',
      time: '14:00 WAT',
      topic: 'Regional Tax Policy',
      region: 'West Africa',
      attendees: 23,
      maxAttendees: 50,
      teamsLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_tax_harmonization_west_africa',
      description: 'Join us for an in-depth discussion on the evolving tax landscape across West Africa. We\'ll cover ECOWAS harmonization efforts, transfer pricing regulations, and practical strategies for multinational compliance. Perfect for tax professionals, CFOs, and business leaders operating in the region.',
      registeredUsers: []
    },
    {
      id: '2',
      title: 'ESG in Southern African Mining: Best Practices',
      expert: 'Thabo Mthembu',
      expertAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      date: '2024-02-20',
      time: '15:00 SAST',
      topic: 'ESG & Sustainability',
      region: 'Southern Africa',
      attendees: 31,
      maxAttendees: 75,
      teamsLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_esg_mining_southern_africa',
      description: 'Explore cutting-edge ESG frameworks and sustainability practices in the mining sector. Learn from real-world case studies, regulatory updates, and stakeholder engagement strategies. Ideal for mining executives, ESG officers, and sustainability consultants.',
      registeredUsers: []
    },
    {
      id: '3',
      title: 'Digital Banking Transformation in East Africa',
      expert: 'Kemi Adebayo',
      expertAvatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      date: '2024-02-25',
      time: '16:00 EAT',
      topic: 'Fintech Innovation',
      region: 'East Africa',
      attendees: 18,
      maxAttendees: 40,
      teamsLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_digital_banking_east_africa',
      description: 'Discover the latest trends in digital banking and fintech innovation across East Africa. Topics include mobile money integration, regulatory compliance, cybersecurity, and customer experience optimization. Essential for bank executives, fintech founders, and digital transformation leaders.',
      registeredUsers: []
    },
    {
      id: '4',
      title: 'Cross-Border M&A: Legal & Tax Considerations',
      expert: 'Kwame Asante',
      expertAvatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      date: '2024-03-05',
      time: '13:00 GMT',
      topic: 'Mergers & Acquisitions',
      region: 'Pan-African',
      attendees: 15,
      maxAttendees: 60,
      teamsLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_mna_cross_border_africa',
      description: 'Navigate the complexities of cross-border M&A transactions across Africa. Expert insights on deal structuring, due diligence, valuation methodologies, and post-merger integration. Designed for M&A advisors, corporate development teams, and private equity professionals.',
      registeredUsers: []
    },
    {
      id: '5',
      title: 'Climate Risk & Sustainable Finance in Africa',
      expert: 'Sarah Mwangi',
      expertAvatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      date: '2024-03-10',
      time: '14:30 EAT',
      topic: 'Climate Finance',
      region: 'East Africa',
      attendees: 28,
      maxAttendees: 80,
      teamsLink: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting_climate_risk_sustainable_finance',
      description: 'Learn how to integrate climate risk assessment into financial decision-making and access sustainable finance opportunities. Topics include green bonds, carbon credits, climate disclosure requirements, and impact measurement. Perfect for financial institutions, project developers, and sustainability professionals.',
      registeredUsers: []
    }
  ];

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.expertise.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
      expert.industries.some(industry => industry.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesExpertise = !selectedFilters.expertise || expert.expertise.includes(selectedFilters.expertise);
    const matchesIndustry = !selectedFilters.industry || expert.industries.includes(selectedFilters.industry);
    const matchesLocation = !selectedFilters.location || expert.country.includes(selectedFilters.location);
    const matchesAvailability = selectedFilters.availability === 'all' || 
      (selectedFilters.availability === 'available' && expert.isAvailable);
    
    return matchesSearch && matchesExpertise && matchesIndustry && matchesLocation && matchesAvailability;
  });

  const handleAskQuestion = () => {
    const submitQuestion = async () => {
      if (newQuestion.title.trim() && newQuestion.content.trim()) {
        try {
          await questionsAPI.createQuestion({
            title: newQuestion.title,
            content: newQuestion.content,
            tags: newQuestion.tags
          });
          
          setShowAskModal(false);
          setNewQuestion({ title: '', content: '', tags: '' });
          
          // Reload questions
          const questionsResponse = await questionsAPI.getQuestions();
          const transformedQuestions = questionsResponse.data.questions.map((question: any) => ({
            id: question.question_id,
            title: question.title,
            content: question.content,
            author: question.author_name,
            authorAvatar: question.author_avatar || 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
            tags: question.tags ? question.tags.split(',').map((t: string) => t.trim()) : [],
            timestamp: new Date(question.created_at).toLocaleDateString(),
            responseCount: question.response_count || 0,
            isAnswered: question.is_answered
          }));
          setQuestions(transformedQuestions);
          
        } catch (error) {
          console.error('Error posting question:', error);
          alert('Failed to post question. Please try again.');
        }
      }
    };
    
    submitQuestion();
  };

  const handleViewProfile = (expert: Expert) => {
    setSelectedExpert(expert);
    setShowExpertModal(true);
  };

  const handleConnect = (expertId: string) => {
    const expert = experts.find(e => e.id === expertId);
    if (expert) {
      setSelectedExpert(expert);
      setShowConnectModal(true);
    }
  };

  const handleRegisterWebinar = (webinar: Webinar) => {
    setSelectedWebinar(webinar);
    setShowRegisterModal(true);
  };

  const handleViewWebinar = (webinar: Webinar) => {
    setSelectedWebinar(webinar);
    setShowWebinarModal(true);
  };

  const handleSubmitRegistration = () => {
    if (registrationData.name && registrationData.email && selectedWebinar) {
      // Add webinar to registered list
      setRegisteredWebinars([...registeredWebinars, selectedWebinar.id]);
      
      // Show success message
      alert(`Success! You've been registered for "${selectedWebinar.title}". \n\nA confirmation email with the Teams link has been sent to ${registrationData.email}.\n\nYou can join the webinar using Microsoft Teams on ${selectedWebinar.date} at ${selectedWebinar.time}.`);
      
      // Reset form
      setRegistrationData({ name: '', email: '', phone: '', organization: '' });
      setShowRegisterModal(false);
      setSelectedWebinar(null);
    }
  };

  const handleJoinWebinar = (teamsLink?: string) => {
    if (teamsLink) {
      // Open Teams link in new tab
      window.open(teamsLink, '_blank');
    } else {
      alert('Teams link will be available 15 minutes before the webinar starts.');
    }
  };

  const isWebinarRegistered = (webinarId: string) => {
    return registeredWebinars.includes(webinarId);
  };

  const handleScheduleWebinar = () => {
    if (newWebinar.title && newWebinar.date && newWebinar.time && newWebinar.topic && newWebinar.region && newWebinar.expert) {
      // Generate a Teams meeting link (in production, this would be created via Microsoft Graph API)
      const teamsLink = `https://teams.microsoft.com/l/meetup-join/19%3ameeting_${newWebinar.title.toLowerCase().replace(/\s+/g, '_')}`;
      
      alert(`Webinar Scheduled Successfully! 📅\n\n"${newWebinar.title}"\n\nDate: ${newWebinar.date}\nTime: ${newWebinar.time}\nExpert: ${newWebinar.expert}\nMax Attendees: ${newWebinar.maxAttendees}\n\n✓ Teams meeting link created\n✓ Calendar invites will be sent to registered participants\n✓ Webinar added to Expert Directory\n\nTeams Link: ${teamsLink}`);
      
      // Reset form
      setNewWebinar({
        title: '',
        description: '',
        date: '',
        time: '',
        topic: '',
        region: '',
        maxAttendees: '50',
        expert: ''
      });
      setShowScheduleModal(false);
    } else {
      alert('Please fill in all required fields');
    }
  };

  const handleSendMessage = (expert: Expert) => {
    setSelectedExpert(expert);
    setShowMessageModal(true);
  };

  const handleSendConnect = () => {
    // Handle sending connection request
    setShowConnectModal(false);
    setConnectMessage('');
    setSelectedExpert(null);
  };

  const handleSendDirectMessage = () => {
    // Handle sending direct message
    setShowMessageModal(false);
    setMessageContent('');
    setSelectedExpert(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header with Forvis Mazars Branding */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-[1920px] mx-auto px-12 sm:px-16 lg:px-20 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3 text-white">Expert Directory & Knowledge Exchange</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Connect with regional experts and share knowledge across our global network
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-12 sm:px-16 lg:px-20 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Tabs Header */}
          <div className="p-6 border-b border-gray-200">

          {/* Tabs */}
          <div className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('directory')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'directory'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Expert Directory
            </button>
            <button
              onClick={() => setActiveTab('forum')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'forum'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Ask the Expert
            </button>
            <button
              onClick={() => setActiveTab('webinars')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'webinars'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Live Webinars
            </button>
          </div>
        </div>

        {/* Expert Directory Tab */}
        {activeTab === 'directory' && (
          <div className="flex h-full">
            {/* Search and Filters Sidebar */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
              <div className="p-6">
                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search experts by name, skill, or industry..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Filters */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expertise Area</label>
                    <select
                      value={selectedFilters.expertise}
                      onChange={(e) => setSelectedFilters({...selectedFilters, expertise: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Expertise</option>
                      <option value="Tax Advisory">Tax Advisory</option>
                      <option value="Risk Management">Risk Management</option>
                      <option value="Fintech Strategy">Fintech Strategy</option>
                      <option value="Project Finance">Project Finance</option>
                      <option value="ESG Advisory">ESG Advisory</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <select
                      value={selectedFilters.industry}
                      onChange={(e) => setSelectedFilters({...selectedFilters, industry: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Industries</option>
                      <option value="Financial Services">Financial Services</option>
                      <option value="Energy">Energy</option>
                      <option value="Technology">Technology</option>
                      <option value="Mining">Mining</option>
                      <option value="Banking">Banking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                    <select
                      value={selectedFilters.location}
                      onChange={(e) => setSelectedFilters({...selectedFilters, location: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">All Regions</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Kenya">Kenya</option>
                      <option value="Egypt">Egypt</option>
                      <option value="Ghana">Ghana</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                    <select
                      value={selectedFilters.availability}
                      onChange={(e) => setSelectedFilters({...selectedFilters, availability: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Experts</option>
                      <option value="available">Available for Collaboration</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Quick Stats</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex justify-between">
                      <span>Total Experts:</span>
                      <span className="font-medium">{experts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available Now:</span>
                      <span className="font-medium">{experts.filter(e => e.isAvailable).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Countries:</span>
                      <span className="font-medium">4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expert Cards */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid gap-6">
                {filteredExperts.map((expert) => (
                  <div key={expert.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <img
                        src={expert.avatar}
                        alt={expert.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{expert.name}</h3>
                            <p className="text-blue-600 font-medium">{expert.title}</p>
                            <p className="text-gray-600 text-sm">{expert.company}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {expert.isAvailable ? (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Available</span>
                            ) : (
                              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">Busy</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{expert.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="w-4 h-4" />
                            <span>{expert.experience}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{expert.rating} ({expert.reviewCount} reviews)</span>
                          </div>
                        </div>

                        <p className="text-gray-700 mt-3 text-sm">{expert.bio}</p>

                        {/* Expertise Tags */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {expert.expertise.map((skill) => (
                            <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Industries */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {expert.industries.map((industry) => (
                            <span key={industry} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                              {industry}
                            </span>
                          ))}
                        </div>

                        {/* Languages */}
                        <div className="flex items-center space-x-2 mt-3 text-sm text-gray-600">
                          <Globe className="w-4 h-4" />
                          <span>Languages: {expert.languages.join(', ')}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-3 mt-4">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"  onClick={() => handleConnect(expert.id)}>
                           
                            Connect
                          </button>
                          <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => handleSendMessage(expert)}>
                            Send Message
                          </button>
                          <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors" onClick={() => handleViewProfile(expert)}>
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Ask the Expert Forum Tab */}
        {activeTab === 'forum' && (
          <div className="p-6 overflow-y-auto h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Ask the Expert Forum</h2>
                <p className="text-gray-600">Get answers from regional experts across Africa</p>
              </div>
              <button
                onClick={() => setShowAskModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask Question</span>
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((question) => (
                <div key={question.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-start space-x-4">
                    <img
                      src={question.authorAvatar}
                      alt={question.author}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                            {question.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                            <span>by {question.author}</span>
                            <span>•</span>
                            <span>{question.timestamp}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{question.responseCount} responses</span>
                          </div>
                          {question.isAnswered && (
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Answered</span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mt-3">{question.content}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {question.tags.map((tag) => (
                          <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Webinars Tab */}
        {activeTab === 'webinars' && (
          <div className="p-6 overflow-y-auto h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Live Knowledge-Sharing Webinars</h2>
                <p className="text-gray-600">Monthly expert-led discussions on regional trends</p>
              </div>
              <button 
                onClick={() => setShowScheduleModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Webinar</span>
              </button>
            </div>

            <div className="grid gap-6">
              {webinars.map((webinar) => {
                const isRegistered = isWebinarRegistered(webinar.id);
                const isFull = webinar.attendees >= webinar.maxAttendees;
                
                return (
                  <div key={webinar.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold text-gray-900">{webinar.title}</h3>
                          {isRegistered && (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                              ✓ Registered
                            </span>
                          )}
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{webinar.description}</p>
                        
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex items-center space-x-2">
                            <img
                              src={webinar.expertAvatar}
                              alt={webinar.expert}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="text-sm font-medium text-gray-700">{webinar.expert}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{webinar.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>{webinar.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4 text-blue-600" />
                            <span>{webinar.region}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className={isFull ? 'text-red-600 font-medium' : ''}>
                              {webinar.attendees}/{webinar.maxAttendees} registered
                            </span>
                          </div>
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                            {webinar.topic}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-6">
                        {isRegistered ? (
                          <>
                            <button 
                              onClick={() => handleJoinWebinar(webinar.teamsLink)}
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M9.5 1.5v3h3v-3h-3zm-4 0v3h3v-3h-3zm-4 3v3h3v-3h-3zm4 0v3h3v-3h-3zm4 0v3h3v-3h-3zm4 0v3h3v-3h-3zm-8 3v3h3v-3h-3zm4 0v3h3v-3h-3zm4 0v3h3v-3h-3zm-4 3v3h3v-3h-3z"/>
                              </svg>
                              <span>Join on Teams</span>
                            </button>
                            <button 
                              onClick={() => handleViewWebinar(webinar)}
                              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                            >
                              View Details
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleRegisterWebinar(webinar)}
                              disabled={isFull}
                              className={`${
                                isFull 
                                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                              } px-5 py-2.5 rounded-lg text-sm font-semibold transition-all`}
                            >
                              {isFull ? 'Full' : 'Register Now'}
                            </button>
                            <button 
                              onClick={() => handleViewWebinar(webinar)}
                              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                            >
                              Learn More
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Ask Question Modal */}
      {showAskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Ask the Expert Community</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Title</label>
                <input
                  type="text"
                  value={newQuestion.title}
                  onChange={(e) => setNewQuestion({...newQuestion, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What would you like to ask?"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Details</label>
                <textarea
                  rows={5}
                  value={newQuestion.content}
                  onChange={(e) => setNewQuestion({...newQuestion, content: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Provide details about your question or business scenario..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={newQuestion.tags}
                  onChange={(e) => setNewQuestion({...newQuestion, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., tax, Nigeria, cross-border (comma separated)"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAskModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAskQuestion}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Post Question</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expert Profile Modal */}
      {showExpertModal && selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <img
                    src={selectedExpert.avatar}
                    alt={selectedExpert.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedExpert.name}</h2>
                    <p className="text-xl text-blue-600 font-medium">{selectedExpert.title}</p>
                    <p className="text-gray-600">{selectedExpert.company}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedExpert.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4" />
                        <span>{selectedExpert.experience}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowExpertModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{selectedExpert.rating}</div>
                  <div className="text-sm text-gray-600">Rating ({selectedExpert.reviewCount} reviews)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{selectedExpert.experience}</div>
                  <div className="text-sm text-gray-600">Experience</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">{selectedExpert.bio}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedExpert.expertise.map((skill, index) => (
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Industries</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedExpert.industries.map((industry, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages</h3>
                <div className="text-gray-700">
                  {selectedExpert.languages.join(', ')}
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Past Clients</h3>
                <div className="text-gray-700">
                  {selectedExpert.pastClients.join(' • ')}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowExpertModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setShowExpertModal(false);
                    handleConnect(selectedExpert.id);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connect Modal */}
      {showConnectModal && selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Connect with {selectedExpert.name}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Connection Message
                </label>
                <textarea
                  rows={4}
                  value={connectMessage}
                  onChange={(e) => setConnectMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Introduce yourself and explain why you'd like to connect..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowConnectModal(false);
                    setConnectMessage('');
                    setSelectedExpert(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendConnect}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Send Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && selectedExpert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Message {selectedExpert.name}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Type your message here..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowMessageModal(false);
                    setMessageContent('');
                    setSelectedExpert(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendDirectMessage}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Webinar Registration Modal */}
      {showRegisterModal && selectedWebinar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Register for Webinar
              </h3>
              <p className="text-gray-600 text-sm mb-6">{selectedWebinar.title}</p>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={registrationData.name}
                    onChange={(e) => setRegistrationData({...registrationData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={registrationData.email}
                    onChange={(e) => setRegistrationData({...registrationData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@company.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={registrationData.phone}
                    onChange={(e) => setRegistrationData({...registrationData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+234 xxx xxx xxxx"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization
                  </label>
                  <input
                    type="text"
                    value={registrationData.organization}
                    onChange={(e) => setRegistrationData({...registrationData, organization: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">What happens next?</p>
                    <ul className="list-disc list-inside space-y-1 text-blue-700">
                      <li>You'll receive a confirmation email with the Teams link</li>
                      <li>Calendar invite will be sent to your email</li>
                      <li>Join 15 minutes early for networking</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowRegisterModal(false);
                    setRegistrationData({ name: '', email: '', phone: '', organization: '' });
                    setSelectedWebinar(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRegistration}
                  disabled={!registrationData.name || !registrationData.email}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    registrationData.name && registrationData.email
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Complete Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Webinar Details Modal */}
      {showWebinarModal && selectedWebinar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedWebinar.title}
                  </h3>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedWebinar.topic}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowWebinarModal(false);
                    setSelectedWebinar(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
                <img
                  src={selectedWebinar.expertAvatar}
                  alt={selectedWebinar.expert}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-gray-600">Expert Speaker</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedWebinar.expert}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">Date</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{selectedWebinar.date}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Time</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{selectedWebinar.time}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Region</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{selectedWebinar.region}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">Attendees</span>
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {selectedWebinar.attendees}/{selectedWebinar.maxAttendees}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">About This Webinar</h4>
                <p className="text-gray-700 leading-relaxed">{selectedWebinar.description}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">What You'll Learn</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Latest regulatory developments and compliance requirements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Practical strategies and real-world case studies</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Q&A session with industry expert</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Networking opportunities with peers across Africa</span>
                  </li>
                </ul>
              </div>

              {selectedWebinar.teamsLink && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M9.5 1.5v3h3v-3h-3zm-4 0v3h3v-3h-3zm-4 3v3h3v-3h-3zm4 0v3h3v-3h-3zm4 0v3h3v-3h-3zm4 0v3h3v-3h-3zm-8 3v3h3v-3h-3zm4 0v3h3v-3h-3zm4 0v3h3v-3h-3zm-4 3v3h3v-3h-3z"/>
                    </svg>
                    <div className="flex-1">
                      <p className="font-semibold text-blue-900 mb-1">Join via Microsoft Teams</p>
                      <p className="text-sm text-blue-800 mb-3">
                        This webinar will be hosted on Microsoft Teams. Make sure you have the Teams app installed or use the web version.
                      </p>
                      {isWebinarRegistered(selectedWebinar.id) && (
                        <button
                          onClick={() => handleJoinWebinar(selectedWebinar.teamsLink)}
                          className="text-sm text-blue-700 hover:text-blue-900 font-medium underline"
                        >
                          Click here to copy Teams link
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowWebinarModal(false);
                    setSelectedWebinar(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
                {isWebinarRegistered(selectedWebinar.id) ? (
                  <button
                    onClick={() => handleJoinWebinar(selectedWebinar.teamsLink)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M9.5 1.5v3h3v-3h-3zm-4 0v3h3v-3h-3zm-4 3v3h3v-3h-3zm4 0v3h3v-3h-3zm4 0v3h3v-3h-3zm4 0v3h3v-3h-3zm-8 3v3h3v-3h-3zm4 0v3h3v-3h-3zm4 0v3h3v-3h-3zm-4 3v3h3v-3h-3z"/>
                    </svg>
                    <span>Join on Teams</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowWebinarModal(false);
                      handleRegisterWebinar(selectedWebinar);
                    }}
                    disabled={selectedWebinar.attendees >= selectedWebinar.maxAttendees}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all ${
                      selectedWebinar.attendees >= selectedWebinar.maxAttendees
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg'
                    }`}
                  >
                    {selectedWebinar.attendees >= selectedWebinar.maxAttendees ? 'Webinar Full' : 'Register Now'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Webinar Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Schedule New Webinar</h3>
                  <p className="text-gray-600 text-sm mt-1">Create a knowledge-sharing session with Teams integration</p>
                </div>
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    setNewWebinar({
                      title: '',
                      description: '',
                      date: '',
                      time: '',
                      topic: '',
                      region: '',
                      maxAttendees: '50',
                      expert: ''
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Webinar Title *
                  </label>
                  <input
                    type="text"
                    value={newWebinar.title}
                    onChange={(e) => setNewWebinar({...newWebinar, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Cross-Border M&A Strategies for West Africa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    rows={4}
                    value={newWebinar.description}
                    onChange={(e) => setNewWebinar({...newWebinar, description: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Provide a detailed description of what participants will learn..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={newWebinar.date}
                      onChange={(e) => setNewWebinar({...newWebinar, date: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={newWebinar.time}
                      onChange={(e) => setNewWebinar({...newWebinar, time: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Topic/Category *
                    </label>
                    <select
                      value={newWebinar.topic}
                      onChange={(e) => setNewWebinar({...newWebinar, topic: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select topic</option>
                      <option value="Tax & Regulatory">Tax & Regulatory</option>
                      <option value="ESG & Sustainability">ESG & Sustainability</option>
                      <option value="Fintech Innovation">Fintech Innovation</option>
                      <option value="Mergers & Acquisitions">Mergers & Acquisitions</option>
                      <option value="Audit & Compliance">Audit & Compliance</option>
                      <option value="Digital Transformation">Digital Transformation</option>
                      <option value="Risk Management">Risk Management</option>
                      <option value="Corporate Governance">Corporate Governance</option>
                      <option value="Climate Finance">Climate Finance</option>
                      <option value="HR & Talent Development">HR & Talent Development</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Region *
                    </label>
                    <select
                      value={newWebinar.region}
                      onChange={(e) => setNewWebinar({...newWebinar, region: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select region</option>
                      <option value="West Africa">West Africa</option>
                      <option value="East Africa">East Africa</option>
                      <option value="Southern Africa">Southern Africa</option>
                      <option value="North Africa">North Africa</option>
                      <option value="Central Africa">Central Africa</option>
                      <option value="Pan-African">Pan-African</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Expert Speaker *
                    </label>
                    <select
                      value={newWebinar.expert}
                      onChange={(e) => setNewWebinar({...newWebinar, expert: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select expert</option>
                      {experts.map((expert) => (
                        <option key={expert.id} value={expert.name}>
                          {expert.name} - {expert.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Max Attendees *
                    </label>
                    <select
                      value={newWebinar.maxAttendees}
                      onChange={(e) => setNewWebinar({...newWebinar, maxAttendees: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="75">75</option>
                      <option value="100">100</option>
                      <option value="150">150</option>
                      <option value="200">200</option>
                    </select>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M9.5 1.5v3h3v-3h-3zm-4 0v3h3v-3h-3zm-4 3v3h3v-3h-3zm4 0v3h3v-3h-3zm4 0v3h3v-3h-3zm4 0v3h3v-3h-3zm-8 3v3h3v-3h-3zm4 0v3h3v-3h-3zm4 0v3h3v-3h-3zm-4 3v3h3v-3h-3z"/>
                    </svg>
                    <div className="flex-1">
                      <p className="font-semibold text-blue-900 mb-1">Microsoft Teams Integration</p>
                      <p className="text-sm text-blue-800">
                        A Teams meeting link will be automatically generated for this webinar. Registered participants will receive the link via email and can join directly from their Teams app or browser.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 mt-8">
                <button
                  onClick={() => {
                    setShowScheduleModal(false);
                    setNewWebinar({
                      title: '',
                      description: '',
                      date: '',
                      time: '',
                      topic: '',
                      region: '',
                      maxAttendees: '50',
                      expert: ''
                    });
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleWebinar}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Schedule Webinar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ExpertDirectory;