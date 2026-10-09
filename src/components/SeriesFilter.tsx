import React, { useState } from 'react';
import { SlidersHorizontal, RotateCcw, ChevronDown, Check, X } from 'lucide-react';

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
    { label: 'All Collections', shortLabel: 'All', value: 'All' },
    { label: 'Casio Edifice', shortLabel: 'Edifice', value: 'Casio Edifice' },
    { label: 'Casio G-Shock', shortLabel: 'G-Shock', value: 'Casio G-Shock' },
    { label: 'Casio Vintage', shortLabel: 'Vintage', value: 'Casio Vintage' },
    { label: 'Casio MTP (Men)', shortLabel: 'MTP (Men)', value: 'Casio MTP' },
    { label: 'Casio LTP (Ladies)', shortLabel: 'LTP (Ladies)', value: 'Casio LTP' },
    { label: 'Casio ProTrek', shortLabel: 'ProTrek', value: 'Casio ProTrek' }
  ];

  const activeFilterCount = 
    (selectedPriceRange !== 'All' ? 1 : 0) +
    (selectedBand !== 'All' ? 1 : 0) +
    (selectedMovement !== 'All' ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Primary Collection Tabs - Lifestyle Collection Architectural Underline Strip */}
      <div className="border-b border-neutral-200">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-0 no-scrollbar scroll-smooth">
          {seriesTabs.map((tab) => {
            const isActive = activeSeries === tab.value;

            return (
              <button
                key={tab.value}
                onClick={() => onSelectSeries(tab.value)}
                className={`px-3 sm:px-5 py-3 text-xs sm:text-sm font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer relative shrink-0 ${
                  isActive
                    ? 'text-neutral-950 font-bold'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Filter & Sort Toolbar */}
      <div className="p-3 bg-neutral-50/80 border border-neutral-200 rounded text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {/* Filter Drawer Toggle */}
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
              activeFilterCount > 0 || isFilterPanelOpen
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-800 border-neutral-300 hover:bg-neutral-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Refine</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-neutral-950 text-[10px] font-black flex items-center justify-center font-mono">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Inline Quick Desktop Dropdowns */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Band Material */}
            <select
              value={selectedBand}
              onChange={(e) => onSelectBand(e.target.value)}
              className="bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900 font-medium"
            >
              <option value="All">All Band Materials</option>
              <option value="Stainless Steel">Stainless Steel</option>
              <option value="Resin / Silicone">Resin / Silicone</option>
              <option value="Genuine Leather">Genuine Leather</option>
              <option value="Titanium">Titanium</option>
              <option value="Milanese Mesh">Milanese Mesh</option>
            </select>

            {/* Price Range */}
            <select
              value={selectedPriceRange}
              onChange={(e) => onSelectPriceRange(e.target.value)}
              className="bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900 font-medium"
            >
              <option value="All">All Prices (PKR)</option>
              <option value="under15k">Under PKR 15,000</option>
              <option value="15k-30k">PKR 15,000 – 30,000</option>
              <option value="30k-60k">PKR 30,000 – 60,000</option>
              <option value="60k-100k">PKR 60,000 – 100,000</option>
              <option value="above100k">Above PKR 100,000</option>
            </select>

            {/* Movement */}
            <select
              value={selectedMovement}
              onChange={(e) => onSelectMovement(e.target.value)}
              className="bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs text-neutral-800 focus:outline-none focus:border-neutral-900 font-medium"
            >
              <option value="All">All Movements</option>
              <option value="Quartz">Japanese Quartz</option>
              <option value="Tough Solar">Tough Solar</option>
              <option value="Bluetooth Smart">Bluetooth Smart</option>
              <option value="Digital">Digital Multi-Function</option>
              <option value="Chronograph">Chronograph</option>
            </select>
          </div>
        </div>

        {/* Right Side: Sort By Selector & Reset */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1.5 text-neutral-600 font-medium">
            <span className="hidden sm:inline text-[11px] uppercase tracking-wider text-neutral-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value)}
              className="bg-white border border-neutral-300 rounded px-2.5 py-1.5 text-xs text-neutral-900 font-semibold focus:outline-none focus:border-neutral-900"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="model">Model (A – Z)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-2.5 py-1.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-200/60 rounded flex items-center gap-1 transition-colors cursor-pointer text-xs font-semibold"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Refine Panel (Mobile & Tablet) */}
      {isFilterPanelOpen && (
        <div className="p-4 bg-white border border-neutral-200 rounded space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
            <h4 className="font-bold text-neutral-900 text-xs tracking-wider uppercase">
              Filter By Specifications
            </h4>
            <button
              onClick={() => setIsFilterPanelOpen(false)}
              className="text-neutral-400 hover:text-neutral-900 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {/* Band */}
            <div>
              <label className="block text-neutral-500 font-semibold uppercase text-[10px] tracking-wider mb-1">
                Band Material
              </label>
              <select
                value={selectedBand}
                onChange={(e) => onSelectBand(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded p-2 text-xs"
              >
                <option value="All">All Band Materials</option>
                <option value="Stainless Steel">Stainless Steel</option>
                <option value="Resin / Silicone">Resin / Silicone</option>
                <option value="Genuine Leather">Genuine Leather</option>
                <option value="Titanium">Titanium</option>
                <option value="Milanese Mesh">Milanese Mesh</option>
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-neutral-500 font-semibold uppercase text-[10px] tracking-wider mb-1">
                Price Range
              </label>
              <select
                value={selectedPriceRange}
                onChange={(e) => onSelectPriceRange(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded p-2 text-xs"
              >
                <option value="All">All Prices</option>
                <option value="under15k">Under PKR 15,000</option>
                <option value="15k-30k">PKR 15,000 – 30,000</option>
                <option value="30k-60k">PKR 30,000 – 60,000</option>
                <option value="60k-100k">PKR 60,000 – 100,000</option>
                <option value="above100k">Above PKR 100,000</option>
              </select>
            </div>

            {/* Movement */}
            <div>
              <label className="block text-neutral-500 font-semibold uppercase text-[10px] tracking-wider mb-1">
                Movement Type
              </label>
              <select
                value={selectedMovement}
                onChange={(e) => onSelectMovement(e.target.value)}
                className="w-full bg-neutral-50 border border-neutral-300 rounded p-2 text-xs"
              >
                <option value="All">All Movements</option>
                <option value="Quartz">Japanese Quartz</option>
                <option value="Tough Solar">Tough Solar</option>
                <option value="Bluetooth Smart">Bluetooth Smart</option>
                <option value="Digital">Digital Multi-Function</option>
                <option value="Chronograph">Chronograph</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
