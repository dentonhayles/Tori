"use client";

type Props = {
  title: string;
  value: string;
  color: string;
};



export default function StatCard({
  title,
  value,
  color,
}: Props) {


  const icon =
    title.includes("Income")
      ? "📈"
      : title.includes("Expenses")
      ? "📉"
      : "💰";



  return (

    <div className="
      rounded-2xl
      bg-white
      p-6
      shadow
      transition
      duration-300
      hover:-translate-y-1
      hover:shadow-xl
      dark:bg-gray-900
    ">



      <div className="
        flex
        items-center
        justify-between
      ">



        <div>


          <p className="
            text-sm
            font-medium
            text-gray-500
            dark:text-gray-400
          ">

            {title}

          </p>




          <h3 className={`
            mt-3
            text-3xl
            font-bold
            ${color}
          `}>

            {value}

          </h3>



        </div>





        <div className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-gray-100
          text-2xl
          dark:bg-gray-800
        ">

          {icon}

        </div>



      </div>



    </div>


  );

}