import React from 'react';
import { Header } from './components/Layout/Header';
import { CalculatorForm } from './components/Calculator/CalculatorForm';
import { ResultsSection } from './components/Calculator/ResultSection';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-6">
          <CalculatorForm />
          <ResultsSection />
        </div>
        
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Данные актуальны на {new Date().toLocaleDateString('ru-RU')}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;