'use client';

import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { checkUsernameAvailability, UsernameCheckResult } from '@/lib/queries';
import { Check, X, Loader2, Info } from 'lucide-react';
import { debounce } from 'lodash';

interface UsernameInputProps {
  defaultValue?: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}

export default function UsernameInput({ 
  defaultValue = '', 
  name, 
  required = false,
  placeholder = "Username"
}: UsernameInputProps) {
  const [username, setUsername] = useState(defaultValue);
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<UsernameCheckResult | null>(null);
  const [touched, setTouched] = useState(false);

  // Debounced check function
  const checkUsername = useCallback(
    debounce(async (value: string) => {
      if (!value || value.length < 3) {
        setCheckResult(null);
        setIsChecking(false);
        return;
      }

      setIsChecking(true);
      try {
        const result = await checkUsernameAvailability(value);
        setCheckResult(result);
      } catch (error) {
        console.error('Username check failed:', error);
        setCheckResult({
          available: false,
          username: value,
          message: 'Failed to check username availability',
          suggestions: []
        });
      } finally {
        setIsChecking(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (touched && username) {
      checkUsername(username);
    }
  }, [username, touched, checkUsername]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/\s/g, '');
    setUsername(value);
    setTouched(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setUsername(suggestion);
    setCheckResult({
      available: true,
      username: suggestion,
      message: 'Username is available!',
      suggestions: []
    });
  };

  const getStatusIcon = () => {
    if (isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-gray-500" />;
    }
    if (!checkResult || !touched) {
      return null;
    }
    if (checkResult.available) {
      return <Check className="h-4 w-4 text-green-600" />;
    }
    return <X className="h-4 w-4 text-red-600" />;
  };

  const getStatusColor = () => {
    if (!checkResult || !touched) return '';
    if (checkResult.available) return 'border-green-500 focus:border-green-500';
    return 'border-red-500 focus:border-red-500';
  };

  const getStatusMessage = () => {
    if (!touched) return null;
    if (isChecking) return null;
    if (!username || username.length < 3) {
      return (
        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
          <Info className="h-3 w-3" />
          Username must be at least 3 characters long
        </p>
      );
    }
    if (!checkResult) return null;
    
    return (
      <div className="mt-1">
        <p className={`text-sm ${checkResult.available ? 'text-green-600' : 'text-red-600'}`}>
          {checkResult.message}
        </p>
        {!checkResult.available && checkResult.suggestions.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-600 mb-1">Try one of these:</p>
            <div className="flex flex-wrap gap-1">
              {checkResult.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="relative">
        <Input
          name={name}
          value={username}
          onChange={handleUsernameChange}
          placeholder={placeholder}
          required={required}
          className={`pr-8 ${getStatusColor()}`}
          autoComplete="off"
          pattern="[a-zA-Z0-9_]+"
          title="Username can only contain letters, numbers, and underscores"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          {getStatusIcon()}
        </div>
      </div>
      {getStatusMessage()}
    </div>
  );
}
