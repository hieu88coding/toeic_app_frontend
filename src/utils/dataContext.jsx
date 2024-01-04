import React, { createContext, useState } from 'react';

// Tạo context
export const DataContext = createContext();

// Tạo provider
export const DataProvider = ({ children }) => {
    const [data, setData] = useState([]);

    const updateData = (newData) => {
        setData(newData);
    };

    return (
        <DataContext.Provider value={{ data, updateData }}>
            {children}
        </DataContext.Provider>
    );
};