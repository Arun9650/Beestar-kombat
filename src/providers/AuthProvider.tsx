"use client"

import { authenticateUserOrCreateAccount } from '@/actions/auth.actions'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, Suspense } from 'react'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const params = useSearchParams()

    useEffect(() => {
        // Your authentication logic here
    }, [params])

    return <>{children}</>
}

const AuthProviderWithSuspense = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<div>Loading...</div>}>
        <AuthProvider>{children}</AuthProvider>
    </Suspense>
)

export default AuthProviderWithSuspense