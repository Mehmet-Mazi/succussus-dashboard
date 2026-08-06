"use client";

import { useState } from "react";

import { toast } from "sonner";

export function useLogout() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Logout failed.");
      }

      window.location.replace("/auth/v1/login");
    } catch {
      setIsLoggingOut(false);
      toast.error("Unable to log out. Please try again.");
    }
  }

  return {
    isLoggingOut,
    logout,
  };
}
