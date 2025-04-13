import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">EcoTrack</h3>
            <p className="text-gray-400">Track and improve your energy efficiency</p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <a 
              href="https://www.zapt.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              Made on ZAPT
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;