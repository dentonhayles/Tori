"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/app/components/Navbar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { apiRequest } from "@/app/lib/api";


type User = {
  id: number;
  fullname: string;
  email: string;
};



export default function TransferPage() {

  const router = useRouter();


  const [users, setUsers] = useState<User[]>([]);

  const [receiverEmail, setReceiverEmail] = useState("");

  const [amount, setAmount] = useState("");

  const [description, setDescription] = useState("");


  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");




  useEffect(() => {

    async function loadUsers() {

      try {

        const data = await apiRequest("/users");

        setUsers(data);


      } catch (err: any) {

        setError(
          err.message || "Failed loading users."
        );

      }

    }


    loadUsers();


  }, []);





  async function handleTransfer(
    e: React.FormEvent
  ) {

    e.preventDefault();


    setMessage("");

    setError("");



    if (!receiverEmail) {

      setError(
        "Please select a recipient."
      );

      return;

    }



    if (!amount || Number(amount) <= 0) {

      setError(
        "Please enter a valid amount."
      );

      return;

    }



    setLoading(true);



    try {


      await apiRequest("/transfers", {

        method: "POST",

        body: JSON.stringify({

          receiverEmail,

          amount: Number(amount),

          description

        }),

      });



      setMessage(
        "Transfer completed successfully!"
      );



      setTimeout(() => {

        router.push("/dashboard");

      },1500);



    } catch(err:any) {


      setError(
        err.message || "Transfer failed."
      );



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
          max-w-xl
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
              💸 Send Money
            </h1>



            <p className="
              mb-8
              text-gray-500
              dark:text-gray-400
            ">
              Transfer money securely to another user.
            </p>





            <form
              onSubmit={handleTransfer}
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
                  Recipient
                </label>



                <select

                  value={receiverEmail}

                  onChange={(e)=>
                    setReceiverEmail(
                      e.target.value
                    )
                  }


                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    p-3
                    text-gray-900
                    outline-none
                    focus:border-blue-500
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-white
                  "

                >


                  <option value="">
                    Select recipient
                  </option>



                  {users.map((user)=>(


                    <option

                      key={user.id}

                      value={user.email}

                    >

                      {user.fullname} ({user.email})

                    </option>


                  ))}



                </select>


              </div>







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
                    text-gray-900
                    outline-none
                    focus:border-blue-500
                    dark:border-gray-700
                    dark:bg-gray-800
                    dark:text-white
                  "

                />


              </div>








              <div>


                <label className="
                  mb-2
                  block
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                ">
                  Description
                </label>




                <input

                  type="text"

                  placeholder="Payment note"


                  value={description}


                  onChange={(e)=>
                    setDescription(
                      e.target.value
                    )
                  }



                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    bg-white
                    p-3
                    text-gray-900
                    outline-none
                    focus:border-blue-500
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
                  bg-blue-600
                  py-4
                  text-lg
                  font-semibold
                  text-white
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:bg-blue-700
                  disabled:bg-blue-300
                  dark:bg-blue-700
                  dark:hover:bg-blue-800
                "

              >

                {loading
                  ? "Sending..."
                  : "Send Money"
                }


              </button>



            </form>






            {message && (

              <div className="
                mt-6
                rounded-lg
                bg-green-100
                p-4
                text-green-700
                dark:bg-green-900
                dark:text-green-300
              ">

                ✅ {message}

              </div>

            )}






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