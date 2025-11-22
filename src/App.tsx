import React from 'react';
import { CalculatorForm } from './components/Calculator/CalculatorForm';
import { ResultsSection } from './components/Calculator/ResultSection';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Калькулятор таможенных расходов
          </h1>
          <p className="text-gray-600">
            Расчет стоимости импорта автомобилей из Китая в Казахстан
          </p>
        </div>

        <div className="space-y-6">
          <CalculatorForm />
          <ResultsSection />
        </div>

        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>• Данные актуальны на {new Date().toLocaleDateString('ru-RU')}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;