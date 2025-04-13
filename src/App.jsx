import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './app/components/Layout';
import HomePage from './app/pages/HomePage';
import DashboardPage from './app/pages/DashboardPage';
import AuditFormPage from './app/pages/AuditFormPage';
import RecommendationsPage from './app/pages/RecommendationsPage';
import UserProvider from './modules/user/components/UserProvider';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="audit" element={<AuditFormPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;