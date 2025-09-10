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
import Handsontable from 'handsontable';
import 'handsontable/styles/handsontable.min.css';
import 'handsontable/styles/ht-theme-main.min.css';
import SpreadsheetSourceModal from './components/SpreadsheetSourceModal';
import SQLQueryDrawer from './components/SQLQueryDrawer';
import './AgentsPage.css';
import './HomePage.css';
import './SpreadsheetPage.css';
import sampleData from './data/sampleData.json';
import sampleColumns from './data/columns.json';

const SpreadsheetPage = ({ onNavigate }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [tableName, setTableName] = useState('order_data');
  const [showNewPopover, setShowNewPopover] = useState(false);
  const [showSpreadsheetModal, setShowSpreadsheetModal] = useState(false);
  const [showSQLDrawer, setShowSQLDrawer] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(`SELECT 
    order_id,
    created_at,
    customer_email,
    total_price,
    country
FROM main.default.order_data
WHERE created_at >= '2025-09-01'
ORDER BY order_id DESC
LIMIT 1000;`);
  const popoverRef = useRef(null);
  const handsontableRef = useRef(null);
  const hotInstanceRef = useRef(null);

  // Initialize with imported sample data
  useEffect(() => {
    setTableData(sampleData);
    setColumns(sampleColumns);

    // Initialize Handsontable
    if (handsontableRef.current && !hotInstanceRef.current) {
      hotInstanceRef.current = new Handsontable(handsontableRef.current, {
        data: sampleData,
        colHeaders: sampleColumns.map(col => col.name),
        rowHeaders: true,
        width: '100%',
        height: 'auto',
        licenseKey: 'non-commercial-and-evaluation',
        themeName: 'ht-theme-main',
        contextMenu: true,
        copyPaste: true,
        fillHandle: true,
        undoRedo: true,
        columnSorting: true,
        filters: true,
        dropdownMenu: true,
        manualColumnResize: true,
        manualRowResize: true,
        stretchH: 'all',
        afterChange: (changes, source) => {
          if (source !== 'loadData') {
            setTableData(hotInstanceRef.current.getData());
          }
        },
        afterCreateRow: (index, amount) => {
          setTableData(hotInstanceRef.current.getData());
        },
        afterRemoveRow: (index, amount) => {
          setTableData(hotInstanceRef.current.getData());
        },
        afterCreateCol: (index, amount) => {
          const newColumns = [...columns];
          for (let i = 0; i < amount; i++) {
            newColumns.splice(index + i, 0, {
              id: `column_${Date.now()}_${i}`,
              name: `Column ${index + i + 1}`,
              type: 'text'
            });
          }
          setColumns(newColumns);
          setTableData(hotInstanceRef.current.getData());
        },
        afterRemoveCol: (index, amount) => {
          const newColumns = [...columns];
          newColumns.splice(index, amount);
          setColumns(newColumns);
          setTableData(hotInstanceRef.current.getData());
        }
      });
    }

    return () => {
      if (hotInstanceRef.current) {
        hotInstanceRef.current.destroy();
        hotInstanceRef.current = null;
      }
    };
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
      setShowSpreadsheetModal(true);
    }
    setShowNewPopover(false);
  };

  const handleSpreadsheetSourceSelect = (selection) => {
    console.log('Selected source:', selection);
    // Update table name and potentially reload data based on selection
    if (selection.type === 'table') {
      setTableName(selection.data.table);
       // Generate sample SQL query for the selected table
       const query = `SELECT *
FROM ${selection.data.fullPath}
WHERE created_at >= '2025-09-01'
ORDER BY order_id DESC
LIMIT 1000;`;
      setCurrentQuery(query);
    } else if (selection.type === 'query') {
      setTableName(selection.data.name);
      // Use a sample query for saved queries
      const query = `-- Saved Query: ${selection.data.name}
-- ${selection.data.description}

SELECT 
    order_id,
    created_at,
    customer_email,
    total_price,
    country,
    COUNT(*) as order_count,
    SUM(CAST(total_price AS DECIMAL)) as total_amount
FROM main.default.order_data
WHERE created_at >= '2025-09-01'
GROUP BY order_id, created_at, customer_email, total_price, country
HAVING COUNT(*) > 1
ORDER BY total_amount DESC;`;
      setCurrentQuery(query);
    }
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

  const addRow = () => {
    if (hotInstanceRef.current) {
      hotInstanceRef.current.alter('insert_row', hotInstanceRef.current.countRows());
    }
  };

  const addColumn = () => {
    if (hotInstanceRef.current) {
      hotInstanceRef.current.alter('insert_col', hotInstanceRef.current.countCols());
    }
  };

  const undoAction = () => {
    if (hotInstanceRef.current) {
      hotInstanceRef.current.undo();
    }
  };

  const redoAction = () => {
    if (hotInstanceRef.current) {
      hotInstanceRef.current.redo();
    }
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
        <div className={`agents-container ${showSQLDrawer ? 'drawer-open' : ''}`}>
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

            {/* Main Content with Drawer Layout */}
            <div className="content-with-drawer">
              {/* Spreadsheet Content */}
              <div className={`main-content spreadsheet-content ${showSQLDrawer ? 'drawer-open' : ''}`}>
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
                    <button className="action-button" onClick={undoAction}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                        <path d="M21 3v5h-5"></path>
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                        <path d="M3 21v-5h5"></path>
                      </svg>
                      Undo
                    </button>
                    <button className="action-button" onClick={redoAction}>
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
                    <button className="action-button" onClick={() => setShowSQLDrawer(true)}>
                      <CodeIcon />
                      View SQL
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

                {/* Handsontable Container */}
                <div className="spreadsheet-table-container">
                  <div ref={handsontableRef} className="handsontable-container"></div>
                </div>

                {/* Add Row Button */}
                <div className="add-row-container">
                  <button className="add-row-btn" onClick={addRow}>
                    + Add row
                  </button>
                </div>
              </div>

              {/* SQL Query Drawer */}
              <SQLQueryDrawer
                isOpen={showSQLDrawer}
                onClose={() => setShowSQLDrawer(false)}
                query={currentQuery}
                tableName={tableName}
              />
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

export default SpreadsheetPage;
