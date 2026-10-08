import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function formatDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function calculateDiscount(price: number, discountPrice?: number): number {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
}

export function getLevelColor(level: string): string {
  switch (level) {
    case 'BEGINNER': return 'text-green-600 bg-green-100';
    case 'INTERMEDIATE': return 'text-amber-600 bg-amber-100';
    case 'ADVANCED': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'ACTIVE': return 'text-green-600 bg-green-100';
    case 'INACTIVE': return 'text-gray-600 bg-gray-100';
    case 'COMING_SOON': return 'text-blue-600 bg-blue-100';
    case 'FULL': return 'text-red-600 bg-red-100';
    case 'PENDING': return 'text-amber-600 bg-amber-100';
    case 'APPROVED': return 'text-green-600 bg-green-100';
    case 'REJECTED': return 'text-red-600 bg-red-100';
    case 'COMPLETED': return 'text-blue-600 bg-blue-100';
    default: return 'text-gray-600 bg-gray-100';
  }
}

export function getApplicationStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'Pending Review',
    UNDER_REVIEW: 'Under Review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected',
    WAITLISTED: 'Waitlisted',
  };
  return labels[status] || status;
}

export function getDomainLabel(domain: string): string {
  const labels: Record<string, string> = {
    COMPUTER_SCIENCE_ENGINEERING: 'Computer Science & Engineering',
    CIVIL_ENGINEERING: 'Civil Engineering',
  };
  return labels[domain] || domain;
}

export function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
  };
  return labels[level] || level;
}

export function getModeLabel(mode: string): string {
  const labels: Record<string, string> = {
    ONLINE: 'Online',
    OFFLINE: 'On-site',
    HYBRID: 'Hybrid',
  };
  return labels[mode] || mode;
}

export function generateId(prefix = 'ID'): string {
  return `${prefix}${Date.now().toString(36).toUpperCase()}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
