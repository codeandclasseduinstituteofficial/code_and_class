import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import InputField from "../components/InputField";
import { AnimatePresence, motion } from "framer-motion";

const Login = () => {

  const navigate = useNavigate();

  const { setAccessToken, setUser } = useContext(AuthContext);


  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const switchMode = (mode) => {

    setIsSignup(mode);

    setName("");
    setEmail("");
    setPassword("");

    setError("");
    setShowPassword(false);

  };


  const handleAuth = async () => {

    setError("");

    if (!email || !password || (isSignup && !name)) {
      setError("Please fill all fields.");
      return;
    }


    setLoading(true);


    try {

      const endpoint = isSignup
        ? `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/users/register`
        : `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/users/login`;


      const body = isSignup
        ? {
          name,
          email,
          password,
        }
        : {
          email,
          password,
        };


      const response = await fetch(endpoint, {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(body),

      });


      const data = await response.json();


      if (!response.ok) {

        throw new Error(
          data.message || "Authentication failed"
        );

      }


      setAccessToken(data.accessToken);


      setUser({

        _id: data._id,

        name: data.name,

        role: data.role,

      });

      navigate(data.role === "admin" ? "/dashboard" : "/user-dashboard");

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="
      min-h-screen
      bg-gradient-to-br
      from-slate-100
      via-white
      to-brand-50
      flex
      items-center
      justify-center
      px-5
      py-10
      relative
      top-16
    ">


      <div className="
        w-full
        max-w-6xl
        bg-white
        rounded-3xl
        shadow-2xl
        overflow-hidden
        grid
        lg:grid-cols-2
      ">


        {/* LEFT SIDE */}

        <div className="
          hidden
          lg:flex
          flex-col
          justify-center
          bg-gradient-to-br
          from-brand-700
          to-brand-500
          text-white
          p-14
        ">


          <h1 className="text-5xl font-bold">
            Code and Class
          </h1>


          <p className="
            mt-6
            text-lg
            text-brand-100
            leading-8
          ">

            Learn programming, improve your skills,
            and track your learning journey with
            beautiful structured courses.

          </p>


          <div className="mt-12">


            <div className="
              bg-white/20
              rounded-2xl
              p-6
              backdrop-blur
            ">


              <h2 className="text-2xl font-bold">
                Why Choose Us?
              </h2>


              <ul className="mt-5 space-y-3">

                <li>✔ Structured Learning</li>

                <li>✔ HD Video Lectures</li>

                <li>✔ Progress Tracking</li>

                <li>✔ Lifetime Access</li>

              </ul>


            </div>


          </div>


        </div>



        {/* RIGHT SIDE */}

        <div className="p-8 lg:p-14">


          {/* Toggle */}

          <div className="
            relative
            flex
            bg-slate-100
            rounded-xl
            p-1
            mb-8
          ">


            <motion.div

              className="
                absolute
                top-1
                bottom-1
                w-1/2
                rounded-lg
                bg-brand-600
              "

              animate={{
                x: isSignup ? "100%" : "0%",
              }}

              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}

            />


            <button

              onClick={() => switchMode(false)}

              className={`
                relative
                z-10
                flex-1
                py-3
                font-semibold
                transition-colors

                ${!isSignup
                  ? "text-white"
                  : "text-slate-600"
                }
              `}

            >

              Login

            </button>



            <button

              onClick={() => switchMode(true)}

              className={`
                relative
                z-10
                flex-1
                py-3
                font-semibold
                transition-colors

                ${isSignup
                  ? "text-white"
                  : "text-slate-600"
                }
              `}

            >

              Signup

            </button>


          </div>





          <AnimatePresence mode="wait">


            <motion.div

              key={isSignup}

              initial={{
                opacity: 0,
                x: 30
              }}

              animate={{
                opacity: 1,
                x: 0
              }}

              exit={{
                opacity: 0,
                x: -30
              }}

              transition={{
                duration: 0.35
              }}

            >


              <h2 className="
                text-3xl
                font-bold
                text-slate-800
              ">

                {
                  isSignup
                    ? "Create Account"
                    : "Welcome Back"
                }

              </h2>


              <p className="
                text-slate-500
                mt-2
                mb-8
              ">

                {
                  isSignup
                    ? "Create your account to start learning."
                    : "Login to continue learning."
                }

              </p>


            </motion.div>


          </AnimatePresence>



          {error && (

            <motion.div

              initial={{
                opacity: 0,
                y: -10
              }}

              animate={{
                opacity: 1,
                y: 0
              }}

              className="
                mb-5
                rounded-lg
                bg-red-50
                border
                border-red-200
                text-red-600
                p-3
                text-sm
              "

            >

              {error}

            </motion.div>

          )}






          <AnimatePresence>


            {
              isSignup && (

                <motion.div

                  initial={{
                    opacity: 0,
                    height: 0
                  }}

                  animate={{
                    opacity: 1,
                    height: "auto"
                  }}

                  exit={{
                    opacity: 0,
                    height: 0
                  }}

                  className="overflow-hidden"

                >

                  <InputField

                    label="Full Name"

                    type="text"

                    value={name}

                    setValue={setName}

                    placeholder="Enter your full name"

                    autoComplete="name"

                  />


                </motion.div>

              )
            }


          </AnimatePresence>





          <InputField

            label="Email"

            type="email"

            value={email}

            setValue={setEmail}

            placeholder="Enter your email"

            autoComplete="email"

          />




          <InputField

            label="Password"

            type={
              showPassword
                ? "text"
                : "password"
            }

            value={password}

            setValue={setPassword}

            placeholder="Enter password"

            autoComplete="current-password"

          />





          <div className="flex justify-end mb-5">


            <button

              type="button"

              onClick={() =>
                setShowPassword(!showPassword)
              }

              className="
                text-brand-600
                text-sm
              "

            >

              {
                showPassword
                  ? "Hide Password"
                  : "Show Password"
              }

            </button>


          </div>






          <button

            onClick={handleAuth}

            disabled={loading}

            className="
              w-full
              h-12
              rounded-xl
              bg-gradient-to-r
              from-brand-600
              to-brand-500
              hover:from-brand-700
              hover:to-brand-600
              text-white
              font-semibold
              transition
              shadow-lg
              disabled:opacity-50
            "

          >


            {
              loading

                ?

                <div className="
                flex
                justify-center
                items-center
                gap-3
              ">

                  <div className="
                  h-5
                  w-5
                  border-2
                  border-white
                  border-t-transparent
                  rounded-full
                  animate-spin
                "/>


                  {
                    isSignup
                      ? "Creating Account..."
                      : "Logging In..."
                  }


                </div>


                :

                (
                  isSignup
                    ? "Create Account"
                    : "Login"
                )

            }


          </button>



        </div>


      </div>


    </div>

  );

};


export default Login;