import React, { useState } from 'react';
import './Playground.css';

function Playground() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState('databricks-dbrx-instruct');
  const [chatInput, setChatInput] = useState('');

  const sidebarItems = [
    { icon: '🏠', label: 'Home', active: true },
    { icon: '💬', label: 'Playground', active: false },
    { icon: '📊', label: 'SQL Editor', active: false },
    { icon: '📈', label: 'Notebooks', active: false },
    { icon: '🗃️', label: 'Data', active: false },
    { icon: '⚙️', label: 'Settings', active: false },
    { icon: '👥', label: 'Users', active: false },
    { icon: '🔧', label: 'Admin', active: false }
  ];

  const models = [
    'databricks-dbrx-instruct',
    'databricks-meta-llama-3-1-70b-instruct',
    'databricks-mixtral-8x7b-instruct',
    'databricks-meta-llama-2-70b-chat'
  ];

  return (
    <div className="playground">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <img src="/primary-lockup-full-color-rgb.svg" alt="Databricks" />
          </div>
          <button 
            className="collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            ☰
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {sidebarItems.map((item, index) => (
            <div 
              key={index} 
              className={`nav-item ${item.active ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="top-bar-left">
            <button 
              className="hamburger"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              ☰
            </button>
            <div className="breadcrumb">Playground</div>
          </div>
          
          <div className="top-bar-center">
            <div className="search-bar">
              <input type="text" placeholder="Search..." />
              <button className="search-btn">🔍</button>
            </div>
          </div>
          
          <div className="top-bar-right">
            <button className="notification-btn">🔔</button>
            <div className="user-menu">
              <div className="user-avatar">KG</div>
            </div>
          </div>
        </div>

        {/* Playground Content */}
        <div className="playground-content">
          <div className="playground-header">
            <h1>Playground</h1>
            <div className="header-actions">
              <button className="export-btn">Export code</button>
              <button className="feedback-btn">Give feedback</button>
            </div>
          </div>

          {/* Model Selection */}
          <div className="model-section">
            <div className="model-selector">
              <label>Model</label>
              <select 
                value={selectedModel} 
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                {models.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
              <button className="settings-btn">⚙️</button>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="chat-section">
            <div className="chat-messages">
              <div className="message assistant">
                <div className="message-content">
                  Hello! I'm your AI assistant. How can I help you today?
                </div>
              </div>
            </div>
            
            <div className="chat-input-container">
              <div className="chat-input">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me anything..."
                  rows="3"
                />
                <div className="input-actions">
                  <button className="attach-btn">📎</button>
                  <button className="send-btn" disabled={!chatInput.trim()}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playground;
