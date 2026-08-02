"use client";

import { useEffect, useState } from "react";

import Navbar from "@/app/components/Navbar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { apiRequest } from "@/app/lib/api";


type Transaction = {

  id: number;

  type: string;

  amount: string;

  description: string;

  created_at: string;

  sender_name?: string;

  receiver_name?: string;

};



export default function TransactionsPage() {


  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("all");

  const [dateFilter, setDateFilter] = useState("all");

  const [loading, setLoading] = useState(true);




  useEffect(() => {


    async function loadTransactions() {


      try {


        const data = await apiRequest("/transactions/history");


        setTransactions(data.transactions);


      } catch(error) {


        console.log(error);


      } finally {


        setLoading(false);


      }


    }


    loadTransactions();


  }, []);







  const filteredTransactions = transactions.filter(
    (transaction) => {


      const text =
        search.toLowerCase();



      const matchesSearch =

        transaction.type
          ?.toLowerCase()
          .includes(text)

        ||

        transaction.description
          ?.toLowerCase()
          .includes(text)

        ||

        transaction.sender_name
          ?.toLowerCase()
          .includes(text)

        ||

        transaction.receiver_name
          ?.toLowerCase()
          .includes(text)

        ||

        transaction.amount
          .toString()
          .includes(text);




      const matchesType =

        filter === "all"

        ||

        transaction.type === filter;





      const transactionDate =
        new Date(transaction.created_at);



      const today =
        new Date();



      let matchesDate = true;



      if(dateFilter === "today") {


        matchesDate =
          transactionDate.toDateString()
          === today.toDateString();


      }



      if(dateFilter === "week") {


        const weekAgo =
          new Date();


        weekAgo.setDate(
          today.getDate() - 7
        );


        matchesDate =
          transactionDate >= weekAgo;


      }




      if(dateFilter === "month") {


        matchesDate =

          transactionDate.getMonth()
          === today.getMonth()

          &&

          transactionDate.getFullYear()
          === today.getFullYear();


      }





      return (
        matchesSearch
        &&
        matchesType
        &&
        matchesDate
      );


    }
  );







  return (

    <ProtectedRoute>

      <Navbar />


      <main className="
        min-h-screen
        bg-gray-50
        px-6
        py-10
        dark:bg-gray-950
      ">


        <div className="
          mx-auto
          max-w-5xl
        ">


          <h1 className="
            mb-8
            text-4xl
            font-bold
            text-gray-900
            dark:text-white
          ">
            Transactions
          </h1>






          <input

            value={search}

            onChange={(e)=>
              setSearch(e.target.value)
            }

            placeholder="Search transfers, names, amounts..."

            className="
              mb-5
              w-full
              rounded-xl
              border
              p-3
              dark:bg-gray-900
              dark:text-white
            "

          />







          <div className="
            mb-5
            flex
            flex-wrap
            gap-3
          ">


            {[
              "all",
              "deposit",
              "transfer"
            ].map(item => (


              <button

                key={item}

                onClick={()=>
                  setFilter(item)
                }

                className={`
                  rounded-lg
                  px-4
                  py-2
                  ${
                    filter === item
                    ?
                    "bg-blue-600 text-white"
                    :
                    "bg-white dark:bg-gray-900 dark:text-white"
                  }
                `}

              >

                {item}

              </button>


            ))}


          </div>







          <div className="
            mb-8
            flex
            gap-3
          ">


            {[
              "all",
              "today",
              "week",
              "month"
            ].map(item => (


              <button

                key={item}

                onClick={()=>
                  setDateFilter(item)
                }

                className={`
                  rounded-lg
                  px-4
                  py-2
                  ${
                    dateFilter === item
                    ?
                    "bg-green-600 text-white"
                    :
                    "bg-white dark:bg-gray-900 dark:text-white"
                  }
                `}

              >

                {item}

              </button>


            ))}


          </div>









          {
            loading ? (

              <p className="dark:text-white">
                Loading...
              </p>


            )

            :

            filteredTransactions.length === 0 ? (


              <p className="
                text-gray-500
                dark:text-gray-400
              ">
                No transactions found.
              </p>


            )

            :

            (

              <div className="space-y-4">


                {
                  filteredTransactions.map(transaction => (


                    <div

                      key={transaction.id}

                      className="
                        rounded-xl
                        bg-white
                        p-5
                        shadow
                        dark:bg-gray-900
                      "

                    >


                      <div className="
                        flex
                        justify-between
                      ">


                        <div>


                          <h2 className="
                            font-bold
                            capitalize
                            dark:text-white
                          ">

                            {transaction.type}

                          </h2>


                          <p className="
                            text-sm
                            text-gray-500
                          ">

                            {
                              transaction.type === "transfer"

                              ?

                              `To: ${transaction.receiver_name || "User"}`

                              :

                              transaction.description
                            }

                          </p>


                          <p className="
                            text-xs
                            text-gray-400
                          ">

                            {
                              new Date(
                                transaction.created_at
                              ).toLocaleString()
                            }

                          </p>


                        </div>





                        <p className={`
                          text-xl
                          font-bold
                          ${
                            transaction.type === "deposit"
                            ?
                            "text-green-500"
                            :
                            "text-red-500"
                          }
                        `}>

                          {
                            transaction.type === "deposit"
                            ?
                            "+"
                            :
                            "-"
                          }

                          ${Number(transaction.amount).toFixed(2)}

                        </p>


                      </div>


                    </div>


                  ))
                }


              </div>

            )

          }



        </div>


      </main>


    </ProtectedRoute>

  );


}