"use client";

// MyContextProvider.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const MyContext = createContext<any>(null);

export const useMyContext = () => useContext(MyContext);


export const MyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [breadCrumb, setBreadCrumb] = useState([]);
  const [refreshSideBar, setRefreshSideBar] = useState(false)

  useEffect(() => {
    return () => {
      setRefreshSideBar(false)
    }
  }, [refreshSideBar])

  return <MyContext.Provider value={{ breadCrumb, setBreadCrumb,setRefreshSideBar,refreshSideBar}}>{children}</MyContext.Provider>;
};