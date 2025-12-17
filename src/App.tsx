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
            className="fixed bottom-4 right-4 bg-gradient-to-r from-rose-500 to-fuchsia-600 text-white px-4 py-2 rounded-lg hover:shadow-lg hover:scale-110 transition-all text-sm font-bold"
          >
            Admin
          </button>
        </>
      )}
    </>
  );
}

export default App;
