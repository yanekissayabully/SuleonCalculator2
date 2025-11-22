import { create } from 'zustand';
import { CarType, CarInfo, CalculatorInputs, CalculationResult } from '../types/calculator';
import { calculateTotal, calculateRecyclingFee, calculateCustomsDuty, calculateVAT } from '../utils/calculations';
import { DEFAULT_VALUES, DEFAULT_CAR_INFO } from '../utils/constants';

interface CalculatorState {
  carType: CarType;
  carInfo: CarInfo;
  inputs: CalculatorInputs;
  result: CalculationResult | null;
  
  // Actions
  setCarType: (type: CarType) => void;
  setCarInfo: (key: keyof CarInfo, value: any) => void;
  setInput: (key: keyof CalculatorInputs, value: any) => void;
  setCustomsFee: (key: keyof CalculatorInputs['customsFees'], value: boolean) => void;
  calculate: () => void;
  reset: () => void;
}

const initialInputs: CalculatorInputs = {
  carCost: 0,
  over: DEFAULT_VALUES.over!,
  delivery: DEFAULT_VALUES.delivery!,
  commission: DEFAULT_VALUES.commission!,
  expedition: DEFAULT_VALUES.expedition!,
  recyclingFee: 0,
  customsDuty: 0,
  vatRate: 0.12,
  vatAmount: 0,
  customsFees: {
    noBenefit: true,
    proofCost: false,
    classSolution: false
  },
  exchangeRate: DEFAULT_VALUES.exchangeRate!
};

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  carType: 'electric',
  carInfo: DEFAULT_CAR_INFO,
  inputs: initialInputs,
  result: null,

  setCarType: (carType) => {
    set({ carType });
    const recyclingFee = calculateRecyclingFee(carType);
    set(state => ({
      inputs: { 
        ...state.inputs, 
        recyclingFee 
      }
    }));
    get().calculate();
  },

  setCarInfo: (key, value) => {
    set(state => ({
      carInfo: { ...state.carInfo, [key]: value }
    }));
  },

  setInput: (key, value) => {
    set(state => ({
      inputs: { ...state.inputs, [key]: value }
    }));
    setTimeout(() => get().calculate(), 0);
  },

  setCustomsFee: (key, value) => {
    set(state => ({
      inputs: { 
        ...state.inputs, 
        customsFees: { 
          ...state.inputs.customsFees, 
          [key]: value 
        } 
      }
    }));
    setTimeout(() => get().calculate(), 0);
  },

  calculate: () => {
    const { carType, inputs } = get();
    try {
      const priceInChina = inputs.carCost + inputs.over;
      const customsDuty = calculateCustomsDuty(carType, priceInChina);
      const vatAmount = calculateVAT(carType, priceInChina, customsDuty, inputs.vatRate);
      
      set(state => ({
        inputs: {
          ...state.inputs,
          customsDuty,
          vatAmount
        }
      }));

      const result = calculateTotal(carType, {
        ...inputs,
        customsDuty,
        vatAmount
      });
      
      set({ result });
    } catch (error) {
      console.error('Calculation error:', error);
    }
  },

  reset: () => {
    set({ 
      inputs: initialInputs, 
      carInfo: DEFAULT_CAR_INFO,
      result: null 
    });
  }
}));