"use client";

import { useEffect, useState } from "react";

type Props = {
  balance: string | number;
};


export default function BalanceCard({
  balance,
}: Props) {

  const [displayBalance, setDisplayBalance] = useState(0);


  useEffect(() => {

    const target = Number(balance);


    let current = 0;


    const increment = target / 50;


    const timer = setInterval(() => {


      current += increment;


      if (current >= target) {

        current = target;

        clearInterval(timer);

      }


      setDisplayBalance(current);


    },20);



    return () => clearInterval(timer);


  }, [balance]);





  return (

    <div className="
      mt-8
      rounded-2xl
      bg-gradient-to-r
      from-blue-600
      to-blue-500
      p-6
      text-white
      shadow-xl
      transition
      hover:scale-[1.02]
    ">


      <p className="
        text-sm
        opacity-80
      ">
        Current Balance
      </p>



      <h2 className="
        mt-3
        text-4xl
        font-bold
      ">

        $
        {displayBalance.toFixed(2)}

      </h2>



      <p className="
        mt-3
        text-sm
        opacity-80
      ">
        Available wallet funds
      </p>


    </div>

  );

}