"use client";

import "@rainbow-me/rainbowkit/styles.css"
import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { config } from '../wagmi';

const queryClient = new QueryClient();

export default function walletProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider modalSize="compact">
              {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    );
  }