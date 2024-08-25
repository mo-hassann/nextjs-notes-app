"use client";
import { create } from "zustand";

type State = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewNoteDialog = create<State>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
