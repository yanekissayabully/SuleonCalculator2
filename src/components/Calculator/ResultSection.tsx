import React, { useRef } from 'react';
import { useCalculatorStore } from '../../store/calculatorStore';
import { calculateTotalCustomsFees } from '../../utils/calculations';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const ResultsSection: React.FC = () => {
  const { result, carType, carInfo, inputs } = useCalculatorStore();
  const printRef = useRef<HTMLDivElement>(null);

  if (!result) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <p className="text-yellow-700">Введите данные для расчета</p>
      </div>
    );
  }

  const totalCustomsFees = calculateTotalCustomsFees(inputs.customsFees);

  // Функция для получения названия типа кузова
  const getBodyTypeLabel = (bodyType: string) => {
    const bodyTypes: { [key: string]: string } = {
      sedan: 'Седан',
      hatchback: 'Хэтчбек',
      station_wagon: 'Универсал',
      suv: 'Кроссовер/SUV',
      pickup: 'Пикап',
      coupe: 'Купе',
      convertible: 'Кабриолет'
    };
    return bodyTypes[bodyType] || bodyType;
  };

  const getCarTypeLabel = () => {
    if (carType === 'electric') return 'Электро';
    if (carType === 'hybrid') return 'Гибрид';
    return 'Гибрид 28.8%';
  };

  // Функция экспорта в PDF с поддержкой кириллицы
  const exportToPDF = async () => {
    if (!printRef.current) return;

    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      const fileName = `Расчет_${carInfo.brand}_${carInfo.model}_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Ошибка при создании PDF:', error);
      alert('Произошла ошибка при создании PDF файла');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Заголовок с кнопкой */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-900">Результаты расчета</h3>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition-colors duration-200 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Экспорт в PDF
        </button>
      </div>

      <div ref={printRef} className="p-6">
        {/* Информация об автомобиле */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Информация об автомобиле</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 text-sm bg-gray-50 p-4 rounded-md">
            <div>
              <span className="text-xs text-gray-500 block mb-1">Марка</span>
              <p className="text-gray-900 font-medium">{carInfo.brand || 'Не указана'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 block mb-1">Модель</span>
              <p className="text-gray-900 font-medium">{carInfo.model || 'Не указана'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 block mb-1">Комплектация</span>
              <p className="text-gray-900 font-medium">{carInfo.trim || 'Не указана'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 block mb-1">Тип кузова</span>
              <p className="text-gray-900 font-medium">{getBodyTypeLabel(carInfo.bodyType)}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 block mb-1">Объем двигателя</span>
              <p className="text-gray-900 font-medium">
                {carType === 'electric' ? 'Электро' : `${carInfo.engineVolume || 'Не указан'} л`}
              </p>
            </div>
            <div>
              <span className="text-xs text-gray-500 block mb-1">Год выпуска</span>
              <p className="text-gray-900 font-medium">{carInfo.year}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 block mb-1">Вес</span>
              <p className="text-gray-900 font-medium">{carInfo.weight ? `${carInfo.weight} кг` : 'Не указан'}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 block mb-1">Тип автомобиля</span>
              <p className="text-gray-900 font-medium">{getCarTypeLabel()}</p>
            </div>
          </div>
        </div>
        
        {/* Основные итоги */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Итоговая стоимость</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <p className="text-xs text-gray-600 font-medium mb-1">Итого в USD</p>
              <p className="text-xl font-bold text-gray-900">${result.totalUSD.toFixed(1)}</p>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
              <p className="text-xs text-gray-600 font-medium mb-1">Итого в KZT</p>
              <p className="text-xl font-bold text-gray-900">{Math.round(result.totalKZT).toLocaleString()} ₸</p>
            </div>
            
            <div className="bg-gray-50 border border-purple-200 rounded-md p-3">
              <p className="text-xs text-gray-600 font-medium mb-1">Маржа</p>
              <p className="text-xl font-bold text-gray-900">${result.margin.toFixed(1)}</p>
            </div>
            
            <div className="bg-gray-50 border border-gary-200 rounded-md p-3">
              <p className="text-xs text-gray-600 font-medium mb-1">Цена в Китае</p>
              <p className="text-xl font-bold text-gray-900">${result.priceInChina.toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* Детализация расходов */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Детализация расходов</h4>
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">Статья расходов</th>
                  <th className="text-right px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">Сумма (USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-700">Цена авто в Китае (себес + овер)</td>
                  <td className="px-4 py-2.5 text-right font-medium text-gray-900">${result.priceInChina.toFixed(1)}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-700">Доставка до Алматы</td>
                  <td className="px-4 py-2.5 text-right font-medium text-gray-900">${inputs.delivery.toFixed(1)}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-700">Комиссия компании</td>
                  <td className="px-4 py-2.5 text-right font-medium text-gray-900">${inputs.commission.toFixed(1)}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-700">Экспедирование</td>
                  <td className="px-4 py-2.5 text-right font-medium text-gray-900">${inputs.expedition.toFixed(1)}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-700">Утиль сбор</td>
                  <td className="px-4 py-2.5 text-right font-medium text-gray-900">${inputs.recyclingFee.toFixed(1)}</td>
                </tr>
                {carType === 'hybrid28' && (
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 text-gray-700">Пошлина 15%</td>
                    <td className="px-4 py-2.5 text-right font-medium text-gray-900">${inputs.customsDuty.toFixed(1)}</td>
                  </tr>
                )}
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-700">НДС {(inputs.vatRate * 100).toFixed(0)}%</td>
                  <td className="px-4 py-2.5 text-right font-medium text-gray-900">${inputs.vatAmount.toFixed(1)}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2.5 text-gray-700">Таможенные сборы</td>
                  <td className="px-4 py-2.5 text-right font-medium text-gray-900">${totalCustomsFees.toFixed(1)}</td>
                </tr>
                <tr className="bg-gray-100 border-t-2 border-gray-300">
                  <td className="px-4 py-3 text-gray-900 font-bold">ИТОГО</td>
                  <td className="px-4 py-3 text-right font-bold text-lg text-gray-900">${result.totalUSD.toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Примечания */}
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
          <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">Примечания</h4>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-600">
            <div>
              <span className="font-medium text-gray-700">Курс USD:</span> {inputs.exchangeRate} KZT
            </div>
            <div>
              <span className="font-medium text-gray-700">Тип расчета:</span> {getCarTypeLabel()}
            </div>
            <div>
              <span className="font-medium text-gray-700">Маржа:</span> ${result.margin.toFixed(2)}
            </div>
            <div>
              <span className="font-medium text-gray-700">Дата:</span> {new Date().toLocaleDateString('ru-RU')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};