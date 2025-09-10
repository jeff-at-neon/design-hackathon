import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  DesignSystemProvider,
  DesignSystemThemeProvider,
  PlusIcon,
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
import './AgentsPage.css';
import './HomePage.css';
import './SpreadsheetPage.css';

const SpreadsheetPage = ({ onNavigate }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [editingCell, setEditingCell] = useState(null);
  const [tableName, setTableName] = useState('merchant_payment_data');
  const [showNewPopover, setShowNewPopover] = useState(false);
  const popoverRef = useRef(null);

  // Initialize with sample data similar to the Handsontable demo
  useEffect(() => {
    const sampleData = [
      ['20034594130', 'Crossfit_Hanna', 'NexPay', '2023', '16'],
      ['36926127356', 'Belles_cookbook_store', 'GlobalCard', '2023', '23'],
      ['31114608278', 'Golfclub_Baron_Friso', 'SwiftCharge', '2023', '4'],
      ['45678912345', 'Martinis_Fine_Steakhouse', 'TransactPlus', '2023', '3'],
      ['78912345678', 'Rafa_Al', 'NexPay', '2023', '17'],
      ['12345678901', 'Tech_Startup_Co', 'GlobalCard', '2023', '8'],
      ['98765432109', 'Coffee_Bean_Corner', 'SwiftCharge', '2023', '6'],
      ['55566677788', 'Fashion_Boutique', 'TransactPlus', '2023', '20'],
      ['11122233344', 'Bookstore_Plus', 'NexPay', '2023', '22'],
      ['99988877766', 'Gym_Fitness_Center', 'GlobalCard', '2023', '21']
    ];

    const sampleColumns = [
      { id: 'psp_reference', name: 'psp_reference', type: 'text' },
      { id: 'merchant', name: 'merchant', type: 'text' },
      { id: 'card_scheme', name: 'card_scheme', type: 'text' },
      { id: 'year', name: 'year', type: 'text' },
      { id: 'hour', name: 'hour', type: 'text' }
    ];

    setTableData(sampleData);
    setColumns(sampleColumns);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleNavigate = (page) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleCreateNew = (itemId) => {
    if (itemId === 'spreadsheet') {
      handleNavigate('spreadsheet');
    }
    setShowNewPopover(false);
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCellClick = (rowIndex, colIndex) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
  };

  const handleCellDoubleClick = (rowIndex, colIndex) => {
    setEditingCell({ row: rowIndex, col: colIndex });
  };

  const handleCellEdit = (rowIndex, colIndex, value) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = value;
    setTableData(newData);
    setEditingCell(null);
  };

  const addRow = () => {
    const newRow = columns.map(() => '');
    setTableData([...tableData, newRow]);
  };

  const addColumn = () => {
    const newColumnName = `column_${columns.length + 1}`;
    const newColumns = [...columns, { id: newColumnName, name: newColumnName, type: 'text' }];
    setColumns(newColumns);
    
    const newData = tableData.map(row => [...row, '']);
    setTableData(newData);
  };

  const deleteRow = (rowIndex) => {
    const newData = tableData.filter((_, index) => index !== rowIndex);
    setTableData(newData);
  };

  const deleteColumn = (colIndex) => {
    const newColumns = columns.filter((_, index) => index !== colIndex);
    setColumns(newColumns);
    
    const newData = tableData.map(row => row.filter((_, index) => index !== colIndex));
    setTableData(newData);
  };

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
          {/* Top Bar */}
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
            {/* Left Sidebar - Reuse from HomePage */}
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
                <div className="nav-item" onClick={() => handleNavigate('home')}>
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

            {/* Main Content - Spreadsheet */}
            <div className="main-content spreadsheet-content">
              {/* Spreadsheet Header */}
              <div className="spreadsheet-header">
                <div className="spreadsheet-title">
                  <input
                    type="text"
                    value={tableName}
                    onChange={(e) => setTableName(e.target.value)}
                    className="table-name-input"
                  />
                </div>
                <div className="spreadsheet-actions">
                  <button className="action-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                      <path d="M21 3v5h-5"></path>
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                      <path d="M3 21v-5h5"></path>
                    </svg>
                    Undo
                  </button>
                  <button className="action-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                      <path d="M3 21v-5h5"></path>
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                      <path d="M21 3v5h-5"></path>
                    </svg>
                    Redo
                  </button>
                  <button className="action-button enrich-button">
                    <LightningIcon />
                    Enrich
                  </button>
                  <button className="action-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16,6 12,2 8,6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                    Share
                  </button>
                </div>
              </div>

              <div className="select-cell-indicator">Select cell</div>

              {/* Spreadsheet Table */}
              <div className="spreadsheet-table-container">
                <table className="spreadsheet-table">
                  <thead>
                    <tr className="table-header-row">
                      <th className="row-number-header"></th>
                      <th className="checkbox-header">
                        <input type="checkbox" />
                      </th>
                      {columns.map((column, index) => (
                        <th key={column.id} className="column-header">
                          <div className="column-header-content">
                            <span className="column-name">{column.name}</span>
                            <div className="column-actions">
                              <button className="column-action-btn">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"></polygon>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </th>
                      ))}
                      <th className="add-column-header">
                        <button className="add-column-btn" onClick={addColumn}>
                          + Add column
                        </button>
                      </th>
                    </tr>
                    <tr className="filter-row">
                      <td className="filter-cell"></td>
                      <td className="filter-cell"></td>
                      {columns.map((column, index) => (
                        <td key={column.id} className="filter-cell">
                          <div className="filter-controls">
                            <button className="filter-btn">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46 22,3"></polygon>
                              </svg>
                            </button>
                            <button className="sort-btn">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                              </svg>
                            </button>
                            <button className="grid-btn">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="7" height="7"></rect>
                                <rect x="14" y="3" width="7" height="7"></rect>
                                <rect x="14" y="14" width="7" height="7"></rect>
                                <rect x="3" y="14" width="7" height="7"></rect>
                              </svg>
                            </button>
                            <button className="search-btn">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      ))}
                      <td className="filter-cell"></td>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, rowIndex) => (
                      <tr key={rowIndex} className={`data-row ${selectedCell.row === rowIndex ? 'selected-row' : ''}`}>
                        <td className="row-number">{rowIndex + 1}</td>
                        <td className="row-checkbox">
                          <input type="checkbox" />
                        </td>
                        {row.map((cell, colIndex) => (
                          <td
                            key={colIndex}
                            className={`data-cell ${selectedCell.row === rowIndex && selectedCell.col === colIndex ? 'selected-cell' : ''}`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            onDoubleClick={() => handleCellDoubleClick(rowIndex, colIndex)}
                          >
                            {editingCell && editingCell.row === rowIndex && editingCell.col === colIndex ? (
                              <input
                                type="text"
                                value={cell}
                                onChange={(e) => handleCellEdit(rowIndex, colIndex, e.target.value)}
                                onBlur={() => setEditingCell(null)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    setEditingCell(null);
                                  }
                                }}
                                autoFocus
                                className="cell-input"
                              />
                            ) : (
                              <span className="cell-content">{cell}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Row Button */}
              <div className="add-row-container">
                <button className="add-row-btn" onClick={addRow}>
                  + Add row
                </button>
              </div>
            </div>
          </div>
        </div>
      </DesignSystemThemeProvider>
    </DesignSystemProvider>
  );
};

export default SpreadsheetPage;
