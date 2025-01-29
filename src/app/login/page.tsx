import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-12 lg:p-8 bg-[#1E1E1E]">
      <div className="hidden bg-[url(/assets/login-bg-gradient.svg)] bg-cover justify-center h-full lg:flex flex-col px-[10%] col-span-7 gap-5">
        <span className="text-4xl font-semibold text-primary-foreground">Welcome to Credenzo</span>
        <span className="text-base text-muted-foreground">A professional software that comes with complete loan solution developed with one common goal in mind, help you streamline your loan processes.</span>
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10  col-span-5 bg-muted shadow-lg">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <Avatar className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <AvatarImage src="/assets/favicon.ico" alt="Credenzo" />
            </Avatar>
            Credenzo
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs lg:max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
