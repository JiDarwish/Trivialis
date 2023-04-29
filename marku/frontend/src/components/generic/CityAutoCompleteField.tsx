import React, { useState, useCallback } from "react";
import { Input } from "antd";

interface Prediction {
  place_id: string;
  description: string;
}

const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): T => {
  let timeout: ReturnType<typeof setTimeout> | null;

  const debounced = (...args: Parameters<T>) => {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };

  return debounced as T;
};

const AutoCompleteInput: React.FC = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const fetchCities = async (query: string): Promise<Prediction[]> => {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      query
    )}&types=(cities)&key=AIzaSyDrFoblW-DCC0uElgCQwIRiIsZlk1-1lPs`;

    const response = await fetch(url);
    const data = await response.json();
    return data.predictions;
  };

  const handleSearch = useCallback(
    debounce(async (value: string) => {
      if (!value) {
        setPredictions([]);
        return;
      }

      const results = await fetchCities(value);
      setPredictions(results);
    }, 300),
    []
  );

  return (
    <div className="relative">
      <Input
        className="w-full"
        placeholder="Enter a city name"
        onChange={(e) => handleSearch(e.target.value)}
      />
      {predictions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 divide-y divide-gray-200 rounded-md shadow-md">
          {predictions.map((prediction: Prediction) => (
            <li key={prediction.place_id} className="p-2">
              {prediction.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutoCompleteInput;
