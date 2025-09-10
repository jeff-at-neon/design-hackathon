import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  DesignSystemProvider,
  DesignSystemThemeProvider,
  PlusIcon,
  HomeIcon,
  FolderIcon,
  ClockIcon,
  CatalogIcon,
  WorkflowsIcon,
  CloudIcon,
  SearchIcon,
  StorefrontIcon,
  CodeIcon,
  QueryIcon,
  DashboardIcon,
  NotificationIcon,
  HistoryIcon,
  CloudDatabaseIcon,
  LightningIcon,
  IngestionIcon,
  PipelineIcon,
  BeakerIcon,
  TargetIcon,
  ModelsIcon,
  RocketIcon,
  GearIcon,
  OverflowIcon,
  SendIcon,
  WrenchIcon,
  UserIcon,
  ChevronDownIcon,
  StarIcon,
  NewWindowIcon,
  NotebookIcon,
  TableIcon,
  Card,
  Typography
} from '@databricks/design-system';
import '@databricks/design-system/dist/index.css';
import SpreadsheetSourceModal from './components/SpreadsheetSourceModal';
import './AgentsPage.css';
import './HomePage.css';

const HomePage = ({ onNavigate }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('suggested');
  const [showNewPopover, setShowNewPopover] = useState(false);
  const [showSpreadsheetModal, setShowSpreadsheetModal] = useState(false);
  const popoverRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavigate = (view) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  const handleCreateNew = (itemId) => {
    if (itemId === 'spreadsheet') {
      setShowSpreadsheetModal(true);
    }
    setShowNewPopover(false);
  };

  const handleSpreadsheetSourceSelect = (selection) => {
    console.log('Selected source:', selection);
    // Navigate to spreadsheet page with the selected source
    handleNavigate('spreadsheet');
  };

  const toggleNewPopover = () => {
    setShowNewPopover(!showNewPopover);
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setShowNewPopover(false);
      }
    };

    if (showNewPopover) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewPopover]);

  const recentItems = [
    {
      name: 'sample_text.sql',
      type: 'File',
      path: '/Users/kyle.gilbreath@databricks.com/ Testing out ETL with Designer/examples',
      activity: 'viewed frequently',
      icon: <CodeIcon />
    },
    {
      name: 'Testing out ETL with Designer',
      type: 'Pipeline editor',
      path: '/Users/kyle.gilbreath@databricks.com/ Testing out ETL with Designer',
      activity: 'viewed frequently',
      icon: <PipelineIcon />
    },
    {
      name: 'Untitled Notebook 2025-09-03 10:24:35',
      type: 'Notebook',
      path: '/Users/kyle.gilbreath@databricks.com/ Bug Bashing/Agent Mode',
      activity: 'edited 4 hours ago',
      icon: <CodeIcon />
    },
    {
      name: 'sample_text.sql',
      type: 'File',
      path: '/Users/kyle.gilbreath@databricks.com/ Testing out ETL with Designer/examples',
      activity: 'edited 5 hours ago',
      icon: <CodeIcon />
    },
    {
      name: 'Designer Test with Taxi Data',
      type: 'Query',
      path: '/Users/kyle.gilbreath@databricks.com',
      activity: 'viewed frequently',
      icon: <QueryIcon />
    },
    {
      name: 'New Query 2025-07-22 2:18pm',
      type: 'Query',
      path: '/Users/kyle.gilbreath@databricks.com/Drafts',
      activity: 'viewed frequently',
      icon: <QueryIcon />
    },
    {
      name: 'bug_bashing.sql',
      type: 'File',
      path: '/Users/kyle.gilbreath@databricks.com/ Testing out ETL with Designer/examples',
      activity: 'edited 5 days ago',
      icon: <CodeIcon />
    },
    {
      name: 'transform_by_example.sql',
      type: 'File',
      path: '/Users/kyle.gilbreath@databricks.com/ Testing out ETL with Designer/examples',
      activity: 'edited 5 days ago',
      icon: <CodeIcon />
    },
    {
      name: 'Untitled Notebook 2025-09-03 10:24:35',
      type: 'Notebook',
      path: '/Users/kyle.gilbreath@databricks.com/ Bug Bashing/Agent Mode',
      activity: 'viewed frequently',
      icon: <CodeIcon />
    },
    {
      name: 'Untitled Notebook 2025-09-03 09:05:28',
      type: 'Notebook',
      path: '/Users/kyle.gilbreath@databricks.com/ Bug Bashing/Agent Mode',
      activity: 'edited 6 days ago',
      icon: <CodeIcon />
    }
  ];

  const tabs = [
    { id: 'suggested', label: 'Suggested', icon: <HomeIcon /> },
    { id: 'favorites', label: 'Favorites', icon: <StarIcon /> },
    { id: 'popular', label: 'Popular', icon: <ChevronDownIcon /> },
    { id: 'mosaic', label: 'Mosaic AI', icon: <StarIcon /> },
    { id: 'whatsnew', label: "What's new", icon: <NewWindowIcon /> }
  ];

  const createNewItems = [
    {
      id: 'notebook',
      title: 'Notebook',
      description: 'Develop and run code',
      icon: <NotebookIcon />
    },
    {
      id: 'query',
      title: 'Query',
      description: 'Explore data with SQL',
      icon: <QueryIcon />
    },
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Visualize data',
      icon: <DashboardIcon />
    },
    {
      id: 'spreadsheet',
      title: 'Spreadsheet',
      description: 'Create and edit spreadsheets',
      icon: <TableIcon />
    }
  ];

  const moreItems = [
    { id: 'job', title: 'Job', icon: <GearIcon /> },
    { id: 'etl-pipeline', title: 'ETL pipeline', icon: <PipelineIcon /> },
    { id: 'alert', title: 'Alert', icon: <NotificationIcon /> },
    { id: 'experiment', title: 'Experiment', icon: <BeakerIcon /> },
    { id: 'model', title: 'Model', icon: <ModelsIcon /> },
    { id: 'app', title: 'App', icon: <RocketIcon /> }
  ];

  return (
    <DesignSystemProvider>
      <DesignSystemThemeProvider>
        <div className="agents-container">
          {/* Top Bar - Full Width */}
          <div className="top-bar">
            <div className="top-bar-left">
              <button 
                className="menu-button"
                onClick={toggleSidebar}
                aria-label="Toggle sidebar"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>
              <div className="logo">
                <div className="logo-icon">
                  <img 
                    src="/primary-lockup-full-color-rgb.svg" 
                    alt="Databricks" 
                    width="120" 
                    height="24"
                  />
                </div>
              </div>
            </div>
            <div className="top-bar-right">
              <button className="icon-button sparkle-button">
                <StarIcon />
              </button>
              <button className="icon-button user-avatar">
                <div className="avatar-circle">
                  <span className="avatar-text">A</span>
                </div>
              </button>
            </div>
          </div>

          {/* Main Layout */}
          <div className="main-layout">
            {/* Left Sidebar - Reuse from AgentsPage */}
            <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
              <div className="sidebar-section">
                <div className="new-button-container" ref={popoverRef}>
                  <button className="new-button" onClick={toggleNewPopover}>
                    <PlusIcon />
                    New
                  </button>
                  
                  {showNewPopover && (
                    <div className="new-popover">
                      <div className="popover-section">
                        <div className="section-header">Create new</div>
                        <div className="create-new-grid">
                          {createNewItems.map((item) => (
                            <div key={item.id} className="create-new-item" onClick={() => handleCreateNew(item.id)}>
                              <div className="item-icon-large">
                                {item.icon}
                              </div>
                              <div className="item-title">{item.title}</div>
                              <div className="item-description">{item.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="popover-divider"></div>
                      
                      <div className="popover-section">
                        <div className="more-items">
                          {moreItems.map((item) => (
                            <div key={item.id} className="more-item">
                              <div className="more-item-icon">
                                {item.icon}
                              </div>
                              <div className="more-item-title">{item.title}</div>
                            </div>
                          ))}
                          <div className="more-item">
                            <div className="more-item-title">More</div>
                            <ChevronDownIcon className="more-chevron" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="sidebar-section">
                <div className="nav-item">
                  <span className="nav-icon"><FolderIcon /></span>
                  <span className="nav-label">Workspace</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><ClockIcon /></span>
                  <span className="nav-label">Recents</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><CatalogIcon /></span>
                  <span className="nav-label">Catalog</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><SearchIcon /></span>
                  <span className="nav-label">Discover</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><WorkflowsIcon /></span>
                  <span className="nav-label">Jobs & Pipelines</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><CloudIcon /></span>
                  <span className="nav-label">Compute</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><StorefrontIcon /></span>
                  <span className="nav-label">Marketplace</span>
                </div>
              </div>

              <div className="sidebar-section">
                <div className="section-header">SQL</div>
                <div className="nav-item">
                  <span className="nav-icon"><CodeIcon /></span>
                  <span className="nav-label">SQL Editor</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><QueryIcon /></span>
                  <span className="nav-label">Queries</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><DashboardIcon /></span>
                  <span className="nav-label">Dashboards</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><CodeIcon /></span>
                  <span className="nav-label">Genie</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><NotificationIcon /></span>
                  <span className="nav-label">Alerts</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><HistoryIcon /></span>
                  <span className="nav-label">Query History</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><CloudDatabaseIcon /></span>
                  <span className="nav-label">SQL Warehouses</span>
                </div>
              </div>

              <div className="sidebar-section">
                <div className="section-header">Data Engineering</div>
                <div className="nav-item">
                  <span className="nav-icon"><LightningIcon /></span>
                  <span className="nav-label">Job Runs</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><IngestionIcon /></span>
                  <span className="nav-label">Data Ingestion</span>
                </div>
              </div>

              <div className="sidebar-section">
                <div className="section-header">Machine Learning</div>
                <div className="nav-item" onClick={() => handleNavigate('playground')}>
                  <span className="nav-icon"><CodeIcon /></span>
                  <span className="nav-label">Playground</span>
                </div>
                <div className="nav-item" onClick={() => handleNavigate('agents')}>
                  <span className="nav-icon"><UserIcon /></span>
                  <span className="nav-label">Agents Beta</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><BeakerIcon /></span>
                  <span className="nav-label">Experiments</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><TargetIcon /></span>
                  <span className="nav-label">Features</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><ModelsIcon /></span>
                  <span className="nav-label">Models</span>
                </div>
                <div className="nav-item">
                  <span className="nav-icon"><RocketIcon /></span>
                  <span className="nav-label">Serving</span>
                </div>
              </div>
            </div>

            {/* Main Content - HomePage specific content */}
            <div className="main-content">
              {/* Homepage Header */}
              <div className="homepage-header">
                <div className="header-left">
                  <div className="workspace-title">
                    <span className="dog-icon">🐕</span>
                    <span className="title-text">E2 Dogfood (confidential)</span>
                  </div>
                  <div className="powered-by">
                    powered by databricks
                  </div>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="filter-tabs">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'primary' : 'secondary'}
                    size="small"
                    onClick={() => setActiveTab(tab.id)}
                    className={`pill-button ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-label">{tab.label}</span>
                  </Button>
                ))}
              </div>

              {/* Recent Items Table */}
              <div className="recent-items-table">
                {recentItems.map((item, index) => (
                  <div key={index} className="table-row">
                    <div className="table-cell item-details">
                      <div className="item-icon">
                        {item.icon}
                      </div>
                      <div className="item-content">
                        <div className="item-name">{item.name}</div>
                        <div className="item-path">
                          {item.path}
                          {item.path.includes('Testing out ETL') && (
                            <span className="path-icon hash-icon">#</span>
                          )}
                          {item.path.includes('Bug Bashing') && (
                            <span className="path-icon bug-icon">🐛</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="table-cell item-activity">
                      {item.activity}
                    </div>
                    <div className="table-cell item-type">
                      {item.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Spreadsheet Source Modal */}
        <SpreadsheetSourceModal
          isOpen={showSpreadsheetModal}
          onClose={() => setShowSpreadsheetModal(false)}
          onSelect={handleSpreadsheetSourceSelect}
        />
      </DesignSystemThemeProvider>
    </DesignSystemProvider>
  );
};

export default HomePage;
