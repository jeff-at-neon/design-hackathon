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
import AggregateDataModal from './components/AggregateDataModal';
import TimeRangeFilterModal from './components/TimeRangeFilterModal';
import ShareModal from './components/ShareModal';
import './AgentsPage.css';
import './HomePage.css';
import './SpreadsheetPage.css';
import sampleData from './data/sampleData.json';
import sampleColumns from './data/columns.json';
import aggregatedData from './data/aggregated/aggregated_sept.json';
import aggregatedColumns from './data/aggregated/columns.json';

const SpreadsheetPage = ({ onNavigate }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sheets, setSheets] = useState([]);
  const [activeSheetId, setActiveSheetId] = useState(null);
  const [tableName, setTableName] = useState('order_data');
  const [showNewPopover, setShowNewPopover] = useState(false);
  const [showSpreadsheetModal, setShowSpreadsheetModal] = useState(false);
  const [showSQLDrawer, setShowSQLDrawer] = useState(false);
  const [showAggregateModal, setShowAggregateModal] = useState(false);
  const [aggregateColumn, setAggregateColumn] = useState('');
  const [showTimeRangeModal, setShowTimeRangeModal] = useState(false);
  const [timeRangeColumn, setTimeRangeColumn] = useState('');
  const [timeRangeColumnIndex, setTimeRangeColumnIndex] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
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
  const [editingSheetId, setEditingSheetId] = useState(null);
  const [editingSheetName, setEditingSheetName] = useState('');
  const popoverRef = useRef(null);
  const handsontableRef = useRef(null);
  const hotInstanceRef = useRef(null);

  // Initialize with sample data and create initial sheets
  useEffect(() => {
    // Create initial sheets
    const initialSheets = [
      {
        id: 'sheet-1',
        name: tableName,
        data: sampleData,
        columns: sampleColumns
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

  // Update page title when active sheet changes
  useEffect(() => {
    if (activeSheetId && sheets.length > 0) {
      const activeSheet = sheets.find(s => s.id === activeSheetId);
      if (activeSheet) {
        setTableName(activeSheet.name);
      }
    }
  }, [activeSheetId, sheets]);

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
      dropdownMenu: {
        items: {
          'aggregate_data': {
            name: 'Aggregate data',
            callback: function(key, selection, clickEvent) {
              const column = selection[0].start.col;
              // Get column name from the sheet's columns array
              const columnName = sheet.columns?.[column]?.name || `Column ${column + 1}`;
              handleColumnAggregate(columnName);
            }
          },
          'filter_by_time_range': {
            name: 'Filter by time range',
            callback: function(key, selection, clickEvent) {
              const column = selection[0].start.col;
              handleTimeRangeFilter(column);
            }
          },
          'filter_by_condition': {},
          'filter_operators': {},
          'filter_by_condition2': {},
          'filter_by_value': {},
          'filter_action_bar': {}
        }
      },
      manualColumnResize: true,
      manualRowResize: true,
      stretchH: 'all',
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
    const newSheetName = `Sheet${sheets.length + 1}`;
    const newSheet = {
      id: newSheetId,
      name: newSheetName,
      data: Array(10).fill().map(() => Array(5).fill('')),
      columns: [
        { id: 'col_1', name: 'A', type: 'text' },
        { id: 'col_2', name: 'B', type: 'text' },
        { id: 'col_3', name: 'C', type: 'text' },
        { id: 'col_4', name: 'D', type: 'text' },
        { id: 'col_5', name: 'E', type: 'text' }
      ]
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

  const handleColumnAggregate = (columnName) => {
    setAggregateColumn(columnName);
    setShowAggregateModal(true);
  };

  const handleTimeRangeFilter = (columnIndex) => {
    // Get the active sheet and column info
    const activeSheet = sheets.find(s => s.id === activeSheetId);
    const columnName = activeSheet?.columns[columnIndex]?.name || `Column ${columnIndex + 1}`;
    
    // Set the column info and show the modal
    setTimeRangeColumn(columnName);
    setTimeRangeColumnIndex(columnIndex);
    setShowTimeRangeModal(true);
  };

  const handleApplyTimeRangeFilter = (filterConfig) => {
    const { startDate, endDate } = filterConfig;
    
    if (startDate && endDate && hotInstanceRef.current && timeRangeColumnIndex !== null) {
      // Apply custom filter logic
      const plugin = hotInstanceRef.current.getPlugin('filters');
      
      // Clear existing filters for this column
      plugin.removeConditions(timeRangeColumnIndex);
      
      // Add date range condition
      // For better date filtering, we'll use a custom condition
      plugin.addCondition(timeRangeColumnIndex, 'between', [startDate, endDate]);
      plugin.filter();
      
      console.log(`Applied time range filter to ${filterConfig.columnName}: ${startDate} to ${endDate}`);
    }
  };


  const handleAggregateData = (aggregationConfig) => {
    console.log('Aggregating data:', aggregationConfig);
    
    // Convert aggregated data to array format for Handsontable (excluding country code)
    const aggregatedDataArray = aggregatedData.map(row => [
      row.country_name,
      row.total_revenue
    ]);
    
    // Create new sheet with aggregated data
    const newSheetId = `sheet-${Date.now()}`;
    const newSheetName = `${aggregationConfig.aggregation} by ${aggregationConfig.groupBy}`;
    
    // Create dynamic column names based on aggregation (excluding country code)
    const dynamicColumns = [
      {
        id: "country_name", 
        name: "Country",
        type: "text"
      },
      {
        id: "aggregated_value",
        name: `${aggregationConfig.aggregation}(${aggregationConfig.column})`,
        type: "text"
      }
    ];
    
    const newSheet = {
      id: newSheetId,
      name: newSheetName,
      data: aggregatedDataArray,
      columns: dynamicColumns
    };
    
    // Add the new sheet
    setSheets(prevSheets => [...prevSheets, newSheet]);
    setActiveSheetId(newSheetId);
    
    // Generate new SQL query with aggregation that reflects the actual data structure
    const newQuery = `SELECT 
    country as Country,
    ${aggregationConfig.aggregation}(CAST(total_price AS DECIMAL)) as ${aggregationConfig.aggregation}_Total_Price
FROM main.default.order_data
GROUP BY country
ORDER BY ${aggregationConfig.aggregation}(CAST(total_price AS DECIMAL)) DESC;`;
    
    setCurrentQuery(newQuery);
    setTableName(newSheetName);
    
    // Initialize Handsontable with new sheet after a brief delay
    setTimeout(() => {
      initializeHandsontable(newSheet);
    }, 100);
    
    setShowAggregateModal(false);
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

  const addColumn = () => {
    if (hotInstanceRef.current) {
      hotInstanceRef.current.alter('insert_col', hotInstanceRef.current.countCols());
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
                    <button className="action-button enrich-button">
                      <LightningIcon />
                      Enrich
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

                {/* Handsontable Container */}
                <div className="spreadsheet-table-container">
                  <div ref={handsontableRef} className="handsontable-container"></div>
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

        {/* Aggregate Data Modal */}
        <AggregateDataModal
          isOpen={showAggregateModal}
          onClose={() => setShowAggregateModal(false)}
          columnName={aggregateColumn}
          availableColumns={sheets.find(s => s.id === activeSheetId)?.columns?.map(col => col.name) || []}
          onAggregate={handleAggregateData}
        />

        {/* Time Range Filter Modal */}
        <TimeRangeFilterModal
          isOpen={showTimeRangeModal}
          onClose={() => setShowTimeRangeModal(false)}
          columnName={timeRangeColumn}
          onApplyFilter={handleApplyTimeRangeFilter}
        />

        {/* Share Modal */}
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          tableName={tableName}
        />
      </DesignSystemThemeProvider>
    </DesignSystemProvider>
  );
};

export default SpreadsheetPage;
