'use client'

import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  AlertCircle, 
  Trash2, 
  Info,
  Loader2
} from 'lucide-react'

export type DialogType = 'success' | 'error' | 'warning' | 'info' | 'delete' | 'confirm' | 'loading'

interface DialogWrapperProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message?: string
  type?: DialogType
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}

const dialogConfig = {
  success: {
    icon: CheckCircle,
    iconClass: 'text-green-500',
    buttonClass: 'bg-green-100 text-green-900 hover:bg-green-200 focus-visible:ring-green-500',
  },
  error: {
    icon: XCircle,
    iconClass: 'text-red-500',
    buttonClass: 'bg-red-100 text-red-900 hover:bg-red-200 focus-visible:ring-red-500',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-yellow-500',
    buttonClass: 'bg-yellow-100 text-yellow-900 hover:bg-yellow-200 focus-visible:ring-yellow-500',
  },
  info: {
    icon: Info,
    iconClass: 'text-blue-500',
    buttonClass: 'bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500',
  },
  delete: {
    icon: Trash2,
    iconClass: 'text-red-500',
    buttonClass: 'bg-red-100 text-red-900 hover:bg-red-200 focus-visible:ring-red-500',
  },
  confirm: {
    icon: AlertCircle,
    iconClass: 'text-blue-500',
    buttonClass: 'bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500',
  },
  loading: {
    icon: Loader2,
    iconClass: 'text-blue-500 animate-spin',
    buttonClass: 'bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500',
  },
}

export default function DialogWrapper({
  isOpen,
  onClose,
  title = 'Notice',
  message = '',
  type = 'info',
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
}: DialogWrapperProps) {
  const config = dialogConfig[isLoading ? 'loading' : type]
  const Icon = config.icon
  const showActions = type === 'delete' || type === 'confirm' || !!onConfirm
  
  // Prevent closing when loading
  const handleClose = isLoading ? () => {} : onClose

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex flex-col items-center">
                  <div className="mb-4">
                    <Icon className={`h-12 w-12 ${config.iconClass} ${type === 'success' && !isLoading ? 'animate-bounce' : ''}`} />
                  </div>
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 text-center"
                  >
                    {isLoading ? 'Processing...' : title}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 text-center">
                      {isLoading ? 'Please wait while we process your request.' : message}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-3">
                    {showActions && !isLoading ? (
                      <>
                        <button
                          type="button"
                          className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium ${config.buttonClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={onConfirm}
                          disabled={isLoading}
                        >
                          {confirmText}
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                          onClick={onClose}
                          disabled={isLoading}
                        >
                          {cancelText}
                        </button>
                      </>
                    ) : !isLoading && (
                      <button
                        type="button"
                        className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium ${config.buttonClass} focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2`}
                        onClick={onClose}
                        disabled={isLoading}
                      >
                        Got it, thanks!
                      </button>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
} 