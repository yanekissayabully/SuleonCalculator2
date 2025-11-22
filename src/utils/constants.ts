import { CalculatorInputs, CarInfo } from '../types/calculator';

export const DEFAULT_VALUES: Partial<CalculatorInputs> = {
  over: 500,
  delivery: 1100,
  commission: 1500,
  expedition: 998,
  exchangeRate: 541
};

export const DEFAULT_CAR_INFO: CarInfo = {
  brand: '',
  model: '',
  trim: '',
  bodyType: 'sedan',
  engineVolume: 0,
  year: new Date().getFullYear(),
  weight: 0
};

export const VAT_OPTIONS = [
  { value: '0', label: '0% (Льгота)' },
  { value: '0.12', label: '12% (Текущая)' },
  { value: '0.16', label: '16% (2026)' }
];

export const BODY_TYPE_OPTIONS = [
  { value: 'sedan', label: 'Седан' },
  { value: 'hatchback', label: 'Хэтчбек' },
  { value: 'station_wagon', label: 'Универсал' },
  { value: 'suv', label: 'Кроссовер/SUV' },
  { value: 'pickup', label: 'Пикап' },
  { value: 'coupe', label: 'Купе' },
  { value: 'convertible', label: 'Кабриолет' }
];