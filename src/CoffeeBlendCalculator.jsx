import React, { useState } from 'react';
import crazeLogo from './assets/craze_coffee_rgb_wit.png';

const CoffeeBlendCalculator = () => {
  const [components, setComponents] = useState([
    { name: 'Component A', ratio: 1 },
    { name: 'Component B', ratio: 1 },
  ]);
  const [inputType, setInputType] = useState('component');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [inputMass, setInputMass] = useState('');
  const [results, setResults] = useState([]);

  const totalRatio = components.reduce((sum, c) => sum + parseFloat(c.ratio || 0), 0);

  const handleComponentChange = (index, field, value) => {
    const newComponents = [...components];
    newComponents[index][field] = field === 'ratio' ? parseFloat(value) || 0 : value;
    setComponents(newComponents);
  };

  const addComponent = () => {
    setComponents([...components, { name: `Component ${components.length + 1}`, ratio: 1 }]);
  };

  const removeComponent = (index) => {
    const newComponents = components.filter((_, i) => i !== index);
    setComponents(newComponents);
    if (selectedIndex >= newComponents.length) setSelectedIndex(0);
  };

  const calculate = () => {
    const parsedMass = parseFloat(inputMass);
    if (!parsedMass || totalRatio === 0) return;

    let baseMass;
    if (inputType === 'component') {
      const selectedRatio = components[selectedIndex].ratio;
      baseMass = parsedMass / selectedRatio;
    } else {
      baseMass = parsedMass / totalRatio;
    }

    const result = components.map(c => ({
      name: c.name,
      mass: parseFloat((c.ratio * baseMass).toFixed(2)),
    }));

    setResults(result);
  };

  const exportCSV = () => {
    if (!results.length) return;
    const header = 'Component,Mass (g)';
    const rows = results.map(r => `${r.name},${r.mass}`);
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'blend.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <img src={crazeLogo} alt="Craze Coffee Logo" className="h-24 w-auto" />
        </div>
        <h1 className="text-3xl font-bold mb-6 text-center">Coffee Blend Calculator</h1>

        <div className="space-y-4">
          {components.map((component, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                className="flex-1 p-2 bg-gray-800 text-white border border-gray-700 rounded"
                value={component.name}
                onChange={e => handleComponentChange(index, 'name', e.target.value)}
              />
              <input
                type="number"
                className="w-24 p-2 bg-gray-800 text-white border border-gray-700 rounded"
                value={component.ratio}
                onChange={e => handleComponentChange(index, 'ratio', e.target.value)}
              />
              <button
                onClick={() => removeComponent(index)}
                className="text-red-400 hover:text-red-600"
              >×</button>
            </div>
          ))}

          <button
            onClick={addComponent}
            className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded text-white"
          >+ Add Component</button>
        </div>

        <div className="mt-8">
          <div className="flex gap-4 items-center flex-wrap">
            <label>
              <input
                type="radio"
                value="component"
                checked={inputType === 'component'}
                onChange={() => setInputType('component')}
              />{' '}
              Based on component mass
            </label>
            <label>
              <input
                type="radio"
                value="total"
                checked={inputType === 'total'}
                onChange={() => setInputType('total')}
              />{' '}
              Based on total mass
            </label>

            {inputType === 'component' && (
              <select
                value={selectedIndex}
                onChange={e => setSelectedIndex(Number(e.target.value))}
                className="bg-gray-800 text-white border border-gray-700 p-2 rounded"
              >
                {components.map((c, i) => (
                  <option key={i} value={i}>{c.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="mt-4">
            <input
              type="number"
              className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded"
              placeholder={inputType === 'component' ? 'Enter component mass (g)' : 'Enter total blend mass (g)'}
              value={inputMass}
              onChange={e => setInputMass(e.target.value)}
            />
          </div>

          <div className="mt-4 flex gap-4 flex-wrap">
            <button
              onClick={calculate}
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-white"
            >Calculate</button>
            <button
              onClick={exportCSV}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded text-white"
            >Export CSV</button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Results</h2>
            <table className="w-full text-left border border-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-2 border-b border-gray-700">Component</th>
                  <th className="p-2 border-b border-gray-700">Mass (g)</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-t border-gray-700">
                    <td className="p-2">{r.name}</td>
                    <td className="p-2">{r.mass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoffeeBlendCalculator;
