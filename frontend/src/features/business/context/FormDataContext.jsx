import { createContext, useContext, useState } from "react";

const FormDataContext = createContext();

export const useFormData = () => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error("useFormData must be used within FormDataProvider");
  }
  return context;
};

export const FormDataProvider = ({ children }) => {
  const [services, setServices] = useState([]);

  const addService = (newService) => {
    setServices((prev) => [...(Array.isArray(prev) ? prev : []), newService]);
  };

  const updateService = (index, updatedService) => {
    setServices((prev) => {
      const arr = Array.isArray(prev) ? prev : [];
      const copy = [...arr];
      copy[index] = updatedService;
      return copy;
    });
  };

  const resetServices = () => setServices([]);

  return (
    <FormDataContext.Provider value={{ services, addService, updateService, resetServices }}>
      {children}
    </FormDataContext.Provider>
  );
};
