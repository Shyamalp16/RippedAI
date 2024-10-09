import React, { createContext, useContext, useState } from 'react';

const DietContext = createContext();

export const DietProvider = ({ children }) => {
  const [macros, setMacros] = useState({});
  const [consumedFoods, setConsumedFoods] = useState([]);

  return (
    <DietContext.Provider value={{ setMacros, setConsumedFoods, macros, consumedFoods }}>
      {children}
    </DietContext.Provider>
  );
};

export const useDietContext = () => useContext(DietContext);