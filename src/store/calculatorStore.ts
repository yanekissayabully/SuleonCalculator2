import { create } from 'zustand';
import { CarType, CalculatorInputs, CalculationResult } from '../types/calculator';
import { calculateTotal, calculateRecyclingFee, calculateCustomsDuty, calculateVAT } from '../utils/calculations';
import { DEFAULT_VALUES } from '../utils/constants';

interface CalculatorState {
  carType: CarType;
  inputs: CalculatorInputs;
  result: CalculationResult | null;
  isManagerView: boolean;
  
  // Actions
  setCarType: (type: CarType) => void;
  setInput: (key: keyof CalculatorInputs, value: any) => void;
  setCustomsFee: (key: keyof CalculatorInputs['customsFees'], value: boolean) => void;
  calculate: () => void;
  toggleManagerView: () => void;
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
    noBenefit: true, // По умолчанию "Без льготы"
    proofCost: false,
    classSolution: false
  },
  exchangeRate: DEFAULT_VALUES.exchangeRate!
};

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  carType: 'electric',
  inputs: initialInputs,
  result: null,
  isManagerView: false,

  setCarType: (carType) => {
    set({ carType });
    // При смене типа авто пересчитываем утиль сбор
    const recyclingFee = calculateRecyclingFee(carType);
    set(state => ({
      inputs: { 
        ...state.inputs, 
        recyclingFee 
      }
    }));
    get().calculate();
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
      // Пересчитываем все зависимые значения
      const priceInChina = inputs.carCost + inputs.over;
      const customsDuty = calculateCustomsDuty(carType, priceInChina);
      const vatAmount = calculateVAT(carType, priceInChina, customsDuty, inputs.vatRate);
      
      // Обновляем inputs с расчетными значениями
      set(state => ({
        inputs: {
          ...state.inputs,
          customsDuty,
          vatAmount
        }
      }));

      // Считаем итоги
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

  toggleManagerView: () => {
    set(state => ({ isManagerView: !state.isManagerView }));
  },

  reset: () => {
    set({ inputs: initialInputs, result: null });
  }
}));