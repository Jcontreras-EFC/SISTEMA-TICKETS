import React from 'react';

const BackupCorreos = () => {
  return (
    <div className="pl-8">
      <h1 className="text-2xl font-bold mb-4">Backup de Correos</h1>
      <div className="overflow-x-auto">
        <table className="w-full max-w-2xl bg-white border border-gray-200 rounded-xl shadow-sm text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-2">Columna 1</th>
              <th className="px-4 py-2">Columna 2</th>
              <th className="px-4 py-2">Columna 3</th>
            </tr>
          </thead>
          <tbody>
            <tr className="odd:bg-white even:bg-blue-50">
              <td className="px-4 py-2">Dato 1</td>
              <td className="px-4 py-2">Dato 2</td>
              <td className="px-4 py-2">Dato 3</td>
            </tr>
            <tr className="odd:bg-white even:bg-blue-50">
              <td className="px-4 py-2">Dato 4</td>
              <td className="px-4 py-2">Dato 5</td>
              <td className="px-4 py-2">Dato 6</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BackupCorreos; 