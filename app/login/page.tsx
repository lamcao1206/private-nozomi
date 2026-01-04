"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { login } from "@/app/actions/auth";
import { useActionState } from "react";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-sm shadow-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex justify-center">
            Login
          </CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
                aria-describedby="email-error"
              />
              {state?.errors?.email && (
                <p id="email-error" className="text-sm text-destructive">
                  {state.errors.email[0]}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                aria-describedby="password-error"
              />
              {state?.errors?.password && (
                <p id="password-error" className="text-sm text-destructive">
                  {state.errors.password[0]}
                </p>
              )}
            </div>

            {state?.message && (
              <div className="rounded-md bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{state.message}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
