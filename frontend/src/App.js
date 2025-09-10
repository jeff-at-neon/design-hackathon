import React from 'react';
import './App.css';
import AgentsPage from './AgentsPage';

function App() {
  return (
    <div className="App">
      {/* Main Content - Always show AgentsPage as homepage */}
      <AgentsPage />
    </div>
  );
}

export default App;
