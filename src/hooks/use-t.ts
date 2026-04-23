"use client";

import { useContext } from "react";
import { I18nContext } from "@/components/app-shell/I18nProvider";

export function useT() {
  return useContext(I18nContext).t;
}

export function useLang() {
  return useContext(I18nContext).lang;
}
