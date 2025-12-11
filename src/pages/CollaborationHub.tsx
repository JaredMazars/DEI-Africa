import React, { useState } from 'react';
import { useEffect } from 'react';
import { Plus, Search, MapPin, Users, Calendar, TrendingUp, FileText, Target, Send, DollarSign, Clock, Filter, BarChart3, Globe } from 'lucide-react';
import { opportunitiesAPI } from '../services/api';

interface Opportunity {
  id: string;
  title: string;
  description: string;
  industry: string;
  clientSector: string;
  regionsNeeded: string[];
  contactPerson: string;
  contactAvatar: string;
  deadline: string;
  budget: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'closed';
  applicants: number;
  createdAt: string;
}

interface CollaborationGroup {
  id: string;
  name: string;
  description: string;
  members: Array<{
    id: string;
    name: string;
    avatar: string;
    role: string;
  }>;
  opportunities: string[];
  status: 'active' | 'completed';
  lastActivity: string;
}

interface DealPipeline {
  id: string;
  clientName: string;
  value: string;
  stage: 'prospecting' | 'proposal' | 'negotiation' | 'closed';
  regions: string[];
  probability: number;
  expectedClose: string;
  teamLead: string;
}

interface CaseStudy {
  id: string;
  title: string;
  industry: string;
  region: string;
  author: string;
  authorAvatar: string;
  summary: string;
  downloadCount: number;
  publishedAt: string;
  tags: string[];
}

const CollaborationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'opportunities' | 'groups' | 'pipeline' | 'knowledge'>('opportunities');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    industry: '',
    region: '',
    status: 'all'
  });
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    description: '',
    industry: '',
    clientSector: '',
    regionsNeeded: '',
    budget: '',
    deadline: ''
  });
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  // Dummy opportunities data as fallback
  const dummyOpportunities: Opportunity[] = [
    {
      id: '1',
      title: 'Regional Banking Expansion - West Africa',
      description: 'Leading Nigerian bank seeking expertise for multi-country expansion into Ghana, Côte d\'Ivoire, and Senegal. Need specialists in banking regulations, tax structuring, and market entry strategies.',
      industry: 'Financial Services',
      clientSector: 'Banking',
      regionsNeeded: ['Nigeria', 'Ghana', 'Côte d\'Ivoire', 'Senegal'],
      contactPerson: 'Amara Okafor',
      contactAvatar: 'https://images.pexels.com/photos/3778966/pexels-photo-3778966.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      deadline: 'March 15, 2024',
      budget: '$500K - $1M',
      priority: 'high',
      status: 'open',
      applicants: 8,
      createdAt: 'Jan 28, 2024'
    },
    {
      id: '2',
      title: 'ESG Compliance for Mining Operations',
      description: 'Large mining conglomerate needs comprehensive ESG audit and sustainability roadmap across Southern African operations. Focus on environmental impact, community relations, and governance frameworks.',
      industry: 'Mining',
      clientSector: 'Natural Resources',
      regionsNeeded: ['South Africa', 'Botswana', 'Zambia', 'Zimbabwe'],
      contactPerson: 'Thabo Mthembu',
      contactAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      deadline: 'April 1, 2024',
      budget: '$750K - $1.5M',
      priority: 'high',
      status: 'open',
      applicants: 12,
      createdAt: 'Jan 25, 2024'
    },
    {
      id: '3',
      title: 'Digital Payment Platform Launch - East Africa',
      description: 'Fintech startup launching mobile payment solution across EA Community. Require regulatory compliance, payment systems integration, and market analysis expertise.',
      industry: 'Technology',
      clientSector: 'Fintech',
      regionsNeeded: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda'],
      contactPerson: 'Kemi Adebayo',
      contactAvatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      deadline: 'March 30, 2024',
      budget: '$300K - $600K',
      priority: 'medium',
      status: 'open',
      applicants: 6,
      createdAt: 'Feb 1, 2024'
    },
    {
      id: '4',
      title: 'Cross-Border M&A Advisory - Consumer Goods',
      description: 'International consumer goods company acquiring West African distribution network. Need M&A advisory, due diligence, valuation, and integration planning across multiple markets.',
      industry: 'Consumer Goods',
      clientSector: 'Retail & Distribution',
      regionsNeeded: ['Ghana', 'Nigeria', 'Côte d\'Ivoire'],
      contactPerson: 'Kwame Asante',
      contactAvatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      deadline: 'April 15, 2024',
      budget: '$400K - $800K',
      priority: 'high',
      status: 'in-progress',
      applicants: 5,
      createdAt: 'Jan 20, 2024'
    },
    {
      id: '5',
      title: 'Infrastructure PPP Structuring - Transport Sector',
      description: 'Government-led public-private partnership for regional transportation infrastructure. Seeking experts in project finance, regulatory frameworks, and risk management.',
      industry: 'Infrastructure',
      clientSector: 'Transportation',
      regionsNeeded: ['Ethiopia', 'Kenya', 'Uganda'],
      contactPerson: 'Sarah Mwangi',
      contactAvatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      deadline: 'May 1, 2024',
      budget: '$1M - $2M',
      priority: 'high',
      status: 'open',
      applicants: 15,
      createdAt: 'Jan 18, 2024'
    },
    {
      id: '6',
      title: 'Tax Optimization for Multinational Corporation',
      description: 'Global corporation needs comprehensive tax strategy for African operations. Focus on transfer pricing, withholding tax optimization, and treaty navigation across 10+ countries.',
      industry: 'Professional Services',
      clientSector: 'Tax Advisory',
      regionsNeeded: ['South Africa', 'Nigeria', 'Kenya', 'Egypt', 'Morocco'],
      contactPerson: 'Fatima El-Sayed',
      contactAvatar: 'https://images.pexels.com/photos/3776164/pexels-photo-3776164.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      deadline: 'March 20, 2024',
      budget: '$600K - $1.2M',
      priority: 'medium',
      status: 'open',
      applicants: 9,
      createdAt: 'Jan 30, 2024'
    },
    {
      id: '7',
      title: 'Healthcare System Digital Transformation',
      description: 'Regional healthcare provider implementing digital health records and telemedicine platform. Need expertise in healthcare regulations, data privacy, and system integration.',
      industry: 'Healthcare',
      clientSector: 'Medical Services',
      regionsNeeded: ['Ghana', 'Nigeria', 'Kenya'],
      contactPerson: 'Dr. Nia Banda',
      contactAvatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      deadline: 'April 10, 2024',
      budget: '$250K - $500K',
      priority: 'medium',
      status: 'open',
      applicants: 4,
      createdAt: 'Feb 3, 2024'
    },
    {
      id: '8',
      title: 'Renewable Energy Project Finance - Solar',
      description: 'Large-scale solar energy project across Southern Africa seeking project finance advisory, regulatory compliance, and environmental impact assessment.',
      industry: 'Energy',
      clientSector: 'Renewable Energy',
      regionsNeeded: ['South Africa', 'Namibia', 'Botswana'],
      contactPerson: 'Thabo Mthembu',
      contactAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      deadline: 'March 25, 2024',
      budget: '$800K - $1.5M',
      priority: 'high',
      status: 'open',
      applicants: 11,
      createdAt: 'Jan 22, 2024'
    }
  ];

  // Load opportunities from API
  useEffect(() => {
    const loadOpportunities = async () => {
      try {
        setLoading(true);
        const response = await opportunitiesAPI.getOpportunities();
        
        // Transform backend data to frontend format
        const transformedOpportunities = response.data.opportunities.map((opp: any) => ({
          id: opp.opportunity_id,
          title: opp.title,
          description: opp.description,
          industry: opp.industry,
          clientSector: opp.client_sector,
          regionsNeeded: opp.regions_needed.split(',').map((r: string) => r.trim()),
          contactPerson: opp.contact_person_name,
          contactAvatar: opp.contact_person_avatar || 'https://images.pexels.com/photos/3778966/pexels-photo-3778966.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
          deadline: new Date(opp.deadline).toLocaleDateString(),
          budget: opp.budget_range,
          priority: opp.priority,
          status: opp.status,
          applicants: opp.applicant_count || 0,
          createdAt: new Date(opp.created_at).toLocaleDateString()
        }));

        // Use dummy data if API returns empty
        setOpportunities(transformedOpportunities.length > 0 ? transformedOpportunities : dummyOpportunities);
      } catch (error) {
        console.error('Error loading opportunities:', error);
        // Use dummy data on error
        setOpportunities(dummyOpportunities);
      } finally {
        setLoading(false);
      }
    };

    loadOpportunities();
  }, []);

  const collaborationGroups: CollaborationGroup[] = [
    {
      id: '1',
      name: 'West Africa Banking Expansion Team',
      description: 'Cross-regional team working on financial services expansion projects',
      members: [
        { id: '1', name: 'Amara Okafor', avatar: 'https://images.pexels.com/photos/3778966/pexels-photo-3778966.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop', role: 'Lead' },
        { id: '2', name: 'Kwame Asante', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop', role: 'Ghana Expert' },
        { id: '3', name: 'Marie Kouassi', avatar: 'https://images.pexels.com/photos/3776164/pexels-photo-3776164.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop', role: 'Côte d\'Ivoire Expert' }
      ],
      opportunities: ['1'],
      status: 'active',
      lastActivity: '2 hours ago'
    },
    {
      id: '2',
      name: 'ESG & Sustainability Network',
      description: 'Regional experts focusing on ESG compliance and sustainability reporting',
      members: [
        { id: '4', name: 'Thabo Mthembu', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop', role: 'Lead' },
        { id: '5', name: 'Sarah Mwangi', avatar: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop', role: 'Kenya Partner' },
        { id: '6', name: 'David Chanda', avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop', role: 'Zambia Partner' }
      ],
      opportunities: ['2'],
      status: 'active',
      lastActivity: '5 hours ago'
    }
  ];

  const dealPipeline: DealPipeline[] = [
    {
      id: '1',
      clientName: 'First Bank Nigeria',
      value: '$4.2M',
      stage: 'negotiation',
      regions: ['Nigeria', 'Ghana'],
      probability: 75,
      expectedClose: '2024-03-30',
      teamLead: 'Amara Okafor'
    },
    {
      id: '2',
      clientName: 'Anglo American',
      value: '$2.8M',
      stage: 'proposal',
      regions: ['South Africa', 'Botswana'],
      probability: 60,
      expectedClose: '2024-04-15',
      teamLead: 'Thabo Mthembu'
    },
    {
      id: '3',
      clientName: 'Safaricom Ethiopia',
      value: '$1.5M',
      stage: 'prospecting',
      regions: ['Kenya', 'Ethiopia'],
      probability: 30,
      expectedClose: '2024-05-20',
      teamLead: 'Kemi Adebayo'
    }
  ];

  const caseStudies: CaseStudy[] = [
    {
      id: '1',
      title: 'Cross-Border M&A Success: Nigerian Bank\'s Expansion into Ghana',
      industry: 'Financial Services',
      region: 'West Africa',
      author: 'Amara Okafor',
      authorAvatar: 'https://images.pexels.com/photos/3778966/pexels-photo-3778966.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      summary: 'Complete case study on regulatory navigation, tax optimization, and stakeholder management for a successful cross-border acquisition.',
      downloadCount: 156,
      publishedAt: '2024-01-15',
      tags: ['M&A', 'Banking', 'Regulatory', 'West Africa']
    },
    {
      id: '2',
      title: 'ESG Transformation in Southern African Mining',
      industry: 'Mining',
      region: 'Southern Africa',
      author: 'Thabo Mthembu',
      authorAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      summary: 'Comprehensive guide to implementing ESG frameworks and achieving sustainability certifications in the mining sector.',
      downloadCount: 203,
      publishedAt: '2024-01-20',
      tags: ['ESG', 'Mining', 'Sustainability', 'Compliance']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'prospecting': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleCreateOpportunity = () => {
    const createOpportunity = async () => {
      if (newOpportunity.title.trim() && newOpportunity.description.trim()) {
        try {
          await opportunitiesAPI.createOpportunity({
            title: newOpportunity.title,
            description: newOpportunity.description,
            industry: newOpportunity.industry,
            client_sector: newOpportunity.clientSector,
            regions_needed: newOpportunity.regionsNeeded,
            budget_range: newOpportunity.budget,
            deadline: newOpportunity.deadline,
            priority: 'medium'
          });
          
          setShowCreateModal(false);
          setNewOpportunity({
            title: '',
            description: '',
            industry: '',
            clientSector: '',
            regionsNeeded: '',
            budget: '',
            deadline: ''
          });
          
          // Reload opportunities
          const response = await opportunitiesAPI.getOpportunities();
          const transformedOpportunities = response.data.opportunities.map((opp: any) => ({
            id: opp.opportunity_id,
            title: opp.title,
            description: opp.description,
            industry: opp.industry,
            clientSector: opp.client_sector,
            regionsNeeded: opp.regions_needed.split(',').map((r: string) => r.trim()),
            contactPerson: opp.contact_person_name,
            contactAvatar: opp.contact_person_avatar || 'https://images.pexels.com/photos/3778966/pexels-photo-3778966.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
            deadline: new Date(opp.deadline).toLocaleDateString(),
            budget: opp.budget_range,
            priority: opp.priority,
            status: opp.status,
            applicants: opp.applicant_count || 0,
            createdAt: new Date(opp.created_at).toLocaleDateString()
          }));
          setOpportunities(transformedOpportunities);
          
        } catch (error) {
          console.error('Error creating opportunity:', error);
          alert('Failed to create opportunity. Please try again.');
        }
      }
    };
    
    createOpportunity();
  };

  const handleLearnMore = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowOpportunityModal(true);
  };

  const handleExpressInterest = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setShowInterestModal(true);
  };

  const handleSendInterest = () => {
    if (interestMessage.trim()) {
      // Add interest submission logic here
      setShowInterestModal(false);
      setInterestMessage('');
      setSelectedOpportunity(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header with Forvis Mazars Branding */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-[1920px] mx-auto px-12 sm:px-16 lg:px-20 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-3 text-white">Client Collaboration & Opportunity Hub</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Share opportunities and collaborate on cross-border projects across our network
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-12 sm:px-16 lg:px-20 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Tabs Header */}
          <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            {activeTab === 'opportunities' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ml-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Post Opportunity</span>
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'opportunities'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Opportunities
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'groups'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Collaboration Groups
            </button>
            <button
              onClick={() => setActiveTab('pipeline')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'pipeline'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Deal Pipeline
            </button>
            <button
              onClick={() => setActiveTab('knowledge')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'knowledge'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Knowledge Sharing
            </button>
          </div>
        </div>

        {/* Opportunities Tab */}
        {activeTab === 'opportunities' && (
          <div className="flex h-full">
            {/* Filters Sidebar */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
              <div className="p-6">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search opportunities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <select
                      value={selectedFilters.industry}
                      onChange={(e) => setSelectedFilters({...selectedFilters, industry: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Industries</option>
                      <option value="Financial Services">Financial Services</option>
                      <option value="Mining">Mining</option>
                      <option value="Technology">Technology</option>
                      <option value="Energy">Energy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                    <select
                      value={selectedFilters.region}
                      onChange={(e) => setSelectedFilters({...selectedFilters, region: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Regions</option>
                      <option value="West Africa">West Africa</option>
                      <option value="East Africa">East Africa</option>
                      <option value="Southern Africa">Southern Africa</option>
                      <option value="North Africa">North Africa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={selectedFilters.status}
                      onChange={(e) => setSelectedFilters({...selectedFilters, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Statuses</option>
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Opportunity Stats</h4>
                  <div className="space-y-2 text-sm text-blue-700">
                    <div className="flex justify-between">
                      <span>Open Opportunities:</span>
                      <span className="font-medium">{opportunities.filter(o => o.status === 'open').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Value:</span>
                      <span className="font-medium">$8M+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Collaborations:</span>
                      <span className="font-medium">{collaborationGroups.filter(g => g.status === 'active').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opportunities List */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                {opportunities.map((opportunity) => (
                  <div key={opportunity.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{opportunity.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{opportunity.industry}</span>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">{opportunity.clientSector}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(opportunity.status)}`}>
                            {opportunity.status.replace('-', ' ')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(opportunity.priority)}`}>
                            {opportunity.priority} priority
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900">{opportunity.budget}</div>
                        <div className="text-sm text-gray-600">Budget Range</div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{opportunity.description}</p>

                    <div className="flex items-center space-x-6 mb-4">
                      <div className="flex items-center space-x-2">
                        <img
                          src={opportunity.contactAvatar}
                          alt={opportunity.contactPerson}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{opportunity.contactPerson}</div>
                          <div className="text-xs text-gray-600">Contact Person</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>Deadline: {opportunity.deadline}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{opportunity.applicants} interested</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Regions Needed:</div>
                        <div className="flex space-x-2">
                          {opportunity.regionsNeeded.map((region) => (
                            <span key={region} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                              {region}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          Express Interest
                        </button>
                        <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          <span onClick={() => handleLearnMore(opportunity)}>Learn More</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Collaboration Groups Tab */}
        {activeTab === 'groups' && (
          <div className="p-6 overflow-y-auto h-full">
            <div className="grid gap-6">
              {collaborationGroups.map((group) => (
                <div key={group.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{group.name}</h3>
                      <p className="text-gray-700 mb-3">{group.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          group.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {group.status}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Last activity: {group.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Team Members</h4>
                    <div className="flex space-x-4">
                      {group.members.map((member) => (
                        <div key={member.id} className="flex items-center space-x-2">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            <div className="text-xs text-gray-600">{member.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      Join Group
                    </button>
                    <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deal Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <div className="p-6 overflow-y-auto h-full">
            <div className="mb-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">$8.5M</div>
                  <div className="text-sm text-blue-700">Total Pipeline Value</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-sm text-blue-700">Active Deals</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">55%</div>
                  <div className="text-sm text-orange-700">Avg. Win Rate</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-900">12</div>
                  <div className="text-sm text-blue-800">Regions Covered</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {dealPipeline.map((deal) => (
                <div key={deal.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{deal.clientName}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStageColor(deal.stage)}`}>
                          {deal.stage.replace('-', ' ')}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Expected close: {deal.expectedClose}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{deal.probability}% probability</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Team Lead: <span className="font-medium text-gray-900">{deal.teamLead}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">{deal.value}</div>
                      <div className="text-sm text-gray-600">Deal Value</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Regions:</div>
                      <div className="flex space-x-2">
                        {deal.regions.map((region) => (
                          <span key={region} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm transition-colors">
                        View Details
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Knowledge Sharing Tab */}
        {activeTab === 'knowledge' && (
          <div className="p-6 overflow-y-auto h-full">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Business Strategy & Market Intelligence</h2>
              <p className="text-gray-600">Case studies and insights to help win similar business</p>
            </div>

            <div className="grid gap-6">
              {caseStudies.map((study) => (
                <div key={study.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                        {study.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{study.industry}</span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{study.region}</span>
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{study.downloadCount} downloads</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{study.summary}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={study.authorAvatar}
                        alt={study.author}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{study.author}</div>
                        <div className="text-xs text-gray-600">Published {study.publishedAt}</div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Preview
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Download
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {study.tags.map((tag) => (
                      <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Opportunity Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Post New Opportunity</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opportunity Title</label>
                <input
                  type="text"
                  value={newOpportunity.title}
                  onChange={(e) => setNewOpportunity({...newOpportunity, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief, descriptive title for the opportunity"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={4}
                  value={newOpportunity.description}
                  onChange={(e) => setNewOpportunity({...newOpportunity, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed description of the opportunity, client needs, and required expertise..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select
                    value={newOpportunity.industry}
                    onChange={(e) => setNewOpportunity({...newOpportunity, industry: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Industry</option>
                    <option value="Financial Services">Financial Services</option>
                    <option value="Mining">Mining</option>
                    <option value="Technology">Technology</option>
                    <option value="Energy">Energy</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client Sector</label>
                  <input
                    type="text"
                    value={newOpportunity.clientSector}
                    onChange={(e) => setNewOpportunity({...newOpportunity, clientSector: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Banking, Manufacturing"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Regions Where Expertise is Needed</label>
                <input
                  type="text"
                  value={newOpportunity.regionsNeeded}
                  onChange={(e) => setNewOpportunity({...newOpportunity, regionsNeeded: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Nigeria, Ghana, Kenya (comma separated)"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                  <select
                    value={newOpportunity.budget}
                    onChange={(e) => setNewOpportunity({...newOpportunity, budget: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Budget Range</option>
                    <option value="$100K - $500K">$100K - $500K</option>
                    <option value="$500K - $1M">$500K - $1M</option>
                    <option value="$1M - $3M">$1M - $3M</option>
                    <option value="$3M - $5M">$3M - $5M</option>
                    <option value="$5M+">$5M+</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
                  <input
                    type="date"
                    value={newOpportunity.deadline}
                    onChange={(e) => setNewOpportunity({...newOpportunity, deadline: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateOpportunity}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Post Opportunity</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Opportunity Details Modal */}
      {showOpportunityModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedOpportunity.title}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">{selectedOpportunity.industry}</span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">{selectedOpportunity.clientSector}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOpportunity.status)}`}>
                      {selectedOpportunity.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowOpportunityModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-lg font-bold text-gray-900">{selectedOpportunity.budget}</div>
                  <div className="text-sm text-gray-600">Budget Range</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{selectedOpportunity.deadline}</div>
                  <div className="text-sm text-gray-600">Deadline</div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedOpportunity.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Regions Needed</h3>
                <div className="flex space-x-2">
                  {selectedOpportunity.regionsNeeded.map((region) => (
                    <span key={region} className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">
                      {region}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Person</h3>
                <div className="flex items-center space-x-3">
                  <img
                    src={selectedOpportunity.contactAvatar}
                    alt={selectedOpportunity.contactPerson}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{selectedOpportunity.contactPerson}</div>
                    <div className="text-sm text-gray-600">Project Lead</div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <div className="text-sm text-gray-600">
                  <strong>{selectedOpportunity.applicants}</strong> professionals have expressed interest in this opportunity
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setShowOpportunityModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    setShowOpportunityModal(false);
                    handleExpressInterest(selectedOpportunity);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Express Interest
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Express Interest Modal */}
      {showInterestModal && selectedOpportunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Express Interest: {selectedOpportunity.title}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why are you interested in this opportunity?
                </label>
                <textarea
                  rows={4}
                  value={interestMessage}
                  onChange={(e) => setInterestMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your relevant experience and how you can contribute..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowInterestModal(false);
                    setInterestMessage('');
                    setSelectedOpportunity(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendInterest}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Submit Interest
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

export default CollaborationHub;