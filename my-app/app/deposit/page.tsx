"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/app/components/Navbar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { apiRequest } from "@/app/lib/api";
import toast from "react-hot-toast";

export default function DepositPage() {

  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  async function handleDeposit(e: React.FormEvent) {

    e.preventDefault();

    setError("");


    if (!amount || Number(amount) <= 0) {

      setError("Please enter a valid amount.");
      return;

    }


    setLoading(true);


    try {

      await apiRequest("/wallet/deposit", {

        method: "POST",

        body: JSON.stringify({
          amount: Number(amount),
        }),

      });


      toast.success(
        "Deposit completed successfully!"
      );


      setTimeout(() => {

        router.push("/dashboard");

      }, 1500);



    } catch (err: any) {

      const message =
        err.message || "Deposit failed.";

      setError(message);

      toast.error(message);



    } finally {

      setLoading(false);

    }

  }




  return (

    <ProtectedRoute>

      <Navbar />


      <main className="
        min-h-screen
        bg-gray-100
        px-4
        py-6
        sm:px-6
        sm:py-10
        dark:bg-gray-950
      ">


        <div className="
          mx-auto
          w-full
          max-w-lg
        ">


          <div className="
            rounded-2xl
            bg-white
            p-5
            shadow-xl
            sm:p-8
            dark:bg-gray-900
          ">


            <h1 className="
              mb-2
              text-3xl
              font-bold
              text-gray-800
              dark:text-white
            ">
              💰 Deposit Money
            </h1>


            <p className="
              mb-8
              text-gray-500
              dark:text-gray-400
            ">
              Add money to your wallet.
            </p>



            <form
              onSubmit={handleDeposit}
              className="space-y-5"
            >


              <div>

                <label className="
                  mb-2
                  block
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                ">
                  Amount
                </label>



                <input

                  type="number"

                  min="1"

                  step="0.01"

                  placeholder="0.00"

                  value={amount}

                  onChange={(e)=>
                    setAmount(e.target.value)
                  }


                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    p-3
                    text-base
                    text-gray-900
                    outline-none
                    focus:border-green-500
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-white
                  "

                />

              </div>





              <button

                type="submit"

                disabled={loading}

                className="
                  w-full
                  rounded-xl
                  bg-green-600
                  py-4
                  text-lg
                  font-semibold
                  text-white
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:bg-green-700
                  disabled:bg-green-300
                  dark:bg-green-700
                  dark:hover:bg-green-800
                "

              >

                {loading
                  ? "Depositing..."
                  : "Deposit Money"
                }

              </button>


            </form>




            {error && (

              <div className="
                mt-6
                rounded-lg
                bg-red-100
                p-4
                text-red-700
                dark:bg-red-900
                dark:text-red-300
              ">

                ❌ {error}

              </div>

            )}



          </div>


        </div>


      </main>


    </ProtectedRoute>

  );

}