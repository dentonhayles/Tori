"use client";

import Navbar from "@/app/components/Navbar";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function WalletPage() {
  return (
    <ProtectedRoute>
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-100 p-6 dark:bg-gray-950">

          <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900">

            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              💰 Wallet
            </h1>

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Manage your wallet using the Deposit and Withdraw options.
            </p>

          </div>

        </main>
      </>
    </ProtectedRoute>
  );
}