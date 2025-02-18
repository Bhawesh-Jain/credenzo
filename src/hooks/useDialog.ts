import { useState } from 'react'
import { DialogType } from '@/components/DialogWrapper'

interface DialogConfig {
  title: string
  message: string
  type: DialogType
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    title: '',
    message: '',
    type: 'info',
    isLoading: false
  })

  const showDialog = (config: Partial<DialogConfig>) => {
    setDialogConfig({
      title: config.title || '',
      message: config.message || '',
      type: config.type || 'info',
      onConfirm: config.onConfirm,
      confirmText: config.confirmText,
      cancelText: config.cancelText,
      isLoading: false
    })
    setIsOpen(true)
  }

  const setLoading = (loading: boolean) => {
    setDialogConfig(prev => ({
      ...prev,
      isLoading: loading
    }))
  }

  const closeDialog = () => {
    setIsOpen(false)
    setDialogConfig(prev => ({
      ...prev,
      isLoading: false
    }))
  }

  // Convenience methods for common dialog types
  const showSuccess = (title: string, message: string) => {
    showDialog({ title, message, type: 'success' })
  }

  const showError = (title: string, message: string) => {
    showDialog({ title, message, type: 'error' })
  }

  const showWarning = (title: string, message: string) => {
    showDialog({ title, message, type: 'warning' })
  }

  const showDeleteConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText = 'Delete',
    cancelText = 'Cancel'
  ) => {
    showDialog({
      title,
      message,
      type: 'delete',
      onConfirm,
      confirmText,
      cancelText,
    })
  }

  const showConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
  ) => {
    showDialog({
      title,
      message,
      type: 'confirm',
      onConfirm,
      confirmText,
      cancelText,
    })
  }

  return {
    isOpen,
    dialogConfig,
    showDialog,
    closeDialog,
    setLoading,
    showSuccess,
    showError,
    showWarning,
    showDeleteConfirmation,
    showConfirmation,
  }
} 