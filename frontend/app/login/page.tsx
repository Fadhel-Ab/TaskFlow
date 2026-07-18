"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    saveToken(response.data.access_token);

    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="p-6 w-[400px] space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={handleLogin} className="w-full">
          Login
        </Button>
      </Card>
    </main>
  );
}
