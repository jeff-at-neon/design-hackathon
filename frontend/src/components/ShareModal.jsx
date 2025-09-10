import React, { useState } from 'react';
import {
  Button,
  CloseIcon,
  Typography
} from '@databricks/design-system';
import './ShareModal.css';

const ShareModal = ({ isOpen, onClose, tableName }) => {
  const [shareOption, setShareOption] = useState('view');
  const [emailInput, setEmailInput] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  const shareOptions = [
    { value: 'view', label: 'Can view', description: 'Recipients can view the spreadsheet' },
    { value: 'edit', label: 'Can edit', description: 'Recipients can edit the spreadsheet' },
    { value: 'comment', label: 'Can comment', description: 'Recipients can add comments' }
  ];

  const handleShare = () => {
    console.log('Sharing spreadsheet:', {
      tableName,
      shareOption,
      email: emailInput
    });
    
    // Here you would typically make an API call to share the spreadsheet
    alert(`Spreadsheet "${tableName}" shared with ${shareOption} permissions!`);
    onClose();
  };

  const handleReset = () => {
    setShareOption('view');
    setEmailInput('');
    setShowEmailInput(false);
  };

  const copyLink = () => {
    const shareLink = `https://databricks.com/spreadsheets/${tableName.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(shareLink).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  if (!isOpen) return null;

  return (
    <div className="share-modal-overlay">
      <div className="share-modal">
        <div className="share-modal-header">
          <div className="share-modal-title">
            <Typography.Text size="lg" weight="bold">
              Share spreadsheet
            </Typography.Text>
          </div>
          <button className="share-modal-close" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="share-modal-content">
          <div className="share-form-section">
            <label className="share-form-label">
              Spreadsheet
            </label>
            <div className="share-spreadsheet-display">
              <span className="spreadsheet-name">{tableName}</span>
            </div>
          </div>

          <div className="share-form-section">
            <label className="share-form-label">
              Share with people
            </label>
            <div className="share-email-container">
              <input
                type="email"
                placeholder="Enter email addresses..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="share-email-input"
              />
            </div>
          </div>

          <div className="share-form-section">
            <label className="share-form-label">
              Permission level
            </label>
            <div className="share-dropdown-container">
              <select
                value={shareOption}
                onChange={(e) => setShareOption(e.target.value)}
                className="share-permission-select"
              >
                {shareOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="share-form-section">
            <label className="share-form-label">
              Or share with link
            </label>
            <div className="share-link-container">
              <input
                type="text"
                value={`https://databricks.com/spreadsheets/${tableName.toLowerCase().replace(/\s+/g, '-')}`}
                readOnly
                className="share-link-input"
              />
              <button className="share-copy-button" onClick={copyLink}>
                Copy
              </button>
            </div>
          </div>
        </div>

        <div className="share-modal-footer">
          <Button variant="secondary" onClick={handleReset}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleShare}
            disabled={!emailInput.trim() && shareOption !== 'link'}
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
