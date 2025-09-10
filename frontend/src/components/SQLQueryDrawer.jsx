import React from 'react';
import {
  CloseIcon,
  Typography
} from '@databricks/design-system';
import './SQLQueryDrawer.css';

const SQLQueryDrawer = ({ isOpen, onClose, query, tableName }) => {
  const [currentQueryIndex, setCurrentQueryIndex] = React.useState(0);
  const [openMenuIndex, setOpenMenuIndex] = React.useState(null);

  // Set aggregated query as default when drawer opens
  React.useEffect(() => {
    if (isOpen) {
      setCurrentQueryIndex(2); // Index 2 is the "Aggregated Query"
    }
  }, [isOpen]);

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setOpenMenuIndex(null);
    };

    if (openMenuIndex !== null) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuIndex]);
  
  // Define the 3 query versions
  const queryVersions = [
    {
      title: "Basic Query",
      description: "Simple select all data",
      query: `SELECT *
FROM main.default.merchant_payment_data;`
    },
    {
      title: "Filtered Query", 
      description: "Data filtered to September 2025",
      query: `SELECT *
FROM main.default.order_data
WHERE created_at >= '2025-09-01' 
  AND created_at <= '2025-09-30';`
    },
    {
      title: "Aggregated Query",
      description: "Total price aggregated by country",
      query: `SELECT 
    country as Country,
    SUM(CAST(total_price AS DECIMAL)) as SUM_Total_Price
FROM main.default.order_data
GROUP BY country
ORDER BY SUM(CAST(total_price AS DECIMAL)) DESC;`
    }
  ];
  
  const currentQuery = queryVersions[currentQueryIndex];

  const handleMenuToggle = (index, event) => {
    event.stopPropagation();
    setOpenMenuIndex(openMenuIndex === index ? null : index);
  };

  const handleMenuAction = (action, index, event) => {
    event.stopPropagation();
    console.log(`${action} for query ${index}:`, queryVersions[index].title);
    setOpenMenuIndex(null);
    
    // Handle specific actions
    switch (action) {
      case 'save':
        // Save query logic
        break;
      case 'run':
        // Run query logic
        break;
      case 'revert':
        // Revert to this query
        setCurrentQueryIndex(index);
        break;
    }
  };
  // Simple SQL syntax highlighting using React elements
  const renderHighlightedSQL = (sql) => {
    if (!sql) return 'No query available';
    
    const keywords = ['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'GROUP BY', 'HAVING', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'ON', 'AS', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL', 'COUNT', 'SUM', 'AVG', 'MAX', 'MIN', 'DISTINCT', 'LIMIT', 'OFFSET', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'DESC', 'ASC'];
    
    // Split the SQL into lines
    const lines = sql.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Split each line by spaces to process words
      const words = line.split(/(\s+)/);
      
      const processedWords = words.map((word, wordIndex) => {
        // Check if word is a keyword
        const cleanWord = word.replace(/[^\w]/g, '');
        const isKeyword = keywords.some(keyword => 
          cleanWord.toUpperCase() === keyword.toUpperCase()
        );
        
        // Check if word is a number
        const isNumber = /^\d+$/.test(cleanWord);
        
        // Check if word is a string (starts and ends with quotes)
        const isString = /^['"].*['"]$/.test(word.trim());
        
        // Check if line starts with comment
        const isComment = line.trim().startsWith('--');
        
        if (isComment) {
          return word; // Will be handled by line-level comment styling
        } else if (isKeyword) {
          return (
            <span key={`${lineIndex}-${wordIndex}`} className="sql-keyword">
              {word}
            </span>
          );
        } else if (isNumber) {
          return (
            <span key={`${lineIndex}-${wordIndex}`} className="sql-number">
              {word}
            </span>
          );
        } else if (isString) {
          return (
            <span key={`${lineIndex}-${wordIndex}`} className="sql-string">
              {word}
            </span>
          );
        } else {
          return word;
        }
      });
      
      // Handle comment lines
      if (line.trim().startsWith('--')) {
        return (
          <div key={lineIndex}>
            <span className="sql-comment">{line}</span>
            {lineIndex < lines.length - 1 && '\n'}
          </div>
        );
      }
      
      return (
        <div key={lineIndex}>
          {processedWords}
          {lineIndex < lines.length - 1 && '\n'}
        </div>
      );
    });
  };

  return (
    <div className={`sql-drawer-overlay ${isOpen ? 'open' : ''}`}>
      <div className="sql-drawer">
        <div className="sql-drawer-header">
          <div className="sql-drawer-title">
            <div className="sql-drawer-main-title">SQL Query</div>
          </div>
          <button className="sql-drawer-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="sql-drawer-content">
          <div className="sql-query-container">
            <div className="sql-query-description">
              <svg className="description-icon" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="7" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1"/>
                <text x="8" y="12" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor">i</text>
              </svg>
              <Typography.Text type="secondary" size="sm">
                This query was automatically generated based on selected data source and any transformations applied to the spreadsheet.
              </Typography.Text>
            </div>
            <pre className="sql-query-text">
              {renderHighlightedSQL(currentQuery.query)}
            </pre>

            {/* Query History Style Navigation */}
            <div className="query-history-section">
              <div className="query-history-header">
                <span className="history-title">Query History</span>
                <span className="history-count">{queryVersions.length} queries</span>
              </div>
              <div className="query-history-list">
                {[...queryVersions].reverse().map((queryVersion, reverseIndex) => {
                  const originalIndex = queryVersions.length - 1 - reverseIndex;
                  const getTimeLabel = (index) => {
                    if (index === 0) return 'Original';
                    if (index === 1) return '4 min ago';
                    if (index === 2) return '1 min ago';
                    return `${index} min ago`;
                  };
                  
                  return (
                    <div 
                      key={originalIndex}
                      className={`query-history-item ${originalIndex === currentQueryIndex ? 'active' : ''}`}
                      onClick={() => setCurrentQueryIndex(originalIndex)}
                    >
                      <div className="query-item-header">
                        <div className="query-item-title">{queryVersion.title}</div>
                        <div className="query-item-actions">
                          <div className="query-item-time">
                            {getTimeLabel(originalIndex)}
                          </div>
                          <div className="query-menu-container">
                            <button 
                              className="query-menu-button"
                              onClick={(e) => handleMenuToggle(originalIndex, e)}
                            >
                              ⋮
                            </button>
                            {openMenuIndex === originalIndex && (
                              <div className="query-menu-dropdown">
                                <button 
                                  className="menu-item"
                                  onClick={(e) => handleMenuAction('save', originalIndex, e)}
                                >
                                  Save query
                                </button>
                                <button 
                                  className="menu-item"
                                  onClick={(e) => handleMenuAction('run', originalIndex, e)}
                                >
                                  Run query
                                </button>
                                <button 
                                  className="menu-item"
                                  onClick={(e) => handleMenuAction('revert', originalIndex, e)}
                                >
                                  Revert
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="query-item-description">{queryVersion.description}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SQLQueryDrawer;
