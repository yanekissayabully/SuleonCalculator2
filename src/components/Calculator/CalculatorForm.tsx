import React, { useEffect } from 'react';
import { useCalculatorStore } from '../../store/calculatorStore';
import { Select } from '../UI/Select';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { VAT_OPTIONS } from '../../utils/constants';

export const CalculatorForm: React.FC = () => {
  const {
    carType,
    inputs,
    isManagerView,
    setCarType,
    setInput,
    setCustomsFee,
    toggleManagerView,
    reset,
    calculate
  } = useCalculatorStore();

  useEffect(() => {
    calculate();
  }, [calculate]);

  const carTypeOptions = [
    { value: 'electric', label: '⚡ Электро' },
    { value: 'hybrid', label: '🔌 Гибрид' },
    { value: 'hybrid28', label: '⛽ Гибрид 28.8%' }
  ];

  const vatOptions = VAT_OPTIONS;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Калькулятор таможенных расходов</h2>
        <Button onClick={toggleManagerView} variant="outline">
          {isManagerView ? '👤 Обычный вид' : '👔 Режим менеджера'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Левая колонка - Выбор авто и основные затраты */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Автомобиль и основные затраты</h3>
          
          <Select
            label="Тип автомобиля"
            value={carType}
            options={carTypeOptions}
            onChange={(value) => setCarType(value as any)}
          />

          <Input
            label="Себестоимость авто ($)"
            value={inputs.carCost}
            onChange={(value) => setInput('carCost', value)}
            managerOnly={true}
            isManagerView={isManagerView}
          />

          <Input
            label="Овер ($)"
            value={inputs.over}
            onChange={(value) => setInput('over', value)}
            managerOnly={true}
            isManagerView={isManagerView}
          />

          <Input
            label="Доставка до Алматы ($)"
            value={inputs.delivery}
            onChange={(value) => setInput('delivery', value)}
            disabled={true}
          />

          <Input
            label="Комиссия компании ($)"
            value={inputs.commission}
            onChange={(value) => setInput('commission', value)}
            disabled={true}
          />
        </div>

        {/* Центральная колонка - Налоги и сборы */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Налоги и сборы</h3>
          
          <Input
            label="Экспедирование ($)"
            value={inputs.expedition}
            onChange={(value) => setInput('expedition', value)}
            disabled={true}
          />

          <Input
            label="Утиль сбор ($)"
            value={inputs.recyclingFee}
            onChange={(value) => setInput('recyclingFee', value)}
            disabled={true}
          />

          {carType === 'hybrid28' && (
            <Input
              label="Пошлина 15% ($)"
              value={inputs.customsDuty}
              onChange={(value) => setInput('customsDuty', value)}
              disabled={true}
            />
          )}

          <Select
            label="Ставка НДС"
            value={inputs.vatRate.toString()}
            options={vatOptions}
            onChange={(value) => setInput('vatRate', parseFloat(value))}
          />

          <Input
            label="Сумма НДС ($)"
            value={inputs.vatAmount}
            onChange={(value) => setInput('vatAmount', value)}
            disabled={true}
          />
        </div>

        {/* Правая колонка - Таможенные сборы и курс */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Таможенные сборы</h3>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={inputs.customsFees.noBenefit}
                onChange={(e) => setCustomsFee('noBenefit', e.target.checked)}
                className="mr-2"
              />
              <span>Без льготы - 46$</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={inputs.customsFees.proofCost}
                onChange={(e) => setCustomsFee('proofCost', e.target.checked)}
                className="mr-2"
              />
              <span>Доказательство стоимости - 400$</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={inputs.customsFees.classSolution}
                onChange={(e) => setCustomsFee('classSolution', e.target.checked)}
                className="mr-2"
              />
              <span>Класс решение - 600$</span>
            </label>
          </div>

          <Input
            label="Курс USD/KZT"
            value={inputs.exchangeRate}
            onChange={(value) => setInput('exchangeRate', value)}
          />

          <div className="pt-4">
            <Button onClick={reset} variant="outline" className="w-full">
              🔄 Сбросить все
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};