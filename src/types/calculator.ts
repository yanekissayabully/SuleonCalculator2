export type CarType = 'electric' | 'hybrid' | 'hybrid28';

export interface CalculatorInputs {
  carCost: number; // Себес
  over: number; // Овер
  delivery: number; // Доставка
  commission: number; // Комиссия
  expedition: number; // Экспедирование
  recyclingFee: number; // Утиль сбор
  customsDuty: number; // Пошлина 15%
  vatRate: number; // Процент НДС
  vatAmount: number; // Сумма НДС
  customsFees: {
    noBenefit: boolean; // Без льготы - 46$
    proofCost: boolean; // Доказательство стоимости - 400$
    classSolution: boolean; // Класс решение - 600$
  };
  exchangeRate: number; // Курс
}

export interface CalculationResult {
  priceInChina: number; // Цена авто в Китае
  totalUSD: number; // Итого под ключ $
  totalKZT: number; // Итого под ключ в тенге
  margin: number; // Маржа
}