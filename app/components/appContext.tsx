"use client";
import React, { createContext } from "react";

export interface AppContextValue {
  theme: string;
  language: string;
}

export const defaultValue: AppContextValue = {
  theme: "light",
  language: "en",
};

const AppContext = createContext<AppContextValue>(defaultValue);

export default AppContext;
