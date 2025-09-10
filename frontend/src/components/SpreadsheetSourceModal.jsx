import React, { useState } from 'react';
import {
  Button,
  Modal,
  Typography,
  TableIcon,
  QueryIcon,
  CatalogIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  SearchIcon,
  CloseIcon,
  FolderIcon
} from '@databricks/design-system';
import './SpreadsheetSourceModal.css';

const SpreadsheetSourceModal = ({ isOpen, onClose, onSelect }) => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [selectedSchema, setSelectedSchema] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('for-you');

  // Mock data for Unity Catalog
  const catalogData = {
    'main': {
      'default': ['customers', 'orders', 'products', 'merchant_payment_data', 'sales_transactions'],
      'analytics': ['revenue_summary', 'customer_metrics', 'product_performance'],
      'staging': ['raw_events', 'processed_logs', 'temp_calculations']
    },
    'samples': {
      'retail': ['store_sales', 'inventory', 'customer_reviews'],
      'finance': ['transactions', 'accounts', 'risk_metrics'],
      'marketing': ['campaigns', 'leads', 'conversions']
    },
    'workspace': {
      'user_data': ['personal_queries', 'saved_results', 'bookmarks'],
      'shared': ['team_datasets', 'common_tables', 'reference_data']
    }
  };

  // Mock saved queries organized by folders
  const queryFolders = {
    'Users': {
      'kyle.gilbreath@databricks.com': {
        'queries': [
          {
            id: 'q1',
            name: 'Customer Revenue Analysis',
            description: 'Monthly revenue breakdown by customer segment',
            lastModified: '2 hours ago'
          },
          {
            id: 'q2',
            name: 'Product Performance Dashboard',
            description: 'Sales metrics and inventory levels',
            lastModified: '1 day ago'
          },
          {
            id: 'q3',
            name: 'Payment Processing Stats',
            description: 'Transaction success rates and error analysis',
            lastModified: '3 days ago'
          }
        ],
        'drafts': [
          {
            id: 'q5',
            name: 'Weekly Sales Report',
            description: 'Draft query for weekly sales analysis',
            lastModified: '5 days ago'
          }
        ]
      }
    },
    'Shared': {
      'analytics': {
        'queries': [
          {
            id: 'q4',
            name: 'User Engagement Metrics',
            description: 'Daily active users and session analytics',
            lastModified: '1 week ago'
          }
        ],
        'reports': [
          {
            id: 'q6',
            name: 'Monthly Business Review',
            description: 'Comprehensive monthly business metrics',
            lastModified: '2 weeks ago'
          }
        ]
      }
    }
  };

  const toggleExpanded = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCatalogSelect = (catalog) => {
    setSelectedCatalog(catalog);
    setSelectedSchema(null);
    setSelectedTable(null);
  };

  const handleSchemaSelect = (schema) => {
    setSelectedSchema(schema);
    setSelectedTable(null);
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
  };

  const handleQuerySelect = (query) => {
    setSelectedQuery(query.id);
  };

  const handleQueryDoubleClick = (query) => {
    if (onSelect) {
      onSelect({
        type: 'query',
        data: query
      });
    }
    onClose();
  };

  const handleCreateSpreadsheet = () => {
    if (activeTab === 'catalog' && selectedCatalog && selectedSchema && selectedTable) {
      if (onSelect) {
        onSelect({
          type: 'table',
          data: {
            catalog: selectedCatalog,
            schema: selectedSchema,
            table: selectedTable,
            fullPath: `${selectedCatalog}.${selectedSchema}.${selectedTable}`
          }
        });
      }
      onClose();
    } else if (activeTab === 'queries') {
      handleCreateSpreadsheetFromQuery();
    }
  };

  const isCreateEnabled = () => {
    if (activeTab === 'catalog') {
      return selectedCatalog && selectedSchema && selectedTable;
    } else if (activeTab === 'queries') {
      return selectedQuery !== null;
    }
    return false;
  };

  const handleCreateSpreadsheetFromQuery = () => {
    if (selectedQuery) {
      // Find the selected query in the folder structure
      let foundQuery = null;
      Object.values(queryFolders).forEach(topLevel => {
        Object.values(topLevel).forEach(userOrFolder => {
          Object.values(userOrFolder).forEach(folderContent => {
            if (Array.isArray(folderContent)) {
              const query = folderContent.find(q => q.id === selectedQuery);
              if (query) {
                foundQuery = query;
              }
            }
          });
        });
      });
      
      if (foundQuery && onSelect) {
        onSelect({
          type: 'query',
          data: foundQuery
        });
      }
      onClose();
    }
  };

  // Filter catalog data based on search query and filter
  const getFilteredCatalogData = () => {
    let dataToFilter = catalogData;
    
    // Apply filter first
    if (activeFilter === 'for-you') {
      // Show only "main" catalog for "For you" filter
      dataToFilter = {
        'main': catalogData['main'] || {}
      };
    }
    
    if (!searchQuery.trim()) return dataToFilter;
    
    const filtered = {};
    Object.entries(dataToFilter).forEach(([catalog, schemas]) => {
      const filteredSchemas = {};
      let hasMatchingContent = false;
      
      Object.entries(schemas).forEach(([schema, tables]) => {
        const filteredTables = tables.filter(table => 
          catalog.toLowerCase().includes(searchQuery.toLowerCase()) ||
          schema.toLowerCase().includes(searchQuery.toLowerCase()) ||
          table.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        if (filteredTables.length > 0) {
          filteredSchemas[schema] = filteredTables;
          hasMatchingContent = true;
        }
      });
      
      if (hasMatchingContent) {
        filtered[catalog] = filteredSchemas;
      }
    });
    
    return filtered;
  };

  // Filter query data based on search query and filter
  const getFilteredQueryData = () => {
    let dataToFilter = queryFolders;
    
    // Apply filter first
    if (activeFilter === 'for-you') {
      // Show only "Users" folder for "For you" filter
      dataToFilter = {
        'Users': queryFolders['Users'] || {}
      };
    }
    
    if (!searchQuery.trim()) return dataToFilter;
    
    const filtered = {};
    Object.entries(dataToFilter).forEach(([topFolder, subFolders]) => {
      const filteredSubFolders = {};
      let hasMatchingContent = false;
      
      Object.entries(subFolders).forEach(([subFolder, contents]) => {
        const filteredContents = {};
        let hasMatchingQueries = false;
        
        Object.entries(contents).forEach(([folderName, queries]) => {
          if (Array.isArray(queries)) {
            const filteredQueries = queries.filter(query =>
              topFolder.toLowerCase().includes(searchQuery.toLowerCase()) ||
              subFolder.toLowerCase().includes(searchQuery.toLowerCase()) ||
              folderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              query.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            if (filteredQueries.length > 0) {
              filteredContents[folderName] = filteredQueries;
              hasMatchingQueries = true;
            }
          }
        });
        
        if (hasMatchingQueries) {
          filteredSubFolders[subFolder] = filteredContents;
          hasMatchingContent = true;
        }
      });
      
      if (hasMatchingContent) {
        filtered[topFolder] = filteredSubFolders;
      }
    });
    
    return filtered;
  };

  // Auto-expand filtered results
  const getExpandedItemsForSearch = (filteredData, isQueryData = false) => {
    if (!searchQuery.trim()) return {};
    
    const expanded = {};
    
    if (isQueryData) {
      Object.keys(filteredData).forEach(topFolder => {
        expanded[topFolder] = true;
        Object.keys(filteredData[topFolder] || {}).forEach(subFolder => {
          expanded[`${topFolder}.${subFolder}`] = true;
          Object.keys(filteredData[topFolder][subFolder] || {}).forEach(folderName => {
            expanded[`${topFolder}.${subFolder}.${folderName}`] = true;
          });
        });
      });
    } else {
      Object.keys(filteredData).forEach(catalog => {
        expanded[catalog] = true;
        Object.keys(filteredData[catalog] || {}).forEach(schema => {
          expanded[`${catalog}.${schema}`] = true;
        });
      });
    }
    
    return expanded;
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title">
            <TableIcon />
            Create Spreadsheet
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="modal-content">
          <div className="modal-tabs">
            <button
              className={`tab-button ${activeTab === 'catalog' ? 'active' : ''}`}
              onClick={() => setActiveTab('catalog')}
            >
              <TableIcon />
              From table
            </button>
            <button
              className={`tab-button ${activeTab === 'queries' ? 'active' : ''}`}
              onClick={() => setActiveTab('queries')}
            >
              <QueryIcon />
              From query
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'catalog' && (
              <div className="catalog-tab">
                <div className="search-container">
                  <div className="search-input-wrapper">
                    <SearchIcon className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="filter-pills-container">
                  <div className="filter-pills">
                    <button 
                      className={`filter-pill ${activeFilter === 'for-you' ? 'active' : ''}`}
                      onClick={() => setActiveFilter('for-you')}
                    >
                      For you
                    </button>
                    <button 
                      className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveFilter('all')}
                    >
                      All
                    </button>
                  </div>
                </div>

                <div className="catalog-browser">
                  <div className="catalog-tree">
                    {Object.entries(getFilteredCatalogData()).map(([catalog, schemas]) => (
                      <div key={catalog} className="catalog-item">
                        <div
                          className="tree-item catalog-level"
                          onClick={() => {
                            toggleExpanded(catalog);
                            handleCatalogSelect(catalog);
                          }}
                        >
                          <div className="tree-item-content">
                            <div className="tree-toggle">
                              {expandedItems[catalog] ? <ChevronDownIcon /> : <ChevronRightIcon />}
                            </div>
                            <div className="tree-icon">
                              <CatalogIcon />
                            </div>
                            <div className="tree-label">{catalog}</div>
                          </div>
                        </div>

                        {(expandedItems[catalog] || getExpandedItemsForSearch(getFilteredCatalogData())[catalog]) && (
                          <div className="schema-list">
                            {Object.entries(schemas).map(([schema, tables]) => (
                              <div key={schema} className="schema-item">
                                <div
                                  className="tree-item schema-level"
                                  onClick={() => {
                                    toggleExpanded(`${catalog}.${schema}`);
                                    handleSchemaSelect(schema);
                                  }}
                                >
                                  <div className="tree-item-content">
                                    <div className="tree-toggle">
                                      {expandedItems[`${catalog}.${schema}`] ? <ChevronDownIcon /> : <ChevronRightIcon />}
                                    </div>
                                    <div className="tree-icon">
                                      <FolderIcon />
                                    </div>
                                    <div className="tree-label">{schema}</div>
                                  </div>
                                </div>

                                {(expandedItems[`${catalog}.${schema}`] || getExpandedItemsForSearch(getFilteredCatalogData())[`${catalog}.${schema}`]) && (
                                  <div className="table-list">
                                    {tables.map((table) => (
                                      <div
                                        key={table}
                                        className={`tree-item table-level ${selectedTable === table && selectedSchema === schema && selectedCatalog === catalog ? 'selected' : ''}`}
                                        onClick={() => handleTableSelect(table)}
                                      >
                                        <div className="tree-item-content">
                                          <div className="tree-toggle"></div>
                                          <div className="tree-icon">
                                            <TableIcon />
                                          </div>
                                          <div className="tree-label">{table}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'queries' && (
              <div className="queries-tab">
                <div className="search-container">
                  <div className="search-input-wrapper">
                    <SearchIcon className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search"
                      className="search-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="filter-pills-container">
                  <div className="filter-pills">
                    <button 
                      className={`filter-pill ${activeFilter === 'for-you' ? 'active' : ''}`}
                      onClick={() => setActiveFilter('for-you')}
                    >
                      For you
                    </button>
                    <button 
                      className={`filter-pill ${activeFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveFilter('all')}
                    >
                      All
                    </button>
                  </div>
                </div>

                <div className="catalog-browser">
                  <div className="catalog-tree">
                    {Object.entries(getFilteredQueryData()).map(([topFolder, subFolders]) => (
                      <div key={topFolder} className="catalog-item">
                        <div
                          className="tree-item catalog-level"
                          onClick={() => toggleExpanded(topFolder)}
                        >
                          <div className="tree-item-content">
                            <div className="tree-toggle">
                              {expandedItems[topFolder] ? <ChevronDownIcon /> : <ChevronRightIcon />}
                            </div>
                            <div className="tree-icon">
                              <FolderIcon />
                            </div>
                            <div className="tree-label">{topFolder}</div>
                          </div>
                        </div>

                        {(expandedItems[topFolder] || getExpandedItemsForSearch(getFilteredQueryData(), true)[topFolder]) && (
                          <div className="schema-list">
                            {Object.entries(subFolders).map(([subFolder, contents]) => (
                              <div key={subFolder} className="schema-item">
                                <div
                                  className="tree-item schema-level"
                                  onClick={() => toggleExpanded(`${topFolder}.${subFolder}`)}
                                >
                                  <div className="tree-item-content">
                                    <div className="tree-toggle">
                                      {expandedItems[`${topFolder}.${subFolder}`] ? <ChevronDownIcon /> : <ChevronRightIcon />}
                                    </div>
                                    <div className="tree-icon">
                                      <FolderIcon />
                                    </div>
                                    <div className="tree-label">{subFolder}</div>
                                  </div>
                                </div>

                                {(expandedItems[`${topFolder}.${subFolder}`] || getExpandedItemsForSearch(getFilteredQueryData(), true)[`${topFolder}.${subFolder}`]) && (
                                  <div className="table-list">
                                    {Object.entries(contents).map(([folderName, queries]) => (
                                      <div key={folderName}>
                                        <div
                                          className="tree-item table-level"
                                          onClick={() => toggleExpanded(`${topFolder}.${subFolder}.${folderName}`)}
                                        >
                                          <div className="tree-item-content">
                                            <div className="tree-toggle">
                                              {expandedItems[`${topFolder}.${subFolder}.${folderName}`] ? <ChevronDownIcon /> : <ChevronRightIcon />}
                                            </div>
                                            <div className="tree-icon">
                                              <FolderIcon />
                                            </div>
                                            <div className="tree-label">{folderName}</div>
                                          </div>
                                        </div>

                                        {(expandedItems[`${topFolder}.${subFolder}.${folderName}`] || getExpandedItemsForSearch(getFilteredQueryData(), true)[`${topFolder}.${subFolder}.${folderName}`]) && (
                                          <div className="query-list">
                                            {queries.map((query) => (
                                              <div
                                                key={query.id}
                                                className={`tree-item query-level ${selectedQuery === query.id ? 'selected' : ''}`}
                                                onClick={() => handleQuerySelect(query)}
                                                onDoubleClick={() => handleQueryDoubleClick(query)}
                                              >
                                                <div className="tree-item-content">
                                                  <div className="tree-toggle"></div>
                                                  <div className="tree-icon">
                                                    <QueryIcon />
                                                  </div>
                                                  <div className="tree-label">{query.name}</div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateSpreadsheet}
            disabled={!isCreateEnabled()}
          >
            Create Spreadsheet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetSourceModal;
