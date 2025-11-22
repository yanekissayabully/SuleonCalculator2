import { CalculatorInputs } from '../types/calculator';

export const DEFAULT_VALUES: Partial<CalculatorInputs> = {
  over: 500,
  delivery: 1100,
  commission: 1500,
  expedition: 998,
  exchangeRate: 541
};

export const VAT_OPTIONS = [
  { value: '0', label: '0% (Льгота)' },
  { value: '0.12', label: '12% (Текущая)' },
  { value: '0.16', label: '16% (2026)' }
];