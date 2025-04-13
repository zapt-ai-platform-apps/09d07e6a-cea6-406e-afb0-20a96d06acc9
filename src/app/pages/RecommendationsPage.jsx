import React, { useState, useEffect } from 'react';
import { useUser } from '../../modules/user/hooks/useUser';
import { Link } from 'react-router-dom';

function RecommendationsPage() {
  const { user } = useUser();
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        console.log('Fetching recommendations for:', user.email);
        
        const response = await fetch(`/api/recommendations?email=${encodeURIComponent(user.email)}`);
        if (!response.ok) throw new Error('Failed to fetch recommendations');
        
        const data = await response.json();
        console.log('Received recommendations:', data);
        setRecommendations(data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError('Failed to load recommendations. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [user]);
  
  const markAsComplete = async (id) => {
    try {
      setIsUpdating(true);
      console.log('Marking recommendation as complete:', id);
      
      const response = await fetch('/api/recommendations', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          completed: true,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update recommendation');
      
      const updatedRec = await response.json();
      console.log('Recommendation updated:', updatedRec);
      
      setRecommendations(prev => 
        prev.map(rec => rec.id === id ? { ...rec, completed: true } : rec)
      );
      
      // Add action to track this implementation
      console.log('Creating action for completed recommendation');
      await fetch('/api/actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          recommendationId: id,
          implementationDate: new Date().toISOString(),
        }),
      });
      
    } catch (error) {
      console.error('Error updating recommendation:', error);
      setError('Failed to update recommendation. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };
  
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
  
  if (recommendations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Recommendations</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">No recommendations yet</h2>
          <p className="text-gray-600 mb-6">Complete an energy audit to get personalized recommendations for improving your energy efficiency.</p>
          <Link 
            to="/audit" 
            className="bg-green-500 text-white px-6 py-3 rounded-md font-medium hover:bg-green-600 transition inline-block cursor-pointer"
          >
            Start Energy Audit
          </Link>
        </div>
      </div>
    );
  }
  
  // Sort recommendations by priority
  const sortedRecommendations = [...recommendations].sort((a, b) => a.priority - b.priority);
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Recommendations</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Energy-Saving Opportunities</h2>
        <p className="text-gray-600 mb-4">
          Based on your energy audit, we've identified the following opportunities to improve your energy efficiency. 
          Implementing these recommendations could save you up to 
          <span className="font-bold text-green-600"> ${recommendations.reduce((total, rec) => total + (rec.potentialSavingsDollars || 0), 0)}</span> per year.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-gray-500 text-sm">Recommendations</p>
            <p className="text-2xl font-bold">{recommendations.length}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-gray-500 text-sm">Completed</p>
            <p className="text-2xl font-bold">{recommendations.filter(rec => rec.completed).length}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-gray-500 text-sm">Potential Savings</p>
            <p className="text-2xl font-bold">${recommendations.reduce((total, rec) => total + (rec.potentialSavingsDollars || 0), 0)}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {sortedRecommendations.map(recommendation => (
          <div 
            key={recommendation.id} 
            className={`bg-white rounded-lg shadow-md overflow-hidden ${recommendation.completed ? 'border-l-4 border-green-500' : ''}`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{recommendation.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${recommendation.completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                  {recommendation.completed ? 'Completed' : `Priority ${recommendation.priority}`}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">{recommendation.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-500 text-sm mb-1">Potential Savings</p>
                  <p className="font-bold">${recommendation.potentialSavingsDollars}/year</p>
                  <p className="text-gray-500 text-sm">{recommendation.potentialSavingsKwh} kWh/year</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-500 text-sm mb-1">Implementation Cost</p>
                  <p className="font-bold">${recommendation.implementationCost}</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-gray-500 text-sm mb-1">Payback Period</p>
                  <p className="font-bold">{recommendation.paybackPeriod} months</p>
                </div>
              </div>
              
              {!recommendation.completed && (
                <button 
                  onClick={() => markAsComplete(recommendation.id)}
                  disabled={isUpdating}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition cursor-pointer"
                >
                  {isUpdating ? 'Updating...' : 'Mark as Completed'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendationsPage;