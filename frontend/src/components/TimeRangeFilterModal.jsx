import React, { useState } from 'react';
import {
  Button,
  CloseIcon,
  Typography
} from '@databricks/design-system';
import './TimeRangeFilterModal.css';

const TimeRangeFilterModal = ({ isOpen, onClose, columnName, onApplyFilter }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleApply = () => {
    if (startDate && endDate) {
      onApplyFilter({
        startDate,
        endDate,
        columnName
      });
      onClose();
    }
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
  };

  if (!isOpen) return null;

  return (
    <div className="time-range-modal-overlay">
      <div className="time-range-modal">
        <div className="time-range-modal-header">
          <div className="time-range-modal-title">
            <Typography.Text size="lg" weight="bold">
              Filter by time range
            </Typography.Text>
          </div>
          <button className="time-range-modal-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="time-range-modal-content">
          <div className="time-range-form-section">
            <label className="time-range-form-label">
              Column
            </label>
            <div className="time-range-column-display">
              <span className="column-name">{columnName}</span>
            </div>
          </div>

          <div className="time-range-form-row">
            <div className="time-range-form-section">
              <label className="time-range-form-label">
                Start date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="time-range-date-input"
              />
            </div>

            <div className="time-range-form-section">
              <label className="time-range-form-label">
                End date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="time-range-date-input"
              />
            </div>
          </div>
        </div>

        <div className="time-range-modal-footer">
          <Button variant="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button 
            variant="primary" 
            onClick={handleApply}
            disabled={!startDate || !endDate}
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimeRangeFilterModal;
