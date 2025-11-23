import React, { useEffect } from 'react';
import { useCalculatorStore } from '../../store/calculatorStore';
import { Select } from '../UI/Select';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { VAT_OPTIONS, BODY_TYPE_OPTIONS } from '../../utils/constants';

export const CalculatorForm: React.FC = () => {
  const {
    carType,
    carInfo,
    inputs,
    setCarType,
    setCarInfo,
    setInput,
    setCustomsFee,
    reset,
    calculate
  } = useCalculatorStore();

  useEffect(() => {
    calculate();
  }, [calculate]);

  const carTypeOptions = [
    { value: 'electric', label: 'Электро' },
    { value: 'hybrid', label: 'Гибрид' },
    { value: 'hybrid28', label: 'Гибрид 28.8%' }
  ];

  const vatOptions = VAT_OPTIONS;
  const bodyTypeOptions = BODY_TYPE_OPTIONS;

  // Годы для выбора (последние 10 лет)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString()
  }));

  // Вспомогательная функция для отображения числовых значений
  const formatNumberValue = (value: number) => {
    return value === 0 ? '' : value.toString();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Калькулятор таможенных расходов</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Колонка 1 - Информация об автомобиле */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Информация об автомобиле</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Тип автомобиля"
              value={carType}
              options={carTypeOptions}
              onChange={(value) => setCarType(value as any)}
            />

            <Input
              label="Марка"
              value={carInfo.brand}
              onChange={(value) => setCarInfo('brand', value)}
              type="text"
              placeholder="Например: BYD"
            />

            <Input
              label="Модель"
              value={carInfo.model}
              onChange={(value) => setCarInfo('model', value)}
              type="text"
              placeholder="Например: Song Plus"
            />

            <Input
              label="Комплектация"
              value={carInfo.trim}
              onChange={(value) => setCarInfo('trim', value)}
              type="text"
              placeholder="Например: Premium"
            />

            <Select
              label="Тип кузова"
              value={carInfo.bodyType}
              options={bodyTypeOptions}
              onChange={(value) => setCarInfo('bodyType', value as any)}
            />

            <Input
              label="Объем двигателя (л)"
              value={formatNumberValue(carInfo.engineVolume)}
              onChange={(value) => setCarInfo('engineVolume', value === '' ? 0 : parseFloat(value) || 0)}
              placeholder="1.5, 2.0, etc."
              disabled={carType === 'electric'}
            />

            <Select
              label="Год выпуска"
              value={carInfo.year.toString()}
              options={yearOptions}
              onChange={(value) => setCarInfo('year', parseInt(value))}
            />

            <Input
              label="Вес (кг)"
              value={formatNumberValue(carInfo.weight)}
              onChange={(value) => setCarInfo('weight', value === '' ? 0 : parseFloat(value) || 0)}
              placeholder="Например: 1500"
            />
          </div>
        </div>

        {/* Колонка 2 - Основные затраты */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Основные затраты</h3>
          
          <Input
            label="Себестоимость авто ($)"
            value={formatNumberValue(inputs.carCost)}
            onChange={(value) => setInput('carCost', value === '' ? 0 : parseFloat(value) || 0)}
            placeholder="0"
          /> 

          <Input
            label="Овер ($)"
            value={formatNumberValue(inputs.over)}
            onChange={(value) => setInput('over', value === '' ? 0 : parseFloat(value) || 0)}
            placeholder="500"
          />

          <Input
            label="Доставка до Алматы ($)"
            value={inputs.delivery.toString()}
            onChange={(value) => setInput('delivery', value)}
            disabled={true}
          />

          <Input
            label="Комиссия компании ($)"
            value={inputs.commission.toString()}
            onChange={(value) => setInput('commission', value)}
            disabled={true}
          />

          <Input
            label="Экспедирование ($)"
            value={inputs.expedition.toString()}
            onChange={(value) => setInput('expedition', value)}
            disabled={true}
          />
        </div>

        {/* Колонка 3 - Налоги и сбор */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Налоги и сборы</h3>
          
          <Input
            label="Утиль сбор ($)"
            value={inputs.recyclingFee.toString()}
            onChange={(value) => setInput('recyclingFee', value)}
            disabled={true}
          />

          {carType === 'hybrid28' && (
            <Input
              label="Пошлина 15% ($)"
              value={inputs.customsDuty.toString()}
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
            value={inputs.vatAmount.toString()}
            onChange={(value) => setInput('vatAmount', value)}
            disabled={true}
          />

          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-700 mb-3">Таможенные сборы</h4>
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
          </div>

          <Input
            label="Курс USD/KZT"
            value={formatNumberValue(inputs.exchangeRate)}
            onChange={(value) => setInput('exchangeRate', value === '' ? 0 : parseFloat(value) || 0)}
            placeholder="541"
          />

          <div className="pt-4">
            <Button onClick={reset} variant="outline" className="w-full">
              Сбросить все
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};