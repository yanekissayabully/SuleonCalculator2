import React from 'react';
import { useCalculatorStore } from '../../store/calculatorStore';
import { calculateTotalCustomsFees } from '../../utils/calculations';

export const ResultsSection: React.FC = () => {
  const { result, carType, inputs, isManagerView } = useCalculatorStore();

  if (!result) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-700">Введите данные для расчета</p>
      </div>
    );
  }

  const totalCustomsFees = calculateTotalCustomsFees(inputs.customsFees);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Результаты расчета</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="result-card result-positive">
          <h4 className="font-semibold text-gray-600">Итого в USD</h4>
          <p className="text-2xl font-bold text-green-600">${result.totalUSD.toFixed(2)}</p>
        </div>
        
        <div className="result-card result-warning">
          <h4 className="font-semibold text-gray-600">Итого в KZT</h4>
          <p className="text-2xl font-bold text-yellow-600">{Math.round(result.totalKZT).toLocaleString()} ₸</p>
        </div>
        
        {isManagerView && (
          <div className="result-card result-positive">
            <h4 className="font-semibold text-gray-600">Маржа</h4>
            <p className="text-2xl font-bold text-blue-600">${result.margin.toFixed(2)}</p>
          </div>
        )}
        
        <div className="result-card result-warning">
          <h4 className="font-semibold text-gray-600">Цена в Китае</h4>
          <p className="text-2xl font-bold text-purple-600">${result.priceInChina.toFixed(2)}</p>
        </div>
      </div>

      {/* Детализация расходов */}
      <div className="border-t pt-4">
        <h4 className="font-semibold text-gray-700 mb-3">Детализация расходов ($):</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Цена авто в Китае (себес + овер):</span>
            <span>${result.priceInChina.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Доставка до Алматы:</span>
            <span>${inputs.delivery.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Комиссия компании:</span>
            <span>${inputs.commission.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Экспедирование:</span>
            <span>${inputs.expedition.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Утиль сбор:</span>
            <span>${inputs.recyclingFee.toFixed(2)}</span>
          </div>
          {carType === 'hybrid28' && (
            <div className="flex justify-between">
              <span>Пошлина 15%:</span>
              <span>${inputs.customsDuty.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>НДС {(inputs.vatRate * 100).toFixed(0)}%:</span>
            <span>${inputs.vatAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Таможенные сборы:</span>
            <span>${totalCustomsFees.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t pt-2 font-semibold">
            <span>ИТОГО:</span>
            <span>${result.totalUSD.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Примечания */}
      <div className="border-t pt-4 mt-4">
        <h4 className="font-semibold text-gray-700 mb-2">Примечания:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Курс USD: {inputs.exchangeRate} KZT</li>
          <li>• Тип расчета: {carType === 'electric' ? 'Электро' : carType === 'hybrid' ? 'Гибрид' : 'Гибрид 28.8%'}</li>
          {isManagerView && (
            <li>• 💰 Маржа: ${result.margin.toFixed(2)}</li>
          )}
        </ul>
      </div>
    </div>
  );
};