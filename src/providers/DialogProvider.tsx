'use client'

import { createContext, useContext, ReactNode } from 'react'
import DialogWrapper from '@/components/DialogWrapper'
import { useDialog } from '@/hooks/useDialog'
import { DialogType } from '@/components/DialogWrapper'

interface DialogContextType {
  showDialog: (config: {
    title: string
    message: string
    type?: DialogType
    onConfirm?: () => void
    confirmText?: string
    cancelText?: string
  }) => void
  showSuccess: (title: string, message: string) => void
  showError: (title: string, message: string) => void
  showWarning: (title: string, message: string) => void
  showDeleteConfirmation: (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void
  showConfirmation: (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string,
    cancelText?: string
  ) => void
  closeDialog: () => void
  setLoading: (loading: boolean) => void
}

const DialogContext = createContext<DialogContextType | undefined>(undefined)

export function DialogProvider({ children }: { children: ReactNode }) {
  const {
    isOpen,
    dialogConfig,
    closeDialog,
    showDialog,
    showSuccess,
    showError,
    showWarning,
    showDeleteConfirmation,
    showConfirmation,
    setLoading,
  } = useDialog()

  return (
    <DialogContext.Provider
      value={{
        showDialog,
        showSuccess,
        showError,
        showWarning,
        showDeleteConfirmation,
        showConfirmation,
        closeDialog,
        setLoading,
      }}
    >
      {children}
      <DialogWrapper
        isOpen={isOpen}
        onClose={closeDialog}
        title={dialogConfig.title}
        message={dialogConfig.message}
        type={dialogConfig.type}
        onConfirm={dialogConfig.onConfirm}
        confirmText={dialogConfig.confirmText}
        cancelText={dialogConfig.cancelText}
        isLoading={dialogConfig.isLoading}
      />
    </DialogContext.Provider>
  )
}

export function useGlobalDialog() {
  const context = useContext(DialogContext)
  if (context === undefined) {
    throw new Error('useGlobalDialog must be used within a DialogProvider')
  }
  return context
} 