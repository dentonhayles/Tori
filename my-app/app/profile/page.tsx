"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { apiRequest } from "@/app/lib/api";
import toast from "react-hot-toast";


type ProfileData = {
  fullname: string;
  email: string;
  created_at?: string;
};


export default function ProfilePage() {

  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);



  useEffect(() => {

    async function loadProfile() {

      try {

        const data = await apiRequest("/profile");

        setProfile(data);

      } catch (err:any) {

        toast.error(
          err.message || "Failed to load profile"
        );

      }

    }


    loadProfile();

  }, []);




  async function changePassword(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setLoading(true);


    try {

      await apiRequest("/profile/password", {

        method: "PUT",

        body: JSON.stringify({

          oldPassword,
          newPassword,

        }),

      });


      toast.success(
        "Password updated successfully"
      );


      setOldPassword("");
      setNewPassword("");


    } catch(err:any) {

      toast.error(
        err.message || "Password update failed"
      );

    }


    setLoading(false);

  }





  if (!profile) {

    return (

      <ProtectedRoute>

        <Navbar />

        <p className="
          mt-10
          text-center
        ">
          Loading profile...
        </p>

      </ProtectedRoute>

    );

  }




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
          max-w-4xl
        ">


          <h1 className="
            mb-8
            text-4xl
            font-bold
            text-gray-900
            dark:text-white
          ">
            Profile
          </h1>




          {/* Profile Card */}

          <section className="
            rounded-2xl
            bg-white
            p-8
            shadow
            dark:bg-gray-900
          ">


            <div className="
              flex
              items-center
              gap-6
            ">


              <div className="
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                bg-blue-600
                text-4xl
                font-bold
                text-white
              ">

                {profile.fullname
                  .charAt(0)
                  .toUpperCase()
                }

              </div>



              <div>

                <h2 className="
                  text-2xl
                  font-bold
                  text-gray-900
                  dark:text-white
                ">
                  {profile.fullname}
                </h2>


                <p className="
                  text-gray-500
                  dark:text-gray-400
                ">
                  {profile.email}
                </p>


              </div>


            </div>


          </section>





          {/* Password */}

          <section className="
            mt-8
            rounded-2xl
            bg-white
            p-8
            shadow
            dark:bg-gray-900
          ">


            <h2 className="
              mb-6
              text-2xl
              font-bold
              dark:text-white
            ">
              Change Password
            </h2>



            <form
              onSubmit={changePassword}
              className="
                space-y-4
              "
            >


              <input

                type="password"

                placeholder="Current password"

                value={oldPassword}

                onChange={(e)=>
                  setOldPassword(e.target.value)
                }

                className="
                  w-full
                  rounded-lg
                  border
                  p-3
                  dark:bg-gray-800
                  dark:text-white
                "

              />



              <input

                type="password"

                placeholder="New password"

                value={newPassword}

                onChange={(e)=>
                  setNewPassword(e.target.value)
                }

                className="
                  w-full
                  rounded-lg
                  border
                  p-3
                  dark:bg-gray-800
                  dark:text-white
                "

              />



              <button

                disabled={loading}

                className="
                  rounded-lg
                  bg-blue-600
                  px-6
                  py-3
                  font-semibold
                  text-white
                  hover:bg-blue-700
                "

              >

                {loading
                  ? "Updating..."
                  : "Update Password"
                }

              </button>


            </form>


          </section>



        </div>


      </main>


    </ProtectedRoute>

  );

}