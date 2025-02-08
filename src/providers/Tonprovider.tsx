'use client';
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import React from 'react'

const Tonprovider = ({children}: { children: React.ReactNode }) => {
  return (
    <TonConnectUIProvider manifestUrl="https://beestar-kombat-ten.vercel.app/tonconnect-manifest.json">{children}</TonConnectUIProvider>
  )
}

export default Tonprovider