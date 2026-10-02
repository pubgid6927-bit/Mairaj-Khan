import React, { useState } from 'react';
import { SlidersHorizontal, RotateCcw, ChevronDown, Check } from 'lucide-react';

interface SeriesFilterProps {
  activeSeries: string;
  onSelectSeries: (series: string) => void;
  seriesCounts: Record<string, number>;
  totalCount: number;

  selectedBand: string;
  onSelectBand: (band: string) => void;

  selectedPriceRange: string;
  onSelectPriceRange: (range: string) => void;

  selectedMovement: string;
  onSelectMovement: (movement: string) => void;

  sortBy: string;
  onSelectSort: (sort: string) => void;

  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const SeriesFilter: React.FC<SeriesFilterProps> = ({
  activeSeries,
  onSelectSeries,
  seriesCounts,
  totalCount,
  selectedBand,
  onSelectBand,
  selectedPriceRange,
  onSelectPriceRange,
  selectedMovement,
  onSelectMovement,
  sortBy,
  onSelectSort,
  onResetFilters,
  hasActiveFilters
}) => {
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const seriesTabs: { label: string; shortLabel: string; value: string }[] = [
    { label: 'All Watches', shortLabel: 'All', value: 'All' },
    { label: 'Casio MTP (Men)', shortLabel: 'MTP (Men)', value: 'Casio MTP' },
    { label: 'Casio LTP (Ladies)', shortLabel: 'LTP (Ladies)', value: 'Casio LTP' },
    { label: 'Casio Edifice', shortLabel: 'Edifice', value: 'Casio Edifice' },
    { label: 'Casio G-Shock', shortLabel: 'G-Shock', value: 'Casio G-Shock' },
    { label: 'Casio Vintage', shortLabel: 'Vintage', value: 'Casio Vintage' },
    { label: 'Casio ProTrek', shortLabel: 'ProTrek', value: 'Casio ProTrek' }
  ];

  // Count active non-series filters
  const activeFilterCount = 
    (selectedPriceRange !== 'All' ? 1 : 0) +
    (selectedBand !== 'All' ? 1 : 0) +
    (selectedMovement !== 'All' ? 1 : 0);

  return (
    <div className="space-y-2.5">
      {/* Primary Series Segmented Controls (Smooth Horizontal Touch Carousel) */}
      <div className="relative">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
          {seriesTabs.map((tab) => {
            const isActive = activeSeries === tab.value;

            return (
              <button
                key={tab.value}
                onClick={() => onSelectSeries(tab.value)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center justify-center cursor-pointer shrink-0 active:scale-95 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Controls Bar */}
      <div className="p-2.5 sm:p-3 bg-white border border-slate-200 rounded-xl text-xs shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
              activeFilterCount > 0 || isFilterPanelOpen
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold flex items-center justify-center font-mono">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFilterPanelOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Quick Gender Shortcuts (Direct Thumb Toggles) */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => onSelectSeries('All')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeSeries === 'All' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onSelectSeries('Casio MTP')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeSeries === 'Casio MTP' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Men
            </button>
            <button
              onClick={() => onSelectSeries('Casio LTP')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeSeries === 'Casio LTP' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ladies
            </button>
          </div>

          {/* Reset button if active */}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-semibold py-1 px-2 hover:bg-rose-50 rounded transition-colors cursor-pointer text-xs"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-slate-800 cursor-pointer font-medium text-xs"
            >
              <option value="featured">Featured Collection</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated (4.9+)</option>
              <option value="model">Model Number (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Expandable Filter Panel (Touch-Friendly Controls for Mobile & Desktop) */}
        {isFilterPanelOpen && (
          <div className="mt-3 pt-3 border-t border-slate-200 space-y-3 animate-in slide-in-from-top-2 fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. Price Range */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Price Budget (PKR)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
                  {[
                    { label: 'All Prices', val: 'All' },
                    { label: 'Under Rs. 15,000', val: 'under15k' },
                    { label: 'Rs. 15,000 – 30,000', val: '15k-30k' },
                    { label: 'Rs. 30,000 – 60,000', val: '30k-60k' },
                    { label: 'Above Rs. 60,000', val: 'above100k' }
                  ].map((p) => (
                    <button
                      key={p.val}
                      onClick={() => onSelectPriceRange(p.val)}
                      className={`text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                        selectedPriceRange === p.val
                          ? 'bg-slate-900 text-white font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{p.label}</span>
                      {selectedPriceRange === p.val && <Check className="w-3 h-3 text-amber-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Band Material */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Strap / Band Material
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
                  {[
                    { label: 'All Bands', val: 'All' },
                    { label: 'Stainless Steel', val: 'Stainless Steel' },
                    { label: 'Resin / Silicone', val: 'Resin / Silicone' },
                    { label: 'Genuine Leather', val: 'Genuine Leather' },
                    { label: 'Titanium / Mesh', val: 'Titanium' }
                  ].map((b) => (
                    <button
                      key={b.val}
                      onClick={() => onSelectBand(b.val)}
                      className={`text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                        selectedBand === b.val
                          ? 'bg-slate-900 text-white font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{b.label}</span>
                      {selectedBand === b.val && <Check className="w-3 h-3 text-amber-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Movement Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                  Movement / Module
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
                  {[
                    { label: 'All Movements', val: 'All' },
                    { label: 'Quartz (Analog)', val: 'Quartz' },
                    { label: 'Digital', val: 'Digital' },
                    { label: 'Chronograph', val: 'Chronograph' },
                    { label: 'Tough Solar', val: 'Tough Solar' }
                  ].map((m) => (
                    <button
                      key={m.val}
                      onClick={() => onSelectMovement(m.val)}
                      className={`text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between ${
                        selectedMovement === m.val
                          ? 'bg-slate-900 text-white font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{m.label}</span>
                      {selectedMovement === m.val && <Check className="w-3 h-3 text-amber-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-mono">
                {activeFilterCount} filter{activeFilterCount === 1 ? '' : 's'} applied
              </span>
              <button
                onClick={() => setIsFilterPanelOpen(false)}
                className="px-3 py-1 bg-slate-900 text-white font-bold text-xs rounded-md shadow-2xs"
              >
                Close Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
