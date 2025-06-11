// Créez un fichier DataContext.js
import { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [uploadedData, setUploadedData] = useState(null);

  return (
    <DataContext.Provider value={{ uploadedData, setUploadedData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);