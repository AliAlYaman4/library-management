'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function SessionRefresh() {
  const { status, update } = useSession();
  const router = useRouter();
  const hasRefreshed = useRef(false);

  useEffect(() => {
    // Only refresh once when user first authenticates
    if (status === 'authenticated' && !hasRefreshed.current) {
      hasRefreshed.current = true;
      
      // Small delay to ensure session is fully established
      setTimeout(() => {
        update().then(() => {
          router.refresh();
        });
      }, 100);
    }
  }, [status, update, router]);

  return null;
}
