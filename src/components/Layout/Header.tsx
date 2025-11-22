import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Ваш SVG логотип из папки public */}
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/LOGOO.svg" 
                alt="AutoImport Calculator Logo" 
                className="w-full h-full"
              />
            </div>
            {/* <div>
              <h1 className="text-2xl font-bold text-gray-900">AutoImport Calculator</h1>
              <p className="text-gray-600 text-sm">Расчет таможенных расходов</p>
            </div> */}
          </div>
          {/* <div className="text-right">
            <p className="text-sm text-gray-500">Версия 1.0</p>
            <p className="text-xs text-gray-400">Режим менеджера</p>
          </div> */}
        </div>
      </div>
    </header>
  );
};