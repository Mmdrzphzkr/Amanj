"use client";

import { createContext, useContext, useReducer, useEffect, useState } from 'react';

const ErpContext = createContext();

const SETTINGS_KEY = 'erp_settings';

const defaultState = {
  darkMode: false,
  sidebarOpen: true,
  settings: {
    companyName: 'شرکت قهوه‌ساز پارس',
    companyLogo: '',
    address: 'تهران، خیابان انقلاب',
    phone: '۰۲۱-۱۲۳۴۵۶۷۸',
    nationalId: '',
    economicCode: '',
    registrationNumber: '',
    taxPercentage: 9,
    currency: 'تومان',
    invoicePrefix: 'INV-',
    repairPrefix: 'SRV-',
  },
};

function erpReducer(state, action) {
  switch (action.type) {
    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function ErpProvider({ children }) {
  const [state, dispatch] = useReducer(erpReducer, defaultState);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      }
    } catch { }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify({ settings: state.settings, darkMode: state.darkMode }));
      } catch { }
    }
  }, [state.settings, state.darkMode, initialized]);

  return (
    <ErpContext.Provider value={{ state, dispatch }}>
      {children}
    </ErpContext.Provider>
  );
}

export function useErp() {
  const ctx = useContext(ErpContext);
  if (!ctx) throw new Error('useErp must be used within ErpProvider');
  return ctx;
}
