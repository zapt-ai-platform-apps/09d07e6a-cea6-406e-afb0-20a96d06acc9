import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../modules/user/hooks/useUser';

function AuditFormPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    housingType: '',
    houseSize: '',
    insulationType: '',
    heatingSystem: '',
    coolingSystem: '',
    applianceData: {
      refrigerator: false,
      washer: false,
      dryer: false,
      dishwasher: false,
      energyStarAppliances: false,
    },
    currentEnergyBill: '',
  });
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (appliance data)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const nextStep = () => {
    if (step === 1 && !formData.housingType) {
      setError('Please select your housing type');
      return;
    }
    
    if (step === 2 && !formData.houseSize) {
      setError('Please enter your house size');
      return;
    }
    
    if (step === 4 && !formData.currentEnergyBill) {
      setError('Please enter your monthly energy bill');
      return;
    }
    
    setError('');
    setStep(step + 1);
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const submitAudit = async () => {
    if (!user) {
      navigate('/');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      console.log('Submitting audit for user:', user.email);
      
      const response = await fetch('/api/audits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          email: user.email,
          houseSize: parseInt(formData.houseSize, 10),
          currentEnergyBill: parseInt(formData.currentEnergyBill, 10),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit audit');
      }
      
      const auditData = await response.json();
      console.log('Audit submitted successfully:', auditData);
      
      // Generate recommendations based on the audit
      console.log('Generating recommendations for audit:', auditData.id);
      await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auditId: auditData.id,
          email: user.email,
        }),
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting audit:', error);
      setError('Failed to submit audit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Energy Audit</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-gray-500">Step {step} of 5</span>
            <span className="text-sm text-gray-500">{step * 20}%</span>
          </div>
          <div className="bg-gray-200 h-2 rounded-full">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${step * 20}%` }}
            ></div>
          </div>
        </div>
        
        {/* Step 1: Housing Type */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">What type of home do you live in?</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <label className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition ${formData.housingType === 'apartment' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <input
                  type="radio"
                  name="housingType"
                  value="apartment"
                  checked={formData.housingType === 'apartment'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex flex-col items-center text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium">Apartment</span>
                </div>
              </label>
              
              <label className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition ${formData.housingType === 'townhouse' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <input
                  type="radio"
                  name="housingType"
                  value="townhouse"
                  checked={formData.housingType === 'townhouse'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex flex-col items-center text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="font-medium">Townhouse</span>
                </div>
              </label>
              
              <label className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition ${formData.housingType === 'single_family' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <input
                  type="radio"
                  name="housingType"
                  value="single_family"
                  checked={formData.housingType === 'single_family'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex flex-col items-center text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="font-medium">Single Family Home</span>
                </div>
              </label>
              
              <label className={`border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition ${formData.housingType === 'multi_family' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <input
                  type="radio"
                  name="housingType"
                  value="multi_family"
                  checked={formData.housingType === 'multi_family'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex flex-col items-center text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium">Multi-Family Building</span>
                </div>
              </label>
            </div>
          </div>
        )}
        
        {/* Step 2: Size and Age */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">What is the size of your home?</h2>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="houseSize">
                Size (in square feet)
              </label>
              <input
                type="number"
                id="houseSize"
                name="houseSize"
                value={formData.houseSize}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md box-border"
                placeholder="e.g., 1500"
                min="100"
              />
            </div>
          </div>
        )}
        
        {/* Step 3: Insulation and Systems */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Tell us about your home's insulation and systems</h2>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="insulationType">
                Insulation Type
              </label>
              <select
                id="insulationType"
                name="insulationType"
                value={formData.insulationType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md box-border"
              >
                <option value="">Select insulation type</option>
                <option value="high_efficiency">High-Efficiency Insulation</option>
                <option value="standard">Standard Insulation</option>
                <option value="poor">Poor or No Insulation</option>
                <option value="unknown">Don't Know</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="heatingSystem">
                Primary Heating System
              </label>
              <select
                id="heatingSystem"
                name="heatingSystem"
                value={formData.heatingSystem}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md box-border"
              >
                <option value="">Select heating system</option>
                <option value="electric_heat_pump">Electric Heat Pump</option>
                <option value="gas_furnace">Gas Furnace</option>
                <option value="electric_resistance">Electric Baseboard/Resistance</option>
                <option value="oil">Oil Heating</option>
                <option value="propane">Propane</option>
                <option value="wood">Wood or Pellet Stove</option>
                <option value="unknown">Don't Know</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="coolingSystem">
                Primary Cooling System
              </label>
              <select
                id="coolingSystem"
                name="coolingSystem"
                value={formData.coolingSystem}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md box-border"
              >
                <option value="">Select cooling system</option>
                <option value="central_ac">Central Air Conditioning</option>
                <option value="window_units">Window Units</option>
                <option value="heat_pump">Heat Pump</option>
                <option value="evaporative">Evaporative Cooler</option>
                <option value="none">None</option>
                <option value="unknown">Don't Know</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Step 4: Appliances */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Which major appliances do you use regularly?</h2>
            
            <div className="space-y-4 mb-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="applianceData.refrigerator"
                  checked={formData.applianceData.refrigerator}
                  onChange={handleChange}
                  className="h-5 w-5 text-green-500 rounded cursor-pointer"
                />
                <span className="ml-3">Refrigerator</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="applianceData.washer"
                  checked={formData.applianceData.washer}
                  onChange={handleChange}
                  className="h-5 w-5 text-green-500 rounded cursor-pointer"
                />
                <span className="ml-3">Washing Machine</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="applianceData.dryer"
                  checked={formData.applianceData.dryer}
                  onChange={handleChange}
                  className="h-5 w-5 text-green-500 rounded cursor-pointer"
                />
                <span className="ml-3">Clothes Dryer</span>
              </label>
              
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="applianceData.dishwasher"
                  checked={formData.applianceData.dishwasher}
                  onChange={handleChange}
                  className="h-5 w-5 text-green-500 rounded cursor-pointer"
                />
                <span className="ml-3">Dishwasher</span>
              </label>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Are your appliances ENERGY STAR certified?
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="applianceData.energyStarAppliances"
                    value="true"
                    checked={formData.applianceData.energyStarAppliances === true}
                    onChange={() => setFormData({
                      ...formData,
                      applianceData: {
                        ...formData.applianceData,
                        energyStarAppliances: true
                      }
                    })}
                    className="h-5 w-5 text-green-500 cursor-pointer"
                  />
                  <span className="ml-3">Yes</span>
                </label>
                
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="applianceData.energyStarAppliances"
                    value="false"
                    checked={formData.applianceData.energyStarAppliances === false}
                    onChange={() => setFormData({
                      ...formData,
                      applianceData: {
                        ...formData.applianceData,
                        energyStarAppliances: false
                      }
                    })}
                    className="h-5 w-5 text-green-500 cursor-pointer"
                  />
                  <span className="ml-3">No</span>
                </label>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="currentEnergyBill">
                Average Monthly Energy Bill ($)
              </label>
              <input
                type="number"
                id="currentEnergyBill"
                name="currentEnergyBill"
                value={formData.currentEnergyBill}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md box-border"
                placeholder="e.g., 150"
                min="0"
              />
            </div>
          </div>
        )}
        
        {/* Step 5: Review */}
        {step === 5 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Review Your Information</h2>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="font-medium mb-3">Housing Details</h3>
              <ul className="space-y-2 text-gray-700">
                <li><span className="font-medium">Housing Type:</span> {formData.housingType.replace('_', ' ')}</li>
                <li><span className="font-medium">Size:</span> {formData.houseSize} sq ft</li>
                <li><span className="font-medium">Insulation:</span> {formData.insulationType?.replace('_', ' ') || 'Not specified'}</li>
                <li><span className="font-medium">Heating:</span> {formData.heatingSystem?.replace('_', ' ') || 'Not specified'}</li>
                <li><span className="font-medium">Cooling:</span> {formData.coolingSystem?.replace('_', ' ') || 'Not specified'}</li>
                <li><span className="font-medium">Energy Bill:</span> ${formData.currentEnergyBill}/month</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="font-medium mb-3">Appliances</h3>
              <ul className="space-y-2 text-gray-700">
                {formData.applianceData.refrigerator && <li>Refrigerator</li>}
                {formData.applianceData.washer && <li>Washing Machine</li>}
                {formData.applianceData.dryer && <li>Clothes Dryer</li>}
                {formData.applianceData.dishwasher && <li>Dishwasher</li>}
                <li><span className="font-medium">ENERGY STAR Certified:</span> {formData.applianceData.energyStarAppliances ? 'Yes' : 'No'}</li>
              </ul>
            </div>
            
            <p className="text-gray-600 mb-6">
              Submit this information to get your energy efficiency score and personalized recommendations.
            </p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6">
            {error}
          </div>
        )}
        
        <div className="flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition cursor-pointer"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition cursor-pointer"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={submitAudit}
              disabled={isSubmitting}
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition cursor-pointer"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Audit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuditFormPage;