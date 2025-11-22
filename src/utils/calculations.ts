import { CarType, CalculatorInputs, CalculationResult } from '../types/calculator';

export function calculatePriceInChina(carCost: number, over: number): number {
  return carCost + over;
}

export function calculateRecyclingFee(carType: CarType): number {
  return carType === 'electric' ? 0 : 1272;
}

export function calculateCustomsDuty(carType: CarType, priceInChina: number): number {
  return carType === 'hybrid28' ? priceInChina * 0.15 : 0;
}

export function calculateVAT(
  carType: CarType, 
  priceInChina: number, 
  customsDuty: number, 
  vatRate: number
): number {
  if (carType === 'hybrid28') {
    return (priceInChina + customsDuty) * vatRate;
  } else {
    return priceInChina * vatRate;
  }
}

export function calculateTotalCustomsFees(customsFees: CalculatorInputs['customsFees']): number {
  let total = 0;
  if (customsFees.noBenefit) total += 46;
  if (customsFees.proofCost) total += 400;
  if (customsFees.classSolution) total += 600;
  return total;
}

export function calculateTotal(
  carType: CarType,
  inputs: CalculatorInputs
): CalculationResult {
  // 1) Цена авто в Китае (с учетом овера)
  const priceInChina = calculatePriceInChina(inputs.carCost, inputs.over);
  
  // 2-3) Доставка и комиссия (фиксированные)
  
  // 4) Экспедирование (фиксированное)
  
  // 5) Утиль сбор
  const recyclingFee = calculateRecyclingFee(carType);
  
  // 6) Пошлина 15%
  const customsDuty = calculateCustomsDuty(carType, priceInChina);
  
  // 7) Сумма НДС
  const vatAmount = calculateVAT(carType, priceInChina, customsDuty, inputs.vatRate);
  
  // 8) Таможенные сборы
  const totalCustomsFees = calculateTotalCustomsFees(inputs.customsFees);
  
  // Итого под ключ $
  const totalUSD = priceInChina + 
                  inputs.delivery + 
                  inputs.commission + 
                  inputs.expedition + 
                  recyclingFee + 
                  customsDuty + 
                  vatAmount + 
                  totalCustomsFees;
  
  // Итого под ключ в тенге
  const totalKZT = totalUSD * inputs.exchangeRate;
  
  // Маржа
  const margin = inputs.commission + inputs.over;
  
  return {
    priceInChina,
    totalUSD,
    totalKZT,
    margin
  };
}