"use client";

import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { apiRequest } from "@/app/lib/api";

import Navbar from "@/app/components/Navbar";
import ProtectedRoute from "@/app/components/ProtectedRoute";

import BalanceCard from "@/app/components/BalanceCard";
import ActionButtons from "@/app/components/ActionButtons";
import TransactionCard from "@/app/components/TransactionCard";
import StatCard from "@/app/components/StatCard";


type Transaction = {
  type: string;
  amount: string;
  description: string;
  created_at: string;
};


type DashboardData = {

  user: {
    fullname: string;
    email: string;
  };

  wallet: {
    balance: string | number;
  };

  stats: {
    income: string | number;
    expenses: string | number;
  };

  recentTransactions: Transaction[];

  monthlyStats: {
    month: string;
    income: number;
    expenses: number;
  }[];

};



export default function DashboardPage() {

  const [data, setData] = useState<DashboardData | null>(null);

  const [error, setError] = useState("");



  useEffect(() => {

    async function loadDashboard() {

      try {

        const result = await apiRequest("/dashboard");


        setData(result);

      } catch (err: any) {

        setError(
          err.message || "Failed to load dashboard."
        );

      }

    }


    loadDashboard();


  }, []);



  if (error) {

    return (

      <ProtectedRoute>

        <h2 className="mt-12 text-center text-xl text-red-600">
          {error}
        </h2>

      </ProtectedRoute>

    );

  }



  if (!data) {

    return (

      <ProtectedRoute>

        <h2 className="mt-12 text-center text-xl">
          Loading dashboard...
        </h2>

      </ProtectedRoute>

    );

  }



  return (

    <ProtectedRoute>

      <Navbar />


      <main className="
          min-h-screen
          bg-gray-50
         px-4
          py-6
         sm:px-6
          sm:py-10
         dark:bg-gray-950
       ">

        <div className="mx-auto max-w-6xl">


          <div className="mb-8">

            <h1 className="
              text-4xl
              font-bold
              text-gray-900
              dark:text-white
            ">
              Welcome back, {data.user.fullname} 👋
            </h1>


            <p className="
              mt-2
              text-gray-500
              dark:text-gray-400
            ">
              {data.user.email}
            </p>

          </div>



          <BalanceCard
            balance={String(data.wallet.balance)}
          />



          <div className="
            mt-6
            grid
            gap-4
            sm:gap-6
            sm:grid-cols-2
            lg:grid-cols-3
           ">


            <StatCard
              title="Wallet Balance"
              value={`$${Number(data.wallet.balance).toFixed(2)}`}
              color="text-blue-600"
            />


            <StatCard
              title="Total Income"
              value={`$${Number(data.stats.income).toFixed(2)}`}
              color="text-green-600"
            />


            <StatCard
              title="Total Expenses"
              value={`$${Number(data.stats.expenses).toFixed(2)}`}
              color="text-red-600"
            />


          </div>





         <section className="
  mt-8
  rounded-2xl
  bg-white
  p-6
  shadow-lg
  dark:bg-gray-900
">


  <div className="mb-6">

    <h2 className="
      text-xl
      font-bold
      text-gray-900
      dark:text-white
    ">
      Monthly Overview 📊
    </h2>


    <p className="
      mt-1
      text-sm
      text-gray-500
      dark:text-gray-400
    ">
      Income and spending history
    </p>


  </div>





  <ResponsiveContainer
    width="100%"
    height={320}
  >


    <BarChart
      data={data.monthlyStats}
    >


      <XAxis
        dataKey="month"
      />


      <YAxis />



      <Tooltip />



      <Bar

        dataKey="income"

        name="Income"

        radius={[8,8,0,0]}

      />



      <Bar

        dataKey="expenses"

        name="Expenses"

        radius={[8,8,0,0]}

      />



    </BarChart>


  </ResponsiveContainer>



</section>





          <div className="mt-8">

            <ActionButtons />

          </div>





          <section className="mt-12">


            <h2 className="
              mb-6
              text-2xl
              font-bold
              text-gray-900
              dark:text-white
            ">
              Recent Transactions
            </h2>



            {
              data.recentTransactions.length === 0 ? (

                <p className="
                  text-gray-500
                  dark:text-gray-400
                ">
                  No transactions yet.
                </p>


              ) : (

                <div className="space-y-4">

                  {
                    data.recentTransactions.map(
                      (transaction, index) => (

                        <TransactionCard
                          key={index}
                          transaction={transaction}
                        />

                      )
                    )
                  }

                </div>

              )
            }


          </section>


        </div>

      </main>


    </ProtectedRoute>
    );
}