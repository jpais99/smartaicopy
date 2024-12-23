// src/components/sections/dashboard/AccountSettings.tsx

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';

export default function AccountSettings() {
  const { userEmail, logout } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Email update handler
  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsUpdating(true);

    try {
      const res = await fetch('/api/account/email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update email');
      }

      setMessage('Email updated successfully. Please login with your new email.');
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update email');
    } finally {
      setIsUpdating(false);
    }
  };

  // Account deletion handler
  const handleAccountDelete = async () => {
    try {
      const res = await fetch('/api/account/delete', {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      logout();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account');
      setShowDeleteConfirm(false);
    }
  };

  // Data export handler
  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const res = await fetch('/api/account/export');
      
      if (!res.ok) {
        throw new Error('Failed to export data');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'smartaicopy-data.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card variant="primary">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-medium mb-4">Account Settings</h2>
          
          {/* Email Update Form */}
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
              >
                Current Email: {userEmail}
              </label>
              <input
                id="email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New email address"
                className="block w-full px-3 py-2 bg-background border rounded-lg text-foreground placeholder-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-colors border-foreground/20 hover:border-foreground/30"
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isUpdating}
              isLoading={isUpdating}
            >
              Update Email
            </Button>
          </form>
        </div>

        <div className="space-y-4 pt-6 border-t border-foreground/10">
          <div>
            <h3 className="text-lg font-medium mb-4">Data Management</h3>
            <div className="space-y-4">
              <Button
                onClick={handleExportData}
                variant="secondary"
                disabled={isExporting}
                isLoading={isExporting}
              >
                Export Your Data
              </Button>
              
              {!showDeleteConfirm ? (
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  variant="outline"
                  className="text-red-500 hover:text-red-600"
                >
                  Delete Account
                </Button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-secondary">
                    This will permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <div className="space-x-2">
                    <Button
                      onClick={handleAccountDelete}
                      variant="outline"
                      className="text-red-500 hover:text-red-600"
                    >
                      Confirm Delete
                    </Button>
                    <Button
                      onClick={() => setShowDeleteConfirm(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm" role="alert">
            {error}
          </div>
        )}
        
        {message && (
          <div className="text-green-500 text-sm" role="status">
            {message}
          </div>
        )}
      </div>
    </Card>
  );
}