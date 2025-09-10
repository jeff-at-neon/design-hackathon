import React, { useState } from 'react';
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
  InfoIcon,
  OverflowIcon,
  SendIcon,
  WrenchIcon,
  UserIcon,
  ChevronDownIcon,
  StarIcon,
  NewWindowIcon,
  Card,
  Typography,
  Table,
  TableRow,
  TableCell,
  TableHeader,
  Checkbox,
  Tag
} from '@databricks/design-system';
import '@databricks/design-system/dist/index.css';
import './AgentsPage.css';
import { CustomSimpleSelect, CustomSimpleSelectOption } from './components/CustomSimpleSelect';

const AgentsPage = ({ onNavigate }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isUseCaseExpanded, setIsUseCaseExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [ownedByMe, setOwnedByMe] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavigate = (view) => {
    if (onNavigate) {
      onNavigate(view);
    }
  };

  const useCases = [
    {
      id: 'information-extraction',
      title: 'Information Extraction',
      description: 'Extract key information, classify content, or summarize text from documents into a structured JSON.',
      icon: <UserIcon />,
      hasPdfOption: true
    },
    {
      id: 'custom-llm',
      title: 'Custom LLM',
      description: 'Specialize an LLM endpoint to perform custom text tasks (i.e. content generation, chat) aligned within your domain-specific guidelines.',
      icon: <UserIcon />,
      hasPdfOption: true
    },
    {
      id: 'knowledge-assistant',
      title: 'Knowledge Assistant',
      description: 'Turn your docs into an expert AI chatbot.',
      icon: <UserIcon />,
      hasPdfOption: false
    },
    {
      id: 'multi-agent-supervisor',
      title: 'Multi-Agent Supervisor',
      description: 'Design an AI system that brings Genie Spaces and Agents together.',
      icon: <UserIcon />,
      hasPdfOption: false
    }
  ];

  const agents = [
    {
      name: 'ka_release_test_20250810_162550_zGix',
      problemType: 'Knowledge Assistant',
      endpoint: 'ka-c242558a-endp...',
      lastModified: 'August 10, 2025 9:28 AM'
    },
    {
      name: 'Release-Test-og-_vdei6y_2025_08_10_07_38_42',
      problemType: 'Information Extraction',
      endpoint: 'kie-d15d0a50-endp...',
      lastModified: 'August 10, 2025 12:39 AM'
    },
    {
      name: 'Release-Test-og-_53wmmg_2025_08_10_07_37_02',
      problemType: 'Information Extraction',
      endpoint: 'kie-7c68b48a-endp...',
      lastModified: 'August 10, 2025 12:37 AM'
    },
    {
      name: 'Release-Test-og-_0hx2pz_2025_08_10_07_22_51',
      problemType: 'Information Extraction',
      endpoint: 'kie-4531d590-endp...',
      lastModified: 'August 10, 2025 12:23 AM'
    },
    {
      name: 'Release-Test-og-_5zc94q_2025_08_10_07_18_43',
      problemType: 'Information Extraction',
      endpoint: 'kie-0144ca1e-endp...',
      lastModified: 'August 10, 2025 12:19 AM'
    },
    {
      name: 'Release-Test-og-_hf38oc_2025_08_10_07_09_54',
      problemType: 'Information Extraction',
      endpoint: 'kie-d558b97c-endp...',
      lastModified: 'August 10, 2025 12:10 AM'
    },
    {
      name: 'Release-Test-og-_yssasn_2025_08_10_07_04_38',
      problemType: 'Information Extraction',
      endpoint: 'kie-23a22f79-endp...',
      lastModified: 'August 10, 2025 12:06 AM'
    },
    {
      name: 'custom-llm-2025-08-09-16-30-10',
      problemType: 'Custom LLM',
      endpoint: 't2t-b0d0f408-endp...',
      lastModified: 'August 9, 2025 4:30 PM'
    },
    {
      name: 'custom-llm-2025-08-09-16-25-00',
      problemType: 'Custom LLM',
      endpoint: 't2t-e556fd7d-endp...',
      lastModified: 'August 9, 2025 4:27 PM'
    },
    {
      name: 'custom-llm-2025-08-09-16-10-48',
      problemType: 'Custom LLM',
      endpoint: 't2t-2de35b85-endp...',
      lastModified: 'August 9, 2025 4:24 PM'
    },
    {
      name: 'ka_release_test_20250809_230606_XP52',
      problemType: 'Knowledge Assistant',
      endpoint: 'ka-5b28a480-endp...',
      lastModified: 'August 9, 2025 4:06 PM'
    },
    {
      name: 'smurching-test-multiagent',
      problemType: 'Multi-Agent Supervisor',
      endpoint: 'mas-df260241-end...',
      lastModified: 'August 9, 2025 3:19 PM'
    },
    {
      name: 'Release-Test-og-_s1ohm0_2025_08_09_08_04_12',
      problemType: 'Information Extraction',
      endpoint: 'kie-a9e04e0d-endp...',
      lastModified: 'August 9, 2025 1:04 AM'
    }
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.problemType.toLowerCase().includes(searchTerm.toLowerCase());
    
    // If no filter is selected (empty string), show all agents
    const matchesFilter = filterType === '' || agent.problemType === filterType;
    
    return matchesSearch && matchesFilter;
  });

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
            <div className="search-container">
                <div className="search-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for data, notebooks, and more..."
                  className="search-input"
                />
                <span className="search-shortcut">⌘ + P</span>
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
            {/* Left Sidebar */}
            <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
              <div className="sidebar-section">
                <button className="new-button">
                  <PlusIcon />
                  New
                </button>
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
                <div className="nav-item active">
                  <span className="nav-icon"><UserIcon /></span>
                  <span className="nav-label">Agents</span>
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

            {/* Main Content */}
            <div className="main-content">
              {/* Agents Content */}
              <div className="agents-content">
                {/* Header */}
                <div className="agents-header">
                  <div className="header-left">
                    <h4 className="agents-title">Agents</h4>
                    <Button
                      type="link"
                      onClick={() => window.open('https://example.com/feedback', '_blank')}
                      style={{ marginLeft: '8px' }}
                    >
                      Provide feedback <span style={{ marginLeft: '4px' }}><NewWindowIcon /></span>
                    </Button>
                  </div>
                  <div className="header-actions">
                    <Button 
                      type="primary" 
                      componentId="create-agent-button"
                      icon={<PlusIcon />}
                    >
                      Create Agent
                    </Button>
                  </div>
                </div>

                {/* Choose Your Use Case Section */}
                <div className="use-case-section">
                  <button 
                    className="use-case-header"
                    onClick={() => setIsUseCaseExpanded(!isUseCaseExpanded)}
                  >
                    <ChevronDownIcon className={`chevron ${isUseCaseExpanded ? 'expanded' : ''}`} />
                    <Typography variant="body" weight="semibold">Choose your use case</Typography>
                  </button>
                  
                  {isUseCaseExpanded && (
                    <div className="use-case-grid">
                      {useCases.map((useCase) => (
                        <Card key={useCase.id} className="use-case-card">
                          <div className="use-case-content">
                            <div className="use-case-header-row">
                              <div className="use-case-icon">
                                {useCase.icon}
                              </div>
                              <Typography variant="body" weight="semibold" className="use-case-title">
                                {useCase.title}
                              </Typography>
                            </div>
                            <Typography variant="body" className="use-case-description">
                              {useCase.description}
                            </Typography>
                            <div className="use-case-actions">
                              {useCase.hasPdfOption && (
                                <Button type="secondary" size="small">
                                  Use PDFs
                                </Button>
                              )}
                              <Button type="primary" size="small">
                                Build
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Agents Table Section */}
                <div className="agents-table-section">
                  <div className="table-controls">
                    <div className="search-container">
                      <SearchIcon className="search-icon" />
                      <input 
                        type="text" 
                        placeholder="Search" 
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="filter-container">
                      <CustomSimpleSelect
                        value={filterType}
                        onChange={(e) => {
                          setFilterType(e.target.value);
                        }}
                        placeholder="Filter by problem type"
                        width={200}
                      >
                        <CustomSimpleSelectOption value="Knowledge Assistant">Knowledge Assistant</CustomSimpleSelectOption>
                        <CustomSimpleSelectOption value="Information Extraction">Information Extraction</CustomSimpleSelectOption>
                        <CustomSimpleSelectOption value="Custom LLM">Custom LLM</CustomSimpleSelectOption>
                        <CustomSimpleSelectOption value="Multi-Agent Supervisor">Multi-Agent Supervisor</CustomSimpleSelectOption>
                      </CustomSimpleSelect>
                    </div>
                    <div className="checkbox-container">
                      <Checkbox
                        checked={ownedByMe}
                        onChange={(checked) => setOwnedByMe(checked)}
                      />
                      <span>Owned by me</span>
                    </div>
                  </div>

                  <div className="table-container">
                    <Table>
                      <TableRow isHeader>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>Problem type</TableHeader>
                        <TableHeader>Endpoint</TableHeader>
                        <TableHeader>
                          Last modified
                          <ChevronDownIcon className="sort-icon" />
                        </TableHeader>
                      </TableRow>
                      {filteredAgents.map((agent, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <a href="#" className="agent-name">{agent.name}</a>
                          </TableCell>
                          <TableCell>
                            <Tag variant="primary">{agent.problemType}</Tag>
                          </TableCell>
                          <TableCell>{agent.endpoint}</TableCell>
                          <TableCell>{agent.lastModified}</TableCell>
                        </TableRow>
                      ))}
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DesignSystemThemeProvider>
    </DesignSystemProvider>
  );
};

export default AgentsPage; 