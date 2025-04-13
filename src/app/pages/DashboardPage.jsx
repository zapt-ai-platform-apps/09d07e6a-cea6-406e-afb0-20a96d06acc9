import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../modules/user/hooks/useUser';

function DashboardPage() {
  const { user } = useUser();
  const [audits, setAudits] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        console.log('Fetching dashboard data for:', user.email);
        
        // Fetch audits
        const auditsResponse = await fetch(`/api/audits?email=${encodeURIComponent(user.email)}`);
        if (!auditsResponse.ok) throw new Error('Failed to fetch audits');
        const auditsData = await auditsResponse.json();
        console.log('Received audits data:', auditsData);
        setAudits(auditsData);
        
        // Fetch recommendations
        const recommendationsResponse = await fetch(`/api/recommendations?email=${encodeURIComponent(user.email)}`);
        if (!recommendationsResponse.ok) throw new Error('Failed to fetch recommendations');
        const recommendationsData = await recommendationsResponse.json();
        console.log('Received recommendations data:', recommendationsData);
        setRecommendations(recommendationsData);
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  // Calculate summary stats
  const latestAudit = audits.length > 0 ? audits[audits.length - 1] : null;
  const completedRecommendations = recommendations.filter(rec => rec.completed).length;
  const pendingRecommendations = recommendations.length - completedRecommendations;
  
  const totalPotentialSavings = recommendations.reduce((total, rec) => total + (rec.potentialSavingsDollars || 0), 0);
  const achievedSavings = recommendations
    .filter(rec => rec.completed)
    .reduce((total, rec) => total + (rec.potentialSavingsDollars || 0), 0);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Energy Dashboard</h1>
      
      {audits.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Welcome to EcoTrack!</h2>
          <p className="text-gray-600 mb-6">Start by completing your first energy audit to get personalized recommendations.</p>
          <Link 
            to="/audit" 
            className="bg-green-500 text-white px-6 py-3 rounded-md font-medium hover:bg-green-600 transition inline-block cursor-pointer"
          >
            Start Energy Audit
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-500 font-medium mb-2">Energy Score</h3>
              <div className="flex items-end">
                <span className="text-3xl font-bold mr-2">{latestAudit?.energyScore || 0}</span>
                <span className="text-gray-500">/100</span>
              </div>
              <p className="text-gray-600 mt-2">
                {latestAudit?.energyScore > 75 ? 'Excellent' : 
                 latestAudit?.energyScore > 50 ? 'Good' : 
                 latestAudit?.energyScore > 25 ? 'Needs Improvement' : 'Poor'}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-500 font-medium mb-2">Recommendations</h3>
              <div className="flex items-end">
                <span className="text-3xl font-bold mr-2">{completedRecommendations}</span>
                <span className="text-gray-500">/{recommendations.length} completed</span>
              </div>
              <p className="text-gray-600 mt-2">
                {pendingRecommendations} pending actions
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-gray-500 font-medium mb-2">Potential Savings</h3>
              <div className="flex items-end">
                <span className="text-3xl font-bold mr-2">${totalPotentialSavings}</span>
                <span className="text-gray-500">/year</span>
              </div>
              <p className="text-gray-600 mt-2">
                ${achievedSavings} achieved so far
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Audit Results</h2>
                <Link 
                  to="/audit" 
                  className="text-green-500 hover:text-green-600 cursor-pointer"
                >
                  New Audit
                </Link>
              </div>
              
              {latestAudit && (
                <div>
                  <div className="mb-4">
                    <span className="text-gray-500">Completed on:</span>
                    <span className="ml-2">
                      {new Date(latestAudit.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">Housing Type:</span>
                      <p className="capitalize">{latestAudit.housingType.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">House Size:</span>
                      <p>{latestAudit.houseSize} sq ft</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Insulation:</span>
                      <p className="capitalize">{latestAudit.insulationType?.replace('_', ' ') || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Energy Bill:</span>
                      <p>${latestAudit.currentEnergyBill}/month</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Top Recommendations</h2>
                <Link 
                  to="/recommendations" 
                  className="text-green-500 hover:text-green-600 cursor-pointer"
                >
                  View All
                </Link>
              </div>
              
              {recommendations.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {recommendations
                    .sort((a, b) => a.priority - b.priority)
                    .slice(0, 3)
                    .map(rec => (
                      <li key={rec.id} className="py-3">
                        <div className="flex items-start">
                          <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full ${rec.completed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                          <div className="ml-3">
                            <p className="font-medium">{rec.title}</p>
                            <p className="text-sm text-gray-500">
                              Save up to ${rec.potentialSavingsDollars}/year
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-500">Complete an audit to get recommendations.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;