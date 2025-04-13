import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../modules/user/hooks/useUser';

function HomePage() {
  const { user, login } = useUser();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      await login(email);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If user is already logged in, redirect to dashboard
  if (user) {
    navigate('/dashboard');
    return null;
  }
  
  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Reduce Your Energy Bills and Save the Planet
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          EcoTrack helps you identify energy-saving opportunities in your home 
          and track your progress towards a greener future.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Energy Audit</h2>
          <p className="text-gray-600">
            Answer a few questions about your home and energy usage to receive a customized efficiency score.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Personalized Recommendations</h2>
          <p className="text-gray-600">
            Get tailored suggestions for improving your energy efficiency with estimated cost savings.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Track Your Progress</h2>
          <p className="text-gray-600">
            Monitor your improvements over time and see your total energy and cost savings.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Quick Implementation</h2>
          <p className="text-gray-600">
            Learn how to implement energy-saving measures with step-by-step guides and resources.
          </p>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-600 to-teal-500 rounded-lg shadow-xl p-6 md:p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Get Started Today</h2>
        <p className="mb-6">Enter your email to create an account and start your energy efficiency journey.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-grow px-4 py-2 rounded-md text-gray-800 box-border"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-green-600 px-6 py-2 rounded-md font-medium hover:bg-green-100 transition cursor-pointer"
          >
            {isSubmitting ? 'Loading...' : 'Start Now'}
          </button>
        </form>
        
        {error && <p className="mt-4 text-red-200">{error}</p>}
      </div>
    </div>
  );
}

export default HomePage;