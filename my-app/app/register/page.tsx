"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullname,
          email,
          password,
        }),
      });

      setMessage(response.message);

      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err: any) {
      setError(err.message);
    }
  }


  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 dark:bg-gray-950">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900">

        <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">
          Create Account
        </h1>


        <form onSubmit={handleRegister} className="space-y-4">


          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="w-full rounded-xl border p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />


          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />


          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />


          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Register
          </button>


        </form>


        {message && (
          <p className="mt-4 text-green-600">
            ✅ {message}
          </p>
        )}


        {error && (
          <p className="mt-4 text-red-600">
            ❌ {error}
          </p>
        )}

      </div>

    </main>
  );
}