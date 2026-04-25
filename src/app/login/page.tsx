"use client";

import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../features/auth/components/AuthProvider";

export default function Login() {
  const { clearError, error, isLoggedIn, login, status } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (status !== "checking" && isLoggedIn) {
      void navigate({ to: "/" });
    }
  }, [isLoggedIn, navigate, status]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const loginSucceeded = await login(email, password);
    if (loginSucceeded) {
      setPassword("");
      void navigate({ to: "/" });
    }
  }

  return (
    <main className="w-full min-h-screen flex justify-center content-center">
      <div className="p-5 bg-bg-dark rounded-lg h-full m-auto">
        <form onSubmit={onSubmit} className="flex flex-col gap-1">
          <div>
            <label htmlFor="email">Email</label>
            <input
              autoComplete="email"
              id="email"
              name="email"
              onChange={(event) => {
                clearError();
                setEmail(event.target.value);
              }}
              required
              type="email"
              value={email}
            ></input>
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              autoComplete="current-password"
              id="password"
              minLength={6}
              name="password"
              onChange={(event) => {
                clearError();
                setPassword(event.target.value);
              }}
              required
              type="password"
              value={password}
            ></input>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button
            disabled={status === "checking" || status === "submitting"}
            type="submit"
            className="bg-secondary hover:bg-secondary-light mt-2"
          >
            {status === "checking"
              ? "Restoring session..."
              : status === "submitting"
                ? "Signing in..."
                : "Sign in"}
          </Button>
        </form>
      </div>
    </main>
  );
}
