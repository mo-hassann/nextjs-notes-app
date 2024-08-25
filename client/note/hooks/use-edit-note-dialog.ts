"use client";
import { create } from "zustand";

type State = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useEditNoteDialog = create<State>((set) => ({
  isOpen: false,
  onOpen: (id) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false }),
}));
