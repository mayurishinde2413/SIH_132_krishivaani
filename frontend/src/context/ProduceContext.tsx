import React, { createContext, useContext, useState, useEffect } from 'react';

export interface MarketBenchmark {
  id: number;
  name: string;
  district: string;
  distanceKm: number;
  modalPrice: number;
}

export interface ProduceState {
  crop: string;
  cropId?: number;
  quantityQuintals: number;
  quantityKg: number;
  unit: 'quintal' | 'kg';
  grade: string;
  originLocation: string;
  currentPricePerQuintal: number;
  selectedMarket: MarketBenchmark | null;
  harvestDate: string;
}

interface ProduceContextType {
  produce: ProduceState;
  setCrop: (cropName: string, cropId?: number) => void;
  setQuantity: (quantity: number, unit?: 'quintal' | 'kg') => void;
  setGrade: (grade: string) => void;
  setCurrentPrice: (pricePerQuintal: number) => void;
  setSelectedMarket: (market: MarketBenchmark | null) => void;
  setOriginLocation: (location: string) => void;
  updateProduce: (updates: Partial<ProduceState>) => void;
  resetProduce: () => void;
}

const DEFAULT_PRODUCE: ProduceState = {
  crop: 'Tomato',
  cropId: 3,
  quantityQuintals: 50,
  quantityKg: 5000,
  unit: 'quintal',
  grade: 'Grade A (Firm Red, >45mm)',
  originLocation: 'Baramati, Pune (MH)',
  currentPricePerQuintal: 2800,
  selectedMarket: {
    id: 1,
    name: 'Baramati APMC',
    district: 'Pune',
    distanceKm: 8,
    modalPrice: 2800,
  },
  harvestDate: new Date().toISOString().split('T')[0],
};

const ProduceContext = createContext<ProduceContextType | undefined>(undefined);

export const ProduceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [produce, setProduceState] = useState<ProduceState>(() => {
    try {
      const saved = localStorage.getItem('krishi_lot_context');
      if (saved) {
        return { ...DEFAULT_PRODUCE, ...JSON.parse(saved) };
      }
    } catch (e) {
      // Fallback to default
    }
    return DEFAULT_PRODUCE;
  });

  // Sync to localStorage so lot state survives page navigation and refresh
  useEffect(() => {
    try {
      localStorage.setItem('krishi_lot_context', JSON.stringify(produce));
    } catch (e) {
      // Ignore storage errors
    }
  }, [produce]);

  const updateProduce = (updates: Partial<ProduceState>) => {
    setProduceState((prev) => {
      const next = { ...prev, ...updates };
      // Keep quintals and kg synchronized
      if (updates.quantityQuintals !== undefined && updates.quantityKg === undefined) {
        next.quantityKg = updates.quantityQuintals * 100;
      } else if (updates.quantityKg !== undefined && updates.quantityQuintals === undefined) {
        next.quantityQuintals = Math.round(updates.quantityKg / 100);
      }
      return next;
    });
  };

  const setCrop = (cropName: string, cropId?: number) => {
    updateProduce({ crop: cropName, cropId });
  };

  const setQuantity = (quantity: number, unit: 'quintal' | 'kg' = 'quintal') => {
    if (unit === 'quintal') {
      updateProduce({
        quantityQuintals: quantity,
        quantityKg: quantity * 100,
        unit: 'quintal',
      });
    } else {
      updateProduce({
        quantityQuintals: Math.round(quantity / 100),
        quantityKg: quantity,
        unit: 'kg',
      });
    }
  };

  const setGrade = (grade: string) => {
    updateProduce({ grade });
  };

  const setCurrentPrice = (pricePerQuintal: number) => {
    updateProduce({ currentPricePerQuintal: pricePerQuintal });
  };

  const setSelectedMarket = (market: MarketBenchmark | null) => {
    updateProduce({
      selectedMarket: market,
      currentPricePerQuintal: market ? market.modalPrice : produce.currentPricePerQuintal,
    });
  };

  const setOriginLocation = (originLocation: string) => {
    updateProduce({ originLocation });
  };

  const resetProduce = () => {
    setProduceState(DEFAULT_PRODUCE);
  };

  return (
    <ProduceContext.Provider
      value={{
        produce,
        setCrop,
        setQuantity,
        setGrade,
        setCurrentPrice,
        setSelectedMarket,
        setOriginLocation,
        updateProduce,
        resetProduce,
      }}
    >
      {children}
    </ProduceContext.Provider>
  );
};

export const useProduce = () => {
  const context = useContext(ProduceContext);
  if (!context) {
    throw new Error('useProduce must be used within a ProduceProvider');
  }
  return context;
};
