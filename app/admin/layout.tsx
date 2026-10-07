import React from 'react';
import type { Metadata } from 'next';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';

export const metadata: Metadata = {
  title: 'Campus Admin & Committee Portal | Mess Mate',
  description: 'Fixed mess menu uploads, CSV validation, Food Court manager, and privacy-guarded aggregate student nutrition analytics.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
