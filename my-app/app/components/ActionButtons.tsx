"use client";

import { useRouter } from "next/navigation";

export default function ActionButtons() {
  const router = useRouter();

  return (
    <div
      className="
        mt-8
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        lg:grid-cols-3
      "
    >

      <button
        onClick={() => router.push("/transfer")}
        className="
          rounded-xl
          bg-blue-600
          px-6
          py-4
          text-lg
          font-semibold
          text-white
          shadow-md
          transition
          duration-300
          hover:-translate-y-1
          hover:bg-blue-700
          hover:shadow-lg
          dark:bg-blue-700
          dark:hover:bg-blue-800
        "
      >
        💸 Send Money
      </button>


      <button
        onClick={() => router.push("/deposit")}
        className="
          rounded-xl
          bg-green-600
          px-6
          py-4
          text-lg
          font-semibold
          text-white
          shadow-md
          transition
          duration-300
          hover:-translate-y-1
          hover:bg-green-700
          hover:shadow-lg
          dark:bg-green-700
          dark:hover:bg-green-800
        "
      >
        💰 Deposit
      </button>


      <button
        onClick={() => router.push("/withdraw")}
        className="
          rounded-xl
          bg-red-600
          px-6
          py-4
          text-lg
          font-semibold
          text-white
          shadow-md
          transition
          duration-300
          hover:-translate-y-1
          hover:bg-red-700
          hover:shadow-lg
          dark:bg-red-700
          dark:hover:bg-red-800
        "
      >
        💵 Withdraw
      </button>


    </div>
  );
}