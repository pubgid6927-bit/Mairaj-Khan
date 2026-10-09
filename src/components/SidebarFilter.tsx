import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  X, 
  RotateCcw, 
  Check, 
  Filter
} from 'lucide-react';
import { WatchSeries, BandMaterial, MovementType } from '../types';

interface SidebarFilterProps {
  activeSeries: string;
  onSelectSeries: (series: string) => void;
  seriesCounts: Record<string, number>;
  totalCount: number;

  selectedGender: string;
  onSelectGender: (gender: string) => void;

  selectedBand: string;
  onSelectBand: (band: string) => void;

  selectedPriceRange: string;
  onSelectPriceRange: (range: string) => void;

  selectedMovement: string;
  onSelectMovement: (movement: string) => void;

  selectedWaterResistance: string;
  onSelectWaterResistance: (wr: string) => void;

  onResetFilters: () => void;
  hasActiveFilters: boolean;

  // Mobile drawer control
  isMobileDrawerOpen: boolean;
  onCloseMobileDrawer: () => void;
}

export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  activeSeries,
  onSelectSeries,
  seriesCounts,
  totalCount,
  selectedGender,
  onSelectGender,
  selectedBand,
  onSelectBand,
  selectedPriceRange,
  onSelectPriceRange,
  selectedMovement,
  onSelectMovement,
  selectedWaterResistance,
  onSelectWaterResistance,
  onResetFilters,
  hasActiveFilters,
  isMobileDrawerOpen,
  onCloseMobileDrawer
}) => {
  // Collapsible section states (all open by default for rich boutique e-commerce)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    gender: true,
    series: true,
    price: true,
    band: true,
    movement: true,
    water: false
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const seriesList: { label: string; value: string }[] = [
    { label: 'All Collections', value: 'All' },
    { label: 'Casio Edifice (Motorsport)', value: 'Casio Edifice' },
    { label: 'Casio G-Shock (Shockproof)', value: 'Casio G-Shock' },
    { label: 'Casio Vintage (Retro)', value: 'Casio Vintage' },
    { label: 'Casio MTP (Men Classics)', value: 'Casio MTP' },
    { label: 'Casio LTP (Ladies Dress)', value: 'Casio LTP' },
    { label: 'Casio ProTrek (Outdoor)', value: 'Casio ProTrek' }
  ];

  const genderList = [
    { label: 'All Genders', value: 'All' },
    { label: 'Men', value: 'Men' },
    { label: 'Ladies', value: 'Ladies' },
    { label: 'Unisex', value: 'Unisex' }
  ];

  const priceRanges = [
    { label: 'All Prices', value: 'All' },
    { label: 'Under PKR 15,000', value: 'under15k' },
    { label: 'PKR 15,000 – PKR 30,000', value: '15k-30k' },
    { label: 'PKR 30,000 – PKR 60,000', value: '30k-60k' },
    { label: 'PKR 60,000 – PKR 100,000', value: '60k-100k' },
    { label: 'Above PKR 100,000', value: 'above100k' }
  ];

  const bandMaterials: { label: string; value: string }[] = [
    { label: 'All Materials', value: 'All' },
    { label: 'Stainless Steel', value: 'Stainless Steel' },
    { label: 'Genuine Leather', value: 'Genuine Leather' },
    { label: 'Resin / Silicone', value: 'Resin / Silicone' },
    { label: 'Titanium', value: 'Titanium' },
    { label: 'Milanese Mesh', value: 'Milanese Mesh' }
  ];

  const movementTypes: { label: string; value: string }[] = [
    { label: 'All Movements', value: 'All' },
    { label: 'Japanese Quartz', value: 'Quartz' },
    { label: 'Tough Solar', value: 'Tough Solar' },
    { label: 'Digital Multi-Function', value: 'Digital' },
    { label: 'Chronograph', value: 'Chronograph' },
    { label: 'Bluetooth Smart', value: 'Bluetooth Smart' }
  ];

  const waterResistances = [
    { label: 'All Ratings', value: 'All' },
    { label: '30M (Daily Splash)', value: '30' },
    { label: '50M (Swimming)', value: '50' },
    { label: '100M (Watersports)', value: '100' },
    { label: '200M (Diver Grade)', value: '200' }
  ];

  const renderFilterContent = () => (
    <div className="space-y-6 text-xs text-neutral-800 font-sans">
      {/* Header with Title & Reset Button */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-900" />
          <span className="font-bold tracking-[0.14em] uppercase text-neutral-950 text-xs">
            Filters & Refine
          </span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-[11px] font-bold text-amber-800 hover:text-black flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* 1. GENDER FILTER */}
      <div className="border-b border-neutral-200/80 pb-4">
        <button
          onClick={() => toggleSection('gender')}
          className="w-full flex items-center justify-between py-1 text-left font-bold tracking-wider uppercase text-neutral-900 hover:text-amber-800 transition-colors cursor-pointer"
        >
          <span>Gender</span>
          {openSections.gender ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {openSections.gender && (
          <div className="mt-2.5 space-y-1.5 pl-0.5">
            {genderList.map((item) => {
              const isSelected = selectedGender === item.value;
              return (
                <label
                  key={item.value}
                  className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-neutral-50 cursor-pointer text-xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="gender_filter"
                      checked={isSelected}
                      onChange={() => onSelectGender(item.value)}
                      className="accent-neutral-950 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className={`${isSelected ? 'font-bold text-neutral-950' : 'text-neutral-700 group-hover:text-black'}`}>
                      {item.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. COLLECTION / SERIES (BRANDS) */}
      <div className="border-b border-neutral-200/80 pb-4">
        <button
          onClick={() => toggleSection('series')}
          className="w-full flex items-center justify-between py-1 text-left font-bold tracking-wider uppercase text-neutral-900 hover:text-amber-800 transition-colors cursor-pointer"
        >
          <span>Casio Collections</span>
          {openSections.series ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {openSections.series && (
          <div className="mt-2.5 space-y-1.5 pl-0.5 max-h-56 overflow-y-auto no-scrollbar">
            {seriesList.map((item) => {
              const isSelected = activeSeries === item.value;
              const count = item.value === 'All' ? totalCount : (seriesCounts[item.value] || 0);

              return (
                <label
                  key={item.value}
                  className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-neutral-50 cursor-pointer text-xs group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="radio"
                      name="series_filter"
                      checked={isSelected}
                      onChange={() => onSelectSeries(item.value)}
                      className="accent-neutral-950 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className={`truncate ${isSelected ? 'font-bold text-neutral-950' : 'text-neutral-700 group-hover:text-black'}`}>
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 pl-2">({count})</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. PRICE RANGE */}
      <div className="border-b border-neutral-200/80 pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between py-1 text-left font-bold tracking-wider uppercase text-neutral-900 hover:text-amber-800 transition-colors cursor-pointer"
        >
          <span>Price Range (PKR)</span>
          {openSections.price ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {openSections.price && (
          <div className="mt-2.5 space-y-1.5 pl-0.5">
            {priceRanges.map((range) => {
              const isSelected = selectedPriceRange === range.value;
              return (
                <label
                  key={range.value}
                  className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-neutral-50 cursor-pointer text-xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="price_filter"
                      checked={isSelected}
                      onChange={() => onSelectPriceRange(range.value)}
                      className="accent-neutral-950 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className={`${isSelected ? 'font-bold text-neutral-950' : 'text-neutral-700 group-hover:text-black'}`}>
                      {range.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. STRAP / BAND MATERIAL */}
      <div className="border-b border-neutral-200/80 pb-4">
        <button
          onClick={() => toggleSection('band')}
          className="w-full flex items-center justify-between py-1 text-left font-bold tracking-wider uppercase text-neutral-900 hover:text-amber-800 transition-colors cursor-pointer"
        >
          <span>Strap / Band Material</span>
          {openSections.band ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {openSections.band && (
          <div className="mt-2.5 space-y-1.5 pl-0.5">
            {bandMaterials.map((band) => {
              const isSelected = selectedBand === band.value;
              return (
                <label
                  key={band.value}
                  className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-neutral-50 cursor-pointer text-xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="band_filter"
                      checked={isSelected}
                      onChange={() => onSelectBand(band.value)}
                      className="accent-neutral-950 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className={`${isSelected ? 'font-bold text-neutral-950' : 'text-neutral-700 group-hover:text-black'}`}>
                      {band.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. MOVEMENT TYPE */}
      <div className="border-b border-neutral-200/80 pb-4">
        <button
          onClick={() => toggleSection('movement')}
          className="w-full flex items-center justify-between py-1 text-left font-bold tracking-wider uppercase text-neutral-900 hover:text-amber-800 transition-colors cursor-pointer"
        >
          <span>Movement & Calibre</span>
          {openSections.movement ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {openSections.movement && (
          <div className="mt-2.5 space-y-1.5 pl-0.5">
            {movementTypes.map((mv) => {
              const isSelected = selectedMovement === mv.value;
              return (
                <label
                  key={mv.value}
                  className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-neutral-50 cursor-pointer text-xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="movement_filter"
                      checked={isSelected}
                      onChange={() => onSelectMovement(mv.value)}
                      className="accent-neutral-950 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className={`${isSelected ? 'font-bold text-neutral-950' : 'text-neutral-700 group-hover:text-black'}`}>
                      {mv.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. WATER RESISTANCE */}
      <div className="pb-2">
        <button
          onClick={() => toggleSection('water')}
          className="w-full flex items-center justify-between py-1 text-left font-bold tracking-wider uppercase text-neutral-900 hover:text-amber-800 transition-colors cursor-pointer"
        >
          <span>Water Resistance</span>
          {openSections.water ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
        </button>

        {openSections.water && (
          <div className="mt-2.5 space-y-1.5 pl-0.5">
            {waterResistances.map((wr) => {
              const isSelected = selectedWaterResistance === wr.value;
              return (
                <label
                  key={wr.value}
                  className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-neutral-50 cursor-pointer text-xs group"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="water_filter"
                      checked={isSelected}
                      onChange={() => onSelectWaterResistance(wr.value)}
                      className="accent-neutral-950 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span className={`${isSelected ? 'font-bold text-neutral-950' : 'text-neutral-700 group-hover:text-black'}`}>
                      {wr.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Sticky left column) */}
      <aside className="hidden lg:block w-64 xl:w-72 shrink-0 bg-white border border-neutral-200/90 rounded-lg p-5 shadow-2xs self-start sticky top-28">
        {renderFilterContent()}
      </aside>

      {/* Mobile / Tablet Drawer */}
      {isMobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden bg-neutral-950/70 backdrop-blur-xs flex justify-end">
          <div className="fixed inset-0" onClick={onCloseMobileDrawer} />

          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 overflow-y-auto animate-in slide-in-from-right duration-200 z-10">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <span className="font-bold text-neutral-950 uppercase tracking-wider text-sm font-serif">
                Refine Selection
              </span>
              <button
                onClick={onCloseMobileDrawer}
                className="p-1.5 text-neutral-400 hover:text-neutral-950 rounded-full hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 flex-1">
              {renderFilterContent()}
            </div>

            <button
              onClick={onCloseMobileDrawer}
              className="w-full py-3 bg-neutral-950 text-white font-bold tracking-wider uppercase rounded text-xs shadow-md mt-4 cursor-pointer"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </>
  );
};
