'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoginForm } from './login-form'
import { RegisterForm } from './register-form'

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: 'login' | 'register'
}

export function AuthDialog({
  open,
  onOpenChange,
  defaultTab = 'login',
}: AuthDialogProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Welcome</DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one to analyze your resume
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Sign In</TabsTrigger>
            <TabsTrigger value="register">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6">
            <LoginForm />
            <p className="mt-4 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className="font-medium text-blue-600 hover:underline"
              >
                Sign up
              </button>
            </p>
          </TabsContent>

          <TabsContent value="register" className="mt-6">
            <RegisterForm />
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="font-medium text-blue-600 hover:underline"
              >
                Sign in
              </button>
            </p>
          </TabsContent>
        </Tabs>

        <p className="mt-2 text-center text-xs text-gray-500">
          Or visit{' '}
          <Link
            href="/login"
            className="text-blue-600 hover:underline"
            onClick={() => onOpenChange(false)}
          >
            /login
          </Link>{' '}
          or{' '}
          <Link
            href="/register"
            className="text-blue-600 hover:underline"
            onClick={() => onOpenChange(false)}
          >
            /register
          </Link>
        </p>
      </DialogContent>
    </Dialog>
  )
}
