'use client';

import { logout } from '@/lib/logout';
import { Button } from '@/components/ui/button';

export default function LogoutButton() {
  return (
    <Button variant="destructive" onClick={() => logout()}>
      Logout
    </Button>
  );
}
