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

const SpreadsheetPage = ({ onNavigate }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sheets, setSheets] = useState([]);
  const [activeSheetId, setActiveSheetId] = useState(null);
  const [tableName, setTableName] = useState('merchant_payment_data');
  const [showNewPopover, setShowNewPopover] = useState(false);
  const [showSpreadsheetModal, setShowSpreadsheetModal] = useState(false);
  const [showSQLDrawer, setShowSQLDrawer] = useState(false);
  const [currentQuery, setCurrentQuery] = useState(`SELECT 
    psp_reference,
    merchant,
    card_scheme,
    year,
    hour
FROM main.default.merchant_payment_data
WHERE year >= 2023
ORDER BY psp_reference DESC
LIMIT 1000;`);
  const [showShareModal, setShowShareModal] = useState(false);
  const [editingSheetId, setEditingSheetId] = useState(null);
  const [editingSheetName, setEditingSheetName] = useState('');
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [timeFilterStart, setTimeFilterStart] = useState('');
  const [timeFilterEnd, setTimeFilterEnd] = useState('');
  const popoverRef = useRef(null);
  const handsontableRef = useRef(null);
  const hotInstanceRef = useRef(null);

  // Initialize with sample data and create initial sheets
  useEffect(() => {
    const sampleData = [
      ['20034594130', 'Crossfit_Hanna', 'NexPay', '2023', '16', '2024-01-15 14:30:25'],
      ['36926127356', 'Belles_cookbook_store', 'GlobalCard', '2023', '23', '2024-01-15 15:45:12'],
      ['31114608278', 'Golfclub_Baron_Friso', 'SwiftCharge', '2023', '4', '2024-01-16 09:20:45'],
      ['45678912345', 'Martinis_Fine_Steakhouse', 'TransactPlus', '2023', '3', '2024-01-16 12:15:30'],
      ['78912345678', 'Rafa_Al', 'NexPay', '2023', '17', '2024-01-17 08:30:15'],
      ['12345678901', 'Tech_Startup_Co', 'GlobalCard', '2023', '8', '2024-01-17 11:45:22'],
      ['98765432109', 'Coffee_Bean_Corner', 'SwiftCharge', '2023', '6', '2024-01-18 13:20:18'],
      ['55566677788', 'Fashion_Boutique', 'TransactPlus', '2023', '20', '2024-01-18 16:30:45'],
      ['11122233344', 'Bookstore_Plus', 'NexPay', '2023', '22', '2024-01-19 10:15:33'],
      ['99988877766', 'Gym_Fitness_Center', 'GlobalCard', '2023', '21', '2024-01-19 14:45:27']
    ];

    const sampleColumns = [
      { id: 'psp_reference', name: 'psp_reference', type: 'text' },
      { id: 'merchant', name: 'merchant', type: 'text' },
      { id: 'card_scheme', name: 'card_scheme', type: 'text' },
      { id: 'year', name: 'year', type: 'text' },
      { id: 'hour', name: 'hour', type: 'text' },
      { id: 'timestamp', name: 'timestamp', type: 'datetime' }
    ];

    // Create initial sheets
    const initialSheets = [
      {
        id: 'sheet-1',
        name: 'Sheet1',
        data: sampleData,
        columns: sampleColumns,
        formulas: {}
      },
      {
        id: 'sheet-2',
        name: 'Sheet2',
        data: [
          ['', '', '', '', '', ''],
          ['', '', '', '', '', ''],
          ['', '', '', '', '', ''],
          ['', '', '', '', '', ''],
          ['', '', '', '', '', '']
        ],
        columns: [
          { id: 'col_1', name: 'A', type: 'text' },
          { id: 'col_2', name: 'B', type: 'text' },
          { id: 'col_3', name: 'C', type: 'text' },
          { id: 'col_4', name: 'D', type: 'text' },
          { id: 'col_5', name: 'E', type: 'text' },
          { id: 'col_6', name: 'F', type: 'datetime' }
        ],
        formulas: {}
      }
    ];

    setSheets(initialSheets);
    setActiveSheetId('sheet-1');

    // Initialize Handsontable with the first sheet
    if (handsontableRef.current && !hotInstanceRef.current) {
      initializeHandsontable(initialSheets[0]);
    }

    return () => {
      if (hotInstanceRef.current) {
        hotInstanceRef.current.destroy();
        hotInstanceRef.current = null;
      }
    };
  }, []);

  // Helper function to initialize Handsontable
  const initializeHandsontable = (sheet) => {
    if (hotInstanceRef.current) {
      hotInstanceRef.current.destroy();
    }

    hotInstanceRef.current = new Handsontable(handsontableRef.current, {
      data: sheet.data,
      colHeaders: sheet.columns.map(col => col.name),
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
      columns: sheet.columns.map(col => ({
        data: col.data,
        type: col.type === 'datetime' ? 'date' : 'text',
        dateFormat: col.type === 'datetime' ? 'YYYY-MM-DD HH:mm:ss' : undefined,
        filter: col.type === 'datetime' ? 'date' : 'text'
      })),
      formulas: {
        engine: 'hyperformula',
        sheetReferences: sheets.reduce((acc, s) => {
          acc[s.name] = s.data;
          return acc;
        }, {})
      },
      afterChange: (changes, source) => {
        if (source !== 'loadData') {
          updateSheetData(activeSheetId, hotInstanceRef.current.getData());
        }
      },
      afterCreateRow: (index, amount) => {
        updateSheetData(activeSheetId, hotInstanceRef.current.getData());
      },
      afterRemoveRow: (index, amount) => {
        updateSheetData(activeSheetId, hotInstanceRef.current.getData());
      },
      afterCreateCol: (index, amount) => {
        const activeSheet = sheets.find(s => s.id === activeSheetId);
        if (activeSheet) {
          const newColumns = [...activeSheet.columns];
          for (let i = 0; i < amount; i++) {
            newColumns.splice(index + i, 0, {
              id: `column_${Date.now()}_${i}`,
              name: `Column ${index + i + 1}`,
              type: 'text'
            });
          }
          updateSheetColumns(activeSheetId, newColumns);
          updateSheetData(activeSheetId, hotInstanceRef.current.getData());
        }
      },
      afterRemoveCol: (index, amount) => {
        const activeSheet = sheets.find(s => s.id === activeSheetId);
        if (activeSheet) {
          const newColumns = [...activeSheet.columns];
          newColumns.splice(index, amount);
          updateSheetColumns(activeSheetId, newColumns);
          updateSheetData(activeSheetId, hotInstanceRef.current.getData());
        }
      }
    });
  };

  // Helper functions for sheet management
  const updateSheetData = (sheetId, data) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === sheetId ? { ...sheet, data } : sheet
      )
    );
  };

  const updateSheetColumns = (sheetId, columns) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === sheetId ? { ...sheet, columns } : sheet
      )
    );
  };

  const addNewSheet = () => {
    const newSheetId = `sheet-${Date.now()}`;
    const newSheet = {
      id: newSheetId,
      name: `Sheet${sheets.length + 1}`,
      data: [
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', ''],
        ['', '', '', '', '', '']
      ],
      columns: [
        { id: 'col_1', name: 'A', type: 'text' },
        { id: 'col_2', name: 'B', type: 'text' },
        { id: 'col_3', name: 'C', type: 'text' },
        { id: 'col_4', name: 'D', type: 'text' },
        { id: 'col_5', name: 'E', type: 'text' },
        { id: 'col_6', name: 'F', type: 'datetime' }
      ],
      formulas: {}
    };
    
    setSheets(prevSheets => [...prevSheets, newSheet]);
    setActiveSheetId(newSheetId);
    
    // Reinitialize Handsontable with new sheet
    setTimeout(() => {
      initializeHandsontable(newSheet);
    }, 100);
  };

  const switchToSheet = (sheetId) => {
    const sheet = sheets.find(s => s.id === sheetId);
    if (sheet) {
      setActiveSheetId(sheetId);
      setTimeout(() => {
        initializeHandsontable(sheet);
      }, 100);
    }
  };

  const renameSheet = (sheetId, newName) => {
    setSheets(prevSheets => 
      prevSheets.map(sheet => 
        sheet.id === sheetId ? { ...sheet, name: newName } : sheet
      )
    );
  };

  const startRenamingSheet = (sheetId, currentName) => {
    setEditingSheetId(sheetId);
    setEditingSheetName(currentName);
  };

  const finishRenamingSheet = () => {
    if (editingSheetId && editingSheetName.trim()) {
      renameSheet(editingSheetId, editingSheetName.trim());
    }
    setEditingSheetId(null);
    setEditingSheetName('');
  };

  const cancelRenamingSheet = () => {
    setEditingSheetId(null);
    setEditingSheetName('');
  };

  const handleSheetNameKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishRenamingSheet();
    } else if (e.key === 'Escape') {
      cancelRenamingSheet();
    }
  };


  const clearTimeFilter = () => {
    // Reset to original data (you might want to store original data separately)
    const activeSheet = sheets.find(s => s.id === activeSheetId);
    if (activeSheet) {
      // For now, we'll reinitialize with sample data
      // In a real app, you'd want to store the original unfiltered data
      const sampleData = [
        ['20034594130', 'Crossfit_Hanna', 'NexPay', '2023', '16', '2024-01-15 14:30:25'],
        ['36926127356', 'Belles_cookbook_store', 'GlobalCard', '2023', '23', '2024-01-15 15:45:12'],
        ['31114608278', 'Golfclub_Baron_Friso', 'SwiftCharge', '2023', '4', '2024-01-16 09:20:45'],
        ['45678912345', 'Martinis_Fine_Steakhouse', 'TransactPlus', '2023', '3', '2024-01-16 12:15:30'],
        ['78912345678', 'Rafa_Al', 'NexPay', '2023', '17', '2024-01-17 08:30:15'],
        ['12345678901', 'Tech_Startup_Co', 'GlobalCard', '2023', '8', '2024-01-17 11:45:22'],
        ['98765432109', 'Coffee_Bean_Corner', 'SwiftCharge', '2023', '6', '2024-01-18 13:20:18'],
        ['55566677788', 'Fashion_Boutique', 'TransactPlus', '2023', '20', '2024-01-18 16:30:45'],
        ['11122233344', 'Bookstore_Plus', 'NexPay', '2023', '22', '2024-01-19 10:15:33'],
        ['99988877766', 'Gym_Fitness_Center', 'GlobalCard', '2023', '21', '2024-01-19 14:45:27']
      ];
      updateSheetData(activeSheetId, sampleData);
    }
    setTimeFilterStart('');
    setTimeFilterEnd('');
    setShowTimeFilter(false);
  };

  const deleteSheet = (sheetId) => {
    if (sheets.length <= 1) return; // Don't delete the last sheet
    
    setSheets(prevSheets => prevSheets.filter(sheet => sheet.id !== sheetId));
    
    // Switch to first remaining sheet
    const remainingSheets = sheets.filter(sheet => sheet.id !== sheetId);
    if (remainingSheets.length > 0) {
      switchToSheet(remainingSheets[0].id);
    }
  };

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
WHERE year >= 2023
ORDER BY psp_reference DESC
LIMIT 1000;`;
      setCurrentQuery(query);
    } else if (selection.type === 'query') {
      setTableName(selection.data.name);
      // Use a sample query for saved queries
      const query = `-- Saved Query: ${selection.data.name}
-- ${selection.data.description}

SELECT 
    psp_reference,
    merchant,
    card_scheme,
    year,
    hour,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount
FROM main.default.merchant_payment_data
WHERE year = 2023
GROUP BY psp_reference, merchant, card_scheme, year, hour
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
                    <button className="action-button" onClick={() => setShowShareModal(true)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                        <polyline points="16,6 12,2 8,6"></polyline>
                        <line x1="12" y1="2" x2="12" y2="15"></line>
                      </svg>
                      Share
                    </button>
                  </div>
                </div>

                {/* Sheet Tabs */}
                <div className="sheet-tabs-container">
                  <div className="sheet-tabs">
                    {sheets.map((sheet) => (
                      <div
                        key={sheet.id}
                        className={`sheet-tab ${activeSheetId === sheet.id ? 'active' : ''}`}
                        onClick={() => switchToSheet(sheet.id)}
                      >
                        {editingSheetId === sheet.id ? (
                          <input
                            type="text"
                            value={editingSheetName}
                            onChange={(e) => setEditingSheetName(e.target.value)}
                            onBlur={finishRenamingSheet}
                            onKeyDown={handleSheetNameKeyDown}
                            className="sheet-tab-input"
                            autoFocus
                          />
                        ) : (
                          <span 
                            className="sheet-tab-name"
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              startRenamingSheet(sheet.id, sheet.name);
                            }}
                          >
                            {sheet.name}
                          </span>
                        )}
                        {sheets.length > 1 && (
                          <button
                            className="sheet-tab-close"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSheet(sheet.id);
                            }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button className="add-sheet-btn" onClick={addNewSheet}>
                      <PlusIcon />
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

        {/* Share Modal */}
        {showShareModal && (
          <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
            <div className="share-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">Sharing: {tableName}</h2>
                <button 
                  className="modal-close" 
                  onClick={() => setShowShareModal(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-content">
                <p className="permission-info">
                  Do you want information about permission levels? <a href="#" className="learn-more-link">Learn more</a>
                </p>
                
                <div className="add-users-section">
                  <input
                    type="text"
                    placeholder="Type to add multiple users, groups or service principals"
                    className="add-users-input"
                  />
                </div>
                
                <div className="people-with-access">
                  <h3 className="section-title">People with access</h3>
                  
                  <div className="access-list">
                    <div className="access-item">
                      <div className="user-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <span className="user-email">kyle.gilbreath@databricks.com</span>
                      <span className="permission-level">Can Manage (inherited)</span>
                    </div>
                    
                    <div className="access-item">
                      <div className="group-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                      </div>
                      <span className="group-name">Admins</span>
                      <span className="permission-level">Can Manage (inherited)</span>
                    </div>
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button className="copy-link-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    Copy link
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </DesignSystemThemeProvider>
    </DesignSystemProvider>
  );
};

export default SpreadsheetPage;
