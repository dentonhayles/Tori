"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function Navbar() {

  const router = useRouter();

  const [open, setOpen] = useState(false);



  function handleLogout() {

    localStorage.removeItem("token");

    router.push("/login");

  }




  return (

    <header className="
      bg-blue-600
      text-white
      shadow-lg
    ">


      <div className="
        mx-auto
        flex
        max-w-6xl
        items-center
        justify-between
        px-6
        py-4
      ">


        <Link
          href="/dashboard"
          className="
            text-2xl
            font-bold
          "
        >
          💸 MoneyTransfer
        </Link>




        <button

          className="
            text-3xl
            md:hidden
          "

          onClick={()=>
            setOpen(!open)
          }

        >
          ☰
        </button>






        <nav className="
          hidden
          items-center
          gap-6
          md:flex
        ">


          <Link href="/dashboard">
            Dashboard
          </Link>


          <Link href="/transactions">
            Transactions
          </Link>


          <Link href="/profile">
            Profile
          </Link>


          <button

            onClick={handleLogout}

            className="
              rounded-lg
              bg-red-500
              px-4
              py-2
              font-semibold
              hover:bg-red-600
            "

          >
            Logout
          </button>


        </nav>


      </div>







      {
        open && (

          <nav className="
            flex
            flex-col
            gap-4
            px-6
            pb-5
            md:hidden
          ">


            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>



            <Link
              href="/transactions"
              onClick={() => setOpen(false)}
            >
              Transactions
            </Link>



            <Link
              href="/profile"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>




            <button

              onClick={handleLogout}

              className="
                rounded-lg
                bg-red-500
                px-4
                py-2
                font-semibold
              "

            >
              Logout
            </button>


          </nav>


        )
      }



    </header>

  );

}