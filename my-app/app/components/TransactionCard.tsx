"use client";

type Transaction = {
  type: string;
  amount: string;
  description: string;
  created_at: string;
};


type Props = {
  transaction: Transaction;
};



export default function TransactionCard({
  transaction,
}: Props) {


  const isDeposit =
    transaction.type.toLowerCase() === "deposit";



  const isTransfer =
    transaction.type.toLowerCase() === "transfer";



  return (

    <div className="
      flex
      items-center
      justify-between
      rounded-xl
      bg-white
      p-5
      shadow
      transition
      duration-300
      hover:-translate-y-1
      hover:shadow-lg
      dark:bg-gray-900
    ">




      <div className="
        flex
        items-center
        gap-4
      ">


        <div className={`
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          text-xl

          ${
            isDeposit
            ?
            "bg-green-100 dark:bg-green-900"
            :
            "bg-red-100 dark:bg-red-900"
          }

        `}>



          {
            isDeposit
            ?
            "⬇️"
            :
            isTransfer
            ?
            "💸"
            :
            "⬆️"
          }



        </div>





        <div>


          <h3 className="
            font-bold
            capitalize
            text-gray-900
            dark:text-white
          ">

            {transaction.type}

          </h3>



          <p className="
            text-sm
            text-gray-500
            dark:text-gray-400
          ">

            {
              transaction.description ||
              "No description"
            }

          </p>




          <p className="
            mt-1
            text-xs
            text-gray-400
          ">

            {
              new Date(
                transaction.created_at
              ).toLocaleDateString(
                "en-US",
                {
                  month:"short",
                  day:"numeric",
                  year:"numeric"
                }
              )
            }


          </p>



        </div>



      </div>








      <div className={`
        text-lg
        font-bold

        ${
          isDeposit
          ?
          "text-green-600"
          :
          "text-red-600"
        }

      `}>


        {
          isDeposit
          ?
          "+"
          :
          "-"
        }


        $
        {Number(
          transaction.amount
        ).toFixed(2)}



      </div>



    </div>

  );

}