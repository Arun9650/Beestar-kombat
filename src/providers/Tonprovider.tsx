'use client';
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import React from 'react'

const Tonprovider = ({children}: { children: React.ReactNode }) => {
  return (
    <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/undefined-beep/Beestar-kombat/refs/heads/main/tonconnect-manifest.json">{children}</TonConnectUIProvider>
  )
}

export default Tonprovider