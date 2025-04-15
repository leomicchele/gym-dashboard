'use client';

import { InstructoresProvider } from '@/contexts/InstructoresContext';

export default function InstructoresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InstructoresProvider>{children}</InstructoresProvider>;
} 