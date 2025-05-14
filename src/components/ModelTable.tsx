// src/components/ModelTable.tsx
'use client'; // Mark this as a Client Component

import React, { useState, useMemo, useEffect } from 'react';
import { AIModel } from '@/types';
import { Card, CardHeader, CardContent } from './Card';
import Select from './Select';

interface ModelTableProps {
  initialModels: AIModel[];
}

type SortKey = keyof AIModel | null;
type SortDirection = 'asc' | 'desc';

// Add a custom number formatter function that doesn't rely on locale
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export default function ModelTable({ initialModels }: ModelTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('creator');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [providerFilter, setProviderFilter] = useState<string>(''); // '' means all providers
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  // Get unique providers for the filter dropdown
  const uniqueProviders = useMemo(() => {
    const providers = new Set(initialModels.map(m => m.provider));
    return ['', ...Array.from(providers)]; // Add 'All' option
  }, [initialModels]);

  // Animation effect
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Memoize filtered and sorted models
  const displayedModels = useMemo(() => {
    let filtered = [...initialModels];

    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(model =>
        model.provider.toLowerCase().includes(search) ||
        model.creator.toLowerCase().includes(search) ||
        model.modelName.toLowerCase().includes(search) ||
        model.features.some(feature => feature.toLowerCase().includes(search))
      );
    }

    // Apply provider filtering
    if (providerFilter) {
      filtered = filtered.filter(model => model.provider === providerFilter);
    }

    // Apply sorting
    if (sortKey) {
      filtered.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        let comparison = 0;
        if (valA > valB) {
          comparison = 1;
        } else if (valA < valB) {
          comparison = -1;
        }

        return sortDirection === 'asc' ? comparison : comparison * -1;
      });
    }

    return filtered;
  }, [initialModels, providerFilter, sortKey, sortDirection, searchTerm]);

  // Function to handle sorting clicks on headers
  const handleSort = (key: SortKey) => {
    if (!key) return;

    if (sortKey === key) {
      // Toggle direction if same key is clicked
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      // Set new key and default to ascending
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Helper to format currency (adjust as needed)
  const formatCurrency = (amount: number | null) => {
    return amount !== null ? `$${amount.toFixed(4)}` : 'N/A';
  }

  // Color coding for prices
  const getPriceColorClassInput = (price: number | null) => {
    if (price === null) return 'text-slate-400';

    if (price < 2) return 'text-green-400';
    if (price < 10) return 'text-yellow-400';
    return 'text-red-400';
  };

    // Color coding for prices
    const getPriceColorClassOutput = (price: number | null) => {
        if (price === null) return 'text-slate-400';

        if (price < 5) return 'text-green-400';
        if (price < 15) return 'text-yellow-400';
        return 'text-red-400';
      };

  const sortButtonClass = "inline-flex items-center gap-1 font-semibold text-slate-300 hover:text-indigo-400 transition-colors";
  const thClass = "px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider";
  const tdClass = "px-4 py-3 whitespace-nowrap text-sm";

  return (
    <div className={`transition-opacity duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Filter Controls */}
      <Card className="mb-6 animate-slide-in">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-lg font-semibold">AI Model Pricing Comparison</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="search"
                placeholder="Search models..."
                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              id="providerFilter"
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              options={uniqueProviders.map(provider => ({
                value: provider,
                label: provider || 'All Providers'
              }))}
              label=""
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="bg-slate-700 px-2 py-1 rounded">
              Total Models: <span className="font-medium">{displayedModels.length}</span>
            </span>
            {providerFilter && (
              <span className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded flex items-center gap-1">
                Filter: {providerFilter}
                <button
                  onClick={() => setProviderFilter('')}
                  className="hover:text-indigo-400 ml-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="bg-indigo-900/30 text-indigo-300 px-2 py-1 rounded flex items-center gap-1">
                Search: {searchTerm}
                <button
                  onClick={() => setSearchTerm('')}
                  className="hover:text-indigo-400 ml-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full divide-y divide-slate-700 bg-slate-800">
          <thead className="bg-slate-700/50">
            <tr>
              <th className={thClass}>
                <button onClick={() => handleSort('creator')} className={sortButtonClass}>
                  Creator
                  {sortKey === 'creator' && (
                    <span className="text-indigo-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className={thClass}>
                <button onClick={() => handleSort('provider')} className={sortButtonClass}>
                  Provider
                  {sortKey === 'provider' && (
                    <span className="text-indigo-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className={thClass}>
                <button onClick={() => handleSort('modelName')} className={sortButtonClass}>
                  Model Name
                  {sortKey === 'modelName' && (
                    <span className="text-indigo-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className={thClass}>
                <button onClick={() => handleSort('inputCostPer1MTokens')} className={sortButtonClass}>
                  Input / 1M Tokens
                  {sortKey === 'inputCostPer1MTokens' && (
                    <span className="text-indigo-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className={thClass}>
                <button onClick={() => handleSort('outputCostPer1MTokens')} className={sortButtonClass}>
                  Output / 1M Tokens
                  {sortKey === 'outputCostPer1MTokens' && (
                    <span className="text-indigo-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className={thClass}>
                <button onClick={() => handleSort('contextWindow')} className={sortButtonClass}>
                  Context Length
                  {sortKey === 'contextWindow' && (
                    <span className="text-indigo-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </button>
              </th>
              <th className={thClass}>Features</th>
            </tr>
          </thead>
          <tbody className="bg-slate-800 divide-y divide-slate-700">
            {displayedModels.map((model, index) => (
              <tr
                key={model.id}
                className={`hover:bg-slate-700/50 transition-colors`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className={`${tdClass} font-medium text-slate-200`}>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-violet-400 mr-2"></div>
                    {model.creator}
                  </div>
                </td>
                <td className={`${tdClass} font-medium text-slate-200`}>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-indigo-400 mr-2"></div>
                    {model.provider}
                  </div>
                </td>
                <td className={`${tdClass} font-medium`}>
                  {model.modelName}
                </td>
                <td className={`${tdClass} ${getPriceColorClassInput(model.inputCostPer1MTokens)} font-mono`}>
                  {formatCurrency(model.inputCostPer1MTokens)}
                </td>
                <td className={`${tdClass} ${getPriceColorClassOutput(model.outputCostPer1MTokens)} font-mono`}>
                  {formatCurrency(model.outputCostPer1MTokens)}
                </td>
                <td className={`${tdClass} font-mono`}>
                  {model.contextWindow ? (
                    <span className="bg-slate-700 px-2 py-1 rounded text-xs">
                      {formatNumber(model.contextWindow)}
                    </span>
                  ) : 'N/A'}
                </td>
                <td className={tdClass}>
                  <div className="flex flex-wrap gap-1">
                    {model.features.map((feature, idx) => (
                      <span key={idx} className="inline-block bg-slate-700 rounded-full px-2 py-0.5 text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {displayedModels.length === 0 && (
        <div className="bg-slate-800 rounded-lg shadow p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-slate-200">No results found</h3>
          <p className="mt-1 text-sm text-slate-400">
            No models match your current filters. Try adjusting your search or clearing filters.
          </p>
          <div className="mt-6">
            <button
              onClick={() => { setProviderFilter(''); setSearchTerm(''); }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}