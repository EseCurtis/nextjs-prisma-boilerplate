"use client";

import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/hooks/api/use-auth";
import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {!user?.isConfirmed ? (
        <p>Confirm account</p>
      ) : (
        <p>
          Auth user {JSON.stringify(user)} {children}
        </p>
      )}
    </ProtectedRoute>
  );
}
