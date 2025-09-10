import React, { useState } from 'react';
import {
  Button,
  CloseIcon,
  ChevronDownIcon,
  Typography
} from '@databricks/design-system';
import './AggregateDataModal.css';

const AggregateDataModal = ({ isOpen, onClose, columnName, availableColumns, onAggregate }) => {
  const [selectedAggregation, setSelectedAggregation] = useState('COUNT');
  const [selectedGroupBy, setSelectedGroupBy] = useState('');
  const [showAggregationDropdown, setShowAggregationDropdown] = useState(false);
  const [showGroupByDropdown, setShowGroupByDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const aggregationOptions = [
    'AVG',
    'COUNT',
    'MAX',
    'MEAN',
    'MEDIAN',
    'MIN',
    'PERCENTILE',
    'STDDEV',
    'SUM',
    'VARIANCE'
  ];

  const handleAggregate = () => {
    if (selectedGroupBy) {
      onAggregate({
        column: columnName,
        aggregation: selectedAggregation,
        groupBy: selectedGroupBy
      });
      onClose();
    }
  };

  const handleReset = () => {
    setSelectedAggregation('COUNT');
    setSelectedGroupBy('');
  };

  const calculateDropdownPosition = (buttonElement) => {
    const rect = buttonElement.getBoundingClientRect();
    return {
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width
    };
  };

  const handleAggregationDropdownToggle = (event) => {
    if (!showAggregationDropdown) {
      const position = calculateDropdownPosition(event.currentTarget);
      setDropdownPosition(position);
    }
    setShowAggregationDropdown(!showAggregationDropdown);
    setShowGroupByDropdown(false);
  };

  const handleGroupByDropdownToggle = (event) => {
    if (!showGroupByDropdown) {
      const position = calculateDropdownPosition(event.currentTarget);
      setDropdownPosition(position);
    }
    setShowGroupByDropdown(!showGroupByDropdown);
    setShowAggregationDropdown(false);
  };

  if (!isOpen) return null;

  return (
    <div className="aggregate-modal-overlay">
      <div className="aggregate-modal">
        <div className="aggregate-modal-header">
          <div className="aggregate-modal-title">
            <Typography.Text size="lg" weight="bold">
              Aggregate data
            </Typography.Text>
          </div>
          <button className="aggregate-modal-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="aggregate-modal-content">
          <div className="aggregate-form-row">
            <div className="aggregate-form-section">
              <label className="aggregate-form-label">
                Column to aggregate
              </label>
              <div className="aggregate-column-display">
                <span className="column-name">{columnName}</span>
              </div>
            </div>

            <div className="aggregate-form-section">
              <label className="aggregate-form-label">
                Aggregation type
              </label>
              <div className="aggregate-dropdown-container">
                <button
                  className="aggregate-dropdown-button"
                  onClick={handleAggregationDropdownToggle}
                >
                  <span>{selectedAggregation}</span>
                  <ChevronDownIcon />
                </button>
                {showAggregationDropdown && (
                  <div 
                    className="aggregate-dropdown-menu"
                    style={{
                      top: dropdownPosition.top,
                      left: dropdownPosition.left,
                      width: dropdownPosition.width
                    }}
                  >
                    {aggregationOptions.map((option) => (
                      <button
                        key={option}
                        className={`aggregate-dropdown-item ${selectedAggregation === option ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedAggregation(option);
                          setShowAggregationDropdown(false);
                        }}
                      >
                        {selectedAggregation === option && <span className="checkmark">✓</span>}
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="aggregate-form-section">
            <label className="aggregate-form-label">
              Group by column
            </label>
            <div className="aggregate-dropdown-container">
              <button
                className="aggregate-dropdown-button"
                onClick={handleGroupByDropdownToggle}
              >
                <span>{selectedGroupBy || 'Select column...'}</span>
                <ChevronDownIcon />
              </button>
              {showGroupByDropdown && (
                <div 
                  className="aggregate-dropdown-menu"
                  style={{
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                    width: dropdownPosition.width
                  }}
                >
                  {availableColumns.filter(col => col !== columnName).map((column) => (
                    <button
                      key={column}
                      className={`aggregate-dropdown-item ${selectedGroupBy === column ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedGroupBy(column);
                        setShowGroupByDropdown(false);
                      }}
                    >
                      {selectedGroupBy === column && <span className="checkmark">✓</span>}
                      {column}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="aggregate-modal-footer">
          <Button variant="secondary" onClick={handleReset}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAggregate}
            disabled={!selectedGroupBy}
          >
            Aggregate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AggregateDataModal;
