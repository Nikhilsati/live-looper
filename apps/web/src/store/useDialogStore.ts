import { create } from "zustand";

export interface DialogOptions {
  title?: string;
  message: string;
  type: "alert" | "confirm";
  confirmText?: string;
  cancelText?: string;
  danger?: boolean; // If true, make the confirm button red
}

interface DialogState {
  isOpen: boolean;
  options: DialogOptions | null;
  resolveFn: ((value: boolean) => void) | null;
  pushDialog: (options: DialogOptions) => Promise<boolean>;
  closeDialog: (result: boolean) => void;
}

export const useDialogStore = create<DialogState>((set, get) => ({
  isOpen: false,
  options: null,
  resolveFn: null,
  pushDialog: (options) => {
    return new Promise<boolean>((resolve) => {
      set({ isOpen: true, options, resolveFn: resolve });
    });
  },
  closeDialog: (result) => {
    const { resolveFn } = get();
    if (resolveFn) resolveFn(result);
    set({ isOpen: false, resolveFn: null });
    // Don't immediately clear options so we don't flash empty content during exit transition if we had one
    setTimeout(() => set({ options: null }), 300);
  },
}));

export const uiAlert = (
  message: string,
  title: string = "Notice",
  options?: Partial<DialogOptions>,
) => {
  return useDialogStore
    .getState()
    .pushDialog({ type: "alert", message, title, ...options });
};

export const uiConfirm = (
  message: string,
  title: string = "Confirm",
  options?: Partial<DialogOptions>,
) => {
  return useDialogStore
    .getState()
    .pushDialog({ type: "confirm", message, title, ...options });
};
