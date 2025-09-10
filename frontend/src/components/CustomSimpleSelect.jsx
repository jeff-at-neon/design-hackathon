import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@databricks/design-system';
import './CustomSimpleSelect.css';

const CustomSimpleSelect = ({ 
  value, 
  onChange, 
  placeholder, 
  width = 200,
  children,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: width });
  const selectRef = useRef(null);

  // Find the selected option based on value
  useEffect(() => {
    const options = React.Children.toArray(children);
    const selected = options.find(option => option.props.value === value);
    setSelectedOption(selected);
  }, [value, children]);

  // Calculate dropdown position when opening
  const calculateDropdownPosition = () => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      });
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      calculateDropdownPosition();
    }
    setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue, optionLabel) => {
    setSelectedOption({ props: { value: optionValue, children: optionLabel } });
    setIsOpen(false);
    
    if (onChange) {
      onChange({
        target: {
          value: optionValue,
          type: 'select'
        },
        type: 'change'
      });
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSelectedOption(null);
    setIsOpen(false);
    
    if (onChange) {
      onChange({
        target: {
          value: '',
          type: 'select'
        },
        type: 'change'
      });
    }
  };

  const hasSelection = selectedOption && selectedOption.props.value !== '';

  return (
    <div 
      className="custom-simple-select" 
      ref={selectRef}
      style={{ width: width }}
      {...props}
    >
      <button
        type="button"
        className={`custom-simple-select-trigger ${isOpen ? 'open' : ''} ${hasSelection ? 'has-selection' : ''}`}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="custom-simple-select-value">
          {hasSelection ? selectedOption.props.children : placeholder}
        </span>
        {hasSelection && (
          <button
            type="button"
            className="custom-simple-select-clear"
            onClick={handleClear}
            aria-label="Clear selection"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        <ChevronDownIcon className={`custom-simple-select-chevron ${isOpen ? 'open' : ''}`} />
      </button>
      
      {isOpen && (
        <div 
          className="custom-simple-select-dropdown"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width
          }}
        >
          <div className="custom-simple-select-options">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.props.value !== '') {
                return (
                  <div
                    key={child.props.value}
                    className={`custom-simple-select-option ${
                      child.props.value === value ? 'selected' : ''
                    }`}
                    onClick={() => handleSelect(child.props.value, child.props.children)}
                  >
                    {child.props.children}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const CustomSimpleSelectOption = ({ value, children, ...props }) => {
  return (
    <div className="custom-simple-select-option-content" {...props}>
      {children}
    </div>
  );
};

export { CustomSimpleSelect, CustomSimpleSelectOption }; 