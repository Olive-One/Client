import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, X } from 'lucide-react';

export interface MultiSelectOption {
  label: string;
  id: string;
  meta?: Record<string, unknown>;
  value?: string;
}

export interface MultiSelectCompPropInf {
  name: string;
  onChange?: (event: MultiSelectOption | MultiSelectOption[] | null) => void;
  onBlur?: () => void;
  value?: MultiSelectOption | MultiSelectOption[] | undefined | null;
  defaultOptions: MultiSelectOption[] | undefined;
  placeholder: string;
  isMulti?: boolean;
  defaultValue?: MultiSelectOption | MultiSelectOption[] | null;
  isDisabled?: boolean;
  maxMenuHeight?: number;
  loadOptions: (inputValue: string) => Promise<MultiSelectOption[]>;
  cacheOptions?: boolean;
  isClearable?: boolean;
}

const AsyncSelectDropdown: React.FC<MultiSelectCompPropInf> = ({
  onChange,
  onBlur,
  value,
  defaultOptions = [],
  placeholder,
  isMulti = false,
  isDisabled = false,
  maxMenuHeight = 240,
  loadOptions,
  cacheOptions = true,
  isClearable = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<MultiSelectOption[]>(defaultOptions || []);
  const [isLoading, setIsLoading] = useState(false);
  const [cache, setCache] = useState<Record<string, MultiSelectOption[]>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        onBlur?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onBlur]);

  useEffect(() => {
    if (isOpen) {
      if (inputValue) {
        loadOptionsDebounced(inputValue);
      } else {
        // Show defaultOptions when no search input
        setOptions(defaultOptions || []);
      }
    }
  }, [inputValue, isOpen, defaultOptions]);

  const loadOptionsDebounced = async (searchValue: string) => {
    if (cacheOptions && cache[searchValue]) {
      setOptions(cache[searchValue]);
      return;
    }

    setIsLoading(true);
    try {
      const newOptions = await loadOptions(searchValue);
      setOptions(newOptions);
      
      if (cacheOptions) {
        setCache(prev => ({ ...prev, [searchValue]: newOptions }));
      }
    } catch (error) {
      console.error('Failed to load options:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (option: MultiSelectOption) => {
    if (isMulti) {
      const currentValue = Array.isArray(value) ? value : [];
      const isSelected = currentValue.some(item => item.id === option.id);
      
      let newValue;
      if (isSelected) {
        newValue = currentValue.filter(item => item.id !== option.id);
      } else {
        newValue = [...currentValue, option];
      }
      
      onChange?.(newValue);
    } else {
      onChange?.(option);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onChange?.(isMulti ? [] : null);
  };

  const getDisplayValue = () => {
    if (isMulti && Array.isArray(value)) {
      return value.length > 0 ? `${value.length} selected` : placeholder;
    }
    if (!isMulti && value) {
      return (value as MultiSelectOption).label;
    }
    return placeholder;
  };


  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`
          flex items-center justify-between w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm
          ring-offset-background placeholder:text-muted-foreground
          focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2
          ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        `}
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
      >
        <div className="flex-1 min-h-0 overflow-hidden">
          {isMulti && Array.isArray(value) && value.length > 0 && !isOpen && (
            <div className="flex flex-wrap gap-1">
              {value.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded text-xs max-w-[120px]"
                >
                  <span className="truncate">{item.label}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOptionSelect(item);
                    }}
                    className="hover:bg-primary/20 rounded flex-shrink-0"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {value.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{value.length - 2} more
                </span>
              )}
            </div>
          )}
          
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type to search..."
              className="w-full bg-transparent outline-none border-0 p-0 h-auto"
              autoFocus
            />
          ) : (
            <>
              {!(isMulti && Array.isArray(value) && value.length > 0) && (
                <span className={!value ? 'text-muted-foreground' : ''}>
                  {getDisplayValue()}
                </span>
              )}
            </>
          )}
        </div>
        
        <div className="flex items-center gap-1 flex-shrink-0">
          {isClearable && value && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="hover:bg-muted rounded p-1"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown
            size={14}
            className={`transition-transform text-muted-foreground ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg overflow-hidden"
          style={{ maxHeight: `${maxMenuHeight}px` }}
        >
          <div className="overflow-y-auto overflow-x-hidden" style={{ maxHeight: `${maxMenuHeight}px` }}>
            {isLoading ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Loading...
              </div>
            ) : options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No options found
              </div>
            ) : (
              options.map((option) => {
                const isSelected = isMulti
                  ? Array.isArray(value) && value.some(item => item.id === option.id)
                  : value && (value as MultiSelectOption).id === option.id;

                return (
                  <div
                    key={option.id}
                    className={`
                      px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors
                      ${isSelected ? 'bg-accent text-accent-foreground' : ''}
                    `}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{option.label}</span>
                      {isSelected && isMulti && (
                        <span className="text-primary ml-2 flex-shrink-0">✓</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AsyncSelectDropdown;