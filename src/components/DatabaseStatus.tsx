import React, { useState, useEffect } from 'react';
import { Database, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function DatabaseStatus() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { testDatabase } = useAuth();

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const result = await testDatabase();
      setStatus(result);
    } catch (error) {
      console.error('Database status check failed:', error);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (connected: boolean) => {
    if (loading) return <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />;
    return connected ? 
      <CheckCircle className="w-4 h-4 text-green-600" /> : 
      <XCircle className="w-4 h-4 text-red-600" />;
  };

  const getStatusColor = (connected: boolean) => {
    return connected ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  if (!status && !loading) return null;

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg border ${getStatusColor(status?.connection)} shadow-lg z-50`}>
      <div className="flex items-center space-x-3">
        <Database className="w-5 h-5 text-gray-600" />
        <div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(status?.connection)}
            <span className="text-sm font-medium">
              Database: {status?.connection ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          {status && (
            <div className="text-xs text-gray-600 mt-1">
              Events: {status.events} | Venues: {status.venues} | Sponsors: {status.sponsors} | Partners: {status.partners}
            </div>
          )}
        </div>
        <button
          onClick={checkStatus}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
}

export default DatabaseStatus;