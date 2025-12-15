import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AdminDashboard from './components/AdminDashboard';

function App() {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <>
      {showAdmin ? (
        <AdminDashboard onBack={() => setShowAdmin(false)} />
      ) : (
        <>
          <LandingPage />
          <button
            onClick={() => setShowAdmin(true)}
            className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors text-sm shadow-lg"
          >
            Admin
          </button>
        </>
      )}
    </>
  );
}

export default App;
