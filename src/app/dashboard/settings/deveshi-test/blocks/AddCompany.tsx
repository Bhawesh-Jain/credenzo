'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

type AddCompanyDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  onAdd: (company: string) => void
}

export default function AddCompany({ open, setOpen, onAdd }: AddCompanyDialogProps) {
  const [companyName, setCompanyName] = useState("")

  const handleAdd = () => {
    if (!companyName.trim()) return
    onAdd(companyName.trim())
    setCompanyName("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
          <DialogDescription>Enter the name of the new company</DialogDescription>
        </DialogHeader>
        <Input
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Enter company name"
        />
        <div className="flex justify-end">
          <Button onClick={handleAdd}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
