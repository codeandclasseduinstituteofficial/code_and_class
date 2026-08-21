import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAxios } from "../utils/authAxios";
import { AuthContext } from "../context/AuthProvider";

const APPLICATION_FEE = 199;

// The Razorpay Checkout script is never loaded anywhere else in this app
// (index.html has no <script> tag for it) — it has to be injected on demand
// before window.Razorpay can be used. Without this, every attempt to pay
// immediately failed with "Razorpay Checkout is not loaded."
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const countries = [
  {
    name: "United Kingdom",
    code: "UK",
    flag: "🇬🇧",
    category: "Popular",
    color: "from-blue-600 to-indigo-700",
    description:
      "Study at globally recognized universities with excellent career opportunities.",
    highlights: [
      "World-class universities",
      "1-year master's programs",
      "Post-study work opportunities",
      "Strong international exposure",
    ],
    process: [
      "Free profile evaluation",
      "University & course selection",
      "Application preparation",
      "Offer letter assistance",
      "Financial & document guidance",
      "Visa application support",
      "Pre-departure guidance",
    ],
  },
  {
    name: "United States",
    code: "USA",
    flag: "🇺🇸",
    category: "Popular",
    color: "from-red-500 to-blue-700",
    description:
      "Explore top universities, flexible programs and excellent global career opportunities.",
    highlights: [
      "Top-ranked universities",
      "STEM opportunities",
      "Scholarship guidance",
      "Global career opportunities",
    ],
    process: [
      "Profile assessment",
      "University shortlisting",
      "Application & SOP preparation",
      "Admission assistance",
      "Financial documentation",
      "Visa preparation",
      "Pre-departure support",
    ],
  },
  {
    name: "Canada",
    code: "CA",
    flag: "🇨🇦",
    category: "Popular",
    color: "from-red-500 to-rose-700",
    description:
      "Build your international career with quality education and student-friendly opportunities.",
    highlights: [
      "Quality education",
      "Career-focused programs",
      "Multicultural environment",
      "Strong student support",
    ],
    process: [
      "Profile evaluation",
      "Course & college selection",
      "Application submission",
      "Offer letter assistance",
      "Financial guidance",
      "Visa documentation",
      "Pre-departure support",
    ],
  },
  {
    name: "Australia",
    code: "AU",
    flag: "🇦🇺",
    category: "Popular",
    color: "from-cyan-500 to-blue-700",
    description:
      "Get access to globally recognized education and an exciting student lifestyle.",
    highlights: [
      "Globally recognized degrees",
      "Industry-focused courses",
      "Student-friendly cities",
      "Work opportunities",
    ],
    process: [
      "Profile analysis",
      "University selection",
      "Application processing",
      "Offer letter support",
      "Financial documentation",
      "Visa assistance",
      "Travel preparation",
    ],
  },
  {
    name: "Germany",
    code: "DE",
    flag: "🇩🇪",
    category: "Europe",
    color: "from-yellow-500 to-orange-700",
    description:
      "Experience high-quality European education with excellent academic and research opportunities.",
    highlights: [
      "Excellent universities",
      "Research opportunities",
      "Affordable education options",
      "Strong engineering programs",
    ],
    process: [
      "Profile evaluation",
      "University & course selection",
      "Application preparation",
      "Admission support",
      "Blocked account guidance",
      "Visa support",
      "Pre-departure guidance",
    ],
  },
  {
    name: "Ireland",
    code: "IE",
    flag: "🇮🇪",
    category: "Europe",
    color: "from-green-500 to-emerald-700",
    description:
      "Study in one of Europe's leading education and technology hubs.",
    highlights: [
      "Technology hub",
      "English-taught programs",
      "Industry exposure",
      "Post-study opportunities",
    ],
    process: [
      "Profile assessment",
      "Course selection",
      "University application",
      "Offer letter support",
      "Financial guidance",
      "Visa assistance",
      "Pre-departure support",
    ],
  },
  {
    name: "UAE",
    code: "UAE",
    flag: "🇦🇪",
    category: "Gulf",
    color: "from-emerald-500 to-green-800",
    description:
      "Study in a fast-growing global business destination with excellent career exposure.",
    highlights: [
      "Global business hub",
      "Modern infrastructure",
      "Short travel distance",
      "International universities",
    ],
    process: [
      "Profile evaluation",
      "Course & university selection",
      "Application processing",
      "Admission support",
      "Document verification",
      "Visa assistance",
      "Travel support",
    ],
  },
  {
    name: "Dubai",
    code: "DXB",
    flag: "🇦🇪",
    category: "Gulf",
    color: "from-purple-500 to-fuchsia-700",
    description:
      "Discover globally oriented education in one of the world's fastest-growing cities.",
    highlights: [
      "International campuses",
      "Business opportunities",
      "Modern lifestyle",
      "Excellent connectivity",
    ],
    process: [
      "Profile assessment",
      "Program selection",
      "Application submission",
      "Admission assistance",
      "Visa processing",
      "Accommodation guidance",
      "Travel support",
    ],
  },
  {
    name: "France",
    code: "FR",
    flag: "🇫🇷",
    category: "Europe",
    color: "from-blue-500 to-indigo-700",
    description:
      "Experience world-class European education and diverse academic opportunities.",
    highlights: [
      "Top business schools",
      "Affordable options",
      "Global exposure",
      "Strong cultural experience",
    ],
    process: [
      "Profile evaluation",
      "Program selection",
      "Application support",
      "Admission assistance",
      "Financial guidance",
      "Visa support",
      "Pre-departure assistance",
    ],
  },
  {
    name: "New Zealand",
    code: "NZ",
    flag: "🇳🇿",
    category: "Popular",
    color: "from-sky-500 to-blue-800",
    description:
      "Study in a safe, welcoming country known for quality education and beautiful surroundings.",
    highlights: [
      "High-quality education",
      "Safe environment",
      "Practical learning",
      "Student-friendly culture",
    ],
    process: [
      "Profile evaluation",
      "Course selection",
      "University application",
      "Offer letter support",
      "Financial documentation",
      "Visa assistance",
      "Pre-departure support",
    ],
  },
  {
    name: "Singapore",
    code: "SG",
    flag: "🇸🇬",
    category: "Asia",
    color: "from-red-500 to-red-800",
    description:
      "Get a world-class education in one of Asia's leading business and technology centers.",
    highlights: [
      "Top Asian universities",
      "Technology hub",
      "Excellent connectivity",
      "Strong career opportunities",
    ],
    process: [
      "Profile assessment",
      "Course selection",
      "Application preparation",
      "Admission assistance",
      "Financial guidance",
      "Visa support",
      "Travel assistance",
    ],
  },
  {
    name: "Malaysia",
    code: "MY",
    flag: "🇲🇾",
    category: "Asia",
    color: "from-blue-500 to-cyan-700",
    description:
      "Access affordable international education with a diverse student community.",
    highlights: [
      "Affordable education",
      "International universities",
      "Lower living costs",
      "Multicultural environment",
    ],
    process: [
      "Profile evaluation",
      "Program selection",
      "Application submission",
      "Admission assistance",
      "Document processing",
      "Visa support",
      "Travel preparation",
    ],
  },
];

const steps = [
  {
    number: "01",
    title: "Profile Evaluation",
    text: "Our experts understand your academic profile, goals and preferred destination.",
  },
  {
    number: "02",
    title: "University Selection",
    text: "We shortlist suitable universities and courses based on your profile.",
  },
  {
    number: "03",
    title: "Application Processing",
    text: "Our team prepares and submits your application with the required documents.",
  },
  {
    number: "04",
    title: "Offer Letter",
    text: "We assist you throughout the admission and offer letter process.",
  },
  {
    number: "05",
    title: "Visa Assistance",
    text: "Get complete guidance with documentation and visa preparation.",
  },
  {
    number: "06",
    title: "Pre-Departure",
    text: "We help you prepare for accommodation, travel and your new destination.",
  },
];

const initialFormData = {
  country: "",
  fullName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  city: "",
  qualification: "",
  percentage: "",
  course: "",
  intake: "",
  passport: "",
};

const AbroadPage = () => {
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  const api = authAxios(() => accessToken);

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showApplication, setShowApplication] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("online");

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [submitError, setSubmitError] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openApplication = (country = "") => {
    if (!accessToken) {
      navigate("/login");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      country,
    }));

    setSelectedCountry(null);
    setShowApplication(true);
    setSubmitted(false);
    setSubmitError("");
    setPaymentError("");
  };

  const closeApplication = () => {
    if (submitting || paymentProcessing) return;

    setShowApplication(false);
    setSubmitted(false);
    setSubmitError("");
    setPaymentError("");
  };

  /*
   * ---------------------------------------------------------
   * CREATE RAZORPAY APPLICATION ORDER
   * ---------------------------------------------------------
   */

  const createApplicationPayment = async (application) => {
    try {
      setPaymentProcessing(true);
      setPaymentError("");

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error(
          "Could not load the payment gateway. Please check your connection and try again."
        );
      }

      /*
       * Ask backend to create Razorpay order.
       */

      const orderResponse = await api.post(
        "/payments/create-application-order",
        {
          applicationType: "abroad",
          applicationId: application._id,
        }
      );

      const {
        orderId,
        amount,
        currency,
        keyId,
      } = orderResponse.data;

      if (!orderId) {
        throw new Error("Razorpay order was not created.");
      }

      if (!keyId) {
        throw new Error("Razorpay key ID was not returned by the server.");
      }

      /*
       * Open Razorpay Checkout.
       */

      const options = {
        key: keyId,

        amount,

        currency,

        name: "AbroadAssist",

        description: "Study Abroad Application Fee",

        order_id: orderId,

        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },

        notes: {
          applicationId: application._id,
          applicationType: "abroad",
        },

        theme: {
          color: "#2563eb",
        },

        modal: {
          ondismiss: () => {
            setPaymentProcessing(false);
            setPaymentError(
              "Payment window was closed. Your application is saved, but the application fee is still pending."
            );
          },
        },

        /*
         * Razorpay calls this after successful payment.
         */
        handler: async function (response) {
          try {
            setPaymentProcessing(true);
            setPaymentError("");

            const verifyResponse = await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (!verifyResponse.data?.success) {
              throw new Error(
                verifyResponse.data?.message ||
                "Payment verification failed."
              );
            }

            /*
             * Payment successfully verified by backend.
             */

            setSubmitted(true);
            setPaymentProcessing(false);
          } catch (error) {
            console.error("Payment verification error:", error);

            setPaymentProcessing(false);

            setPaymentError(
              error.response?.data?.message ||
              error.message ||
              "Payment was completed, but verification failed. Please contact support."
            );
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        console.error("Razorpay payment failed:", response);

        setPaymentProcessing(false);

        setPaymentError(
          response.error?.description ||
          "Payment failed. Please try again."
        );
      });

      razorpay.open();
    } catch (error) {
      console.error("Create application payment error:", error);

      setPaymentProcessing(false);

      setPaymentError(
        error.response?.data?.message ||
        error.message ||
        "Unable to start payment. Please try again."
      );
    }
  };

  /*
   * ---------------------------------------------------------
   * SUBMIT APPLICATION
   * ---------------------------------------------------------
   */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting || paymentProcessing) {
      return;
    }

    setSubmitError("");
    setPaymentError("");
    setSubmitting(true);

    try {
      /*
       * First create the application in MongoDB.
       */

      const response = await api.post("/abroadapplication", {
        ...formData,
        paymentMode: paymentMethod,
        applicationFee: APPLICATION_FEE,
      });

      const application = response.data?.application;

      if (!application?._id) {
        throw new Error(
          "Application was created but application ID was not returned."
        );
      }

      /*
       * OFFLINE PAYMENT
       */

      if (paymentMethod === "offline") {
        setSubmitted(true);
        return;
      }

      /*
       * ONLINE PAYMENT
       *
       * Create Razorpay order and open Checkout.
       */

      await createApplicationPayment(application);
    } catch (error) {
      console.error("Application submission error:", error);

      setSubmitError(
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 mt-16">
      {/* NAVBAR */}

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-lg font-black text-white shadow-lg shadow-blue-200">
              A
            </div>

            <div>
              <h1 className="text-base font-black tracking-tight text-slate-900">
                Abroad
                <span className="text-blue-600">Assist</span>
              </h1>

              <p className="hidden text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:block">
                Your Global Education Partner
              </p>
            </div>
          </div>

          <button
            onClick={() => openApplication()}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 sm:px-5"
          >
            Apply Now
          </button>
        </div>
      </header>

      {/* HERO */}

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="absolute -bottom-40 right-0 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-blue-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                Trusted by 1000s of Students
              </div>

              <h2 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Your Journey to{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Study Abroad
                </span>{" "}
                Starts Here.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                From choosing the right country and university to applications,
                admissions and visa guidance — our experts help you through the
                complete process.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => openApplication()}
                  className="rounded-2xl bg-blue-600 px-7 py-4 text-sm font-black text-white shadow-xl shadow-blue-900/30 transition hover:-translate-y-0.5 hover:bg-blue-500"
                >
                  Start Your Application →
                </button>

                <a
                  href="#countries"
                  className="rounded-2xl border border-white/15 bg-white/5 px-7 py-4 text-center text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Explore Countries
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-6 text-sm">
                <div>
                  <p className="text-2xl font-black text-white">1000+</p>
                  <p className="text-slate-400">Students Guided</p>
                </div>

                <div className="h-10 w-px bg-white/10" />

                <div>
                  <p className="text-2xl font-black text-white">12+</p>
                  <p className="text-slate-400">Destinations</p>
                </div>

                <div className="h-10 w-px bg-white/10" />

                <div>
                  <p className="text-2xl font-black text-white">100%</p>
                  <p className="text-slate-400">Process Support</p>
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-lg">
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-xl">
                <div className="rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-800 p-7">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold text-blue-100">
                        GLOBAL OPPORTUNITIES
                      </p>

                      <h3 className="mt-2 text-3xl font-black text-white">
                        Dream.
                        <br />
                        Apply.
                        <br />
                        Fly.
                      </h3>
                    </div>

                    <div className="text-5xl">🌎</div>
                  </div>

                  <div className="mt-12 grid grid-cols-3 gap-3">
                    {["🇬🇧", "🇨🇦", "🇺🇸", "🇦🇺", "🇩🇪", "🇦🇪"].map(
                      (flag, index) => (
                        <div
                          key={index}
                          className="flex h-16 items-center justify-center rounded-2xl bg-white/10 text-3xl backdrop-blur-sm"
                        >
                          {flag}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:-left-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-xl">
                    ✓
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-400">
                      APPLICATION
                    </p>

                    <p className="font-black text-slate-900">
                      Expert Assisted
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTRIES */}

      <section id="countries" className="scroll-mt-20 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              Choose Your Destination
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Popular Student-Preferred Countries
            </h2>

            <p className="mt-4 text-sm leading-6 text-slate-500 sm:text-base">
              Explore leading study destinations across Europe, North America,
              Asia, Australia and the Gulf.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {countries.map((country) => (
              <button
                key={country.code}
                onClick={() => setSelectedCountry(country)}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/70"
              >
                <div
                  className={`relative h-32 overflow-hidden bg-gradient-to-br ${country.color} p-5`}
                >
                  <div className="absolute -right-5 -top-8 text-8xl opacity-10">
                    🌎
                  </div>

                  <div className="relative flex items-start justify-between">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur">
                      {country.category}
                    </span>

                    <span className="text-4xl drop-shadow">
                      {country.flag}
                    </span>
                  </div>

                  <p className="relative mt-5 text-xl font-black text-white">
                    {country.name}
                  </p>
                </div>

                <div className="p-5">
                  <p className="line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
                    {country.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-xs font-bold text-blue-600">
                      View Guide
                    </span>

                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                      →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}

      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                Why Choose Us
              </span>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                One trusted platform.
                <br />
                <span className="text-blue-600">Complete support.</span>
              </h2>

              <p className="mt-5 max-w-xl text-base leading-7 text-slate-500">
                Studying abroad involves dozens of decisions and documents.
                Our team helps simplify the entire journey so you can focus on
                your education and future.
              </p>

              <button
                onClick={() => openApplication()}
                className="mt-7 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-blue-600"
              >
                Begin Your Journey →
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                [
                  "01",
                  "Personal Guidance",
                  "Get guidance tailored to your academic profile and goals.",
                ],
                [
                  "02",
                  "Complete Process",
                  "From university selection to visa assistance, we support every step.",
                ],
                [
                  "03",
                  "Transparent Support",
                  "Clear communication and guidance throughout your application.",
                ],
                [
                  "04",
                  "Student First",
                  "Your goals, preferences and future remain at the center.",
                ],
              ].map(([number, title, text]) => (
                <div
                  key={number}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-6"
                >
                  <span className="text-xs font-black text-blue-600">
                    {number}
                  </span>

                  <h3 className="mt-4 font-black text-slate-900">{title}</h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}

      <section className="bg-slate-950 py-20 text-white sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
              Simple Process
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              From dream to destination.
            </h2>

            <p className="mt-4 text-slate-400">
              Our team guides you through each important stage of your
              international education journey.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.number}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-blue-500/40 hover:bg-white/[0.07]"
              >
                <span className="text-4xl font-black text-blue-500/40">
                  {step.number}
                </span>

                <h3 className="mt-4 text-lg font-black">{step.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-700 p-8 shadow-2xl shadow-blue-200 sm:p-12 lg:p-16">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-100">
                Ready to start?
              </p>

              <h2 className="mt-3 max-w-2xl text-3xl font-black text-white sm:text-4xl">
                Take the first step towards your international education.
              </h2>

              <p className="mt-4 max-w-xl text-blue-100">
                Complete our application form and our team will get in touch
                with you.
              </p>
            </div>

            <button
              onClick={() => openApplication()}
              className="w-full shrink-0 rounded-2xl bg-white px-7 py-4 text-sm font-black text-blue-700 shadow-xl transition hover:-translate-y-0.5 lg:w-auto"
            >
              Fill Application Form →
            </button>
          </div>
        </div>
      </section>

      {/* COUNTRY GUIDE MODAL */}

      {selectedCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
            <div
              className={`relative bg-gradient-to-br ${selectedCountry.color} p-7 text-white sm:p-9`}
            >
              <button
                onClick={() => setSelectedCountry(null)}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg transition hover:bg-white/20"
              >
                ×
              </button>

              <div className="flex items-center gap-4">
                <span className="text-5xl">{selectedCountry.flag}</span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                    Study Destination
                  </p>

                  <h2 className="mt-1 text-3xl font-black">
                    {selectedCountry.name}
                  </h2>
                </div>
              </div>

              <p className="mt-6 max-w-xl text-sm leading-6 text-white/80">
                {selectedCountry.description}
              </p>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-6 sm:p-8">
              <h3 className="text-lg font-black">
                Why students choose it
              </h3>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {selectedCountry.highlights.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm font-semibold text-slate-700"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      ✓
                    </span>

                    {item}
                  </div>
                ))}
              </div>

              <div className="my-8 h-px bg-slate-100" />

              <h3 className="text-lg font-black">
                Complete application journey
              </h3>

              <div className="mt-5 space-y-4">
                {selectedCountry.process.map((item, index) => (
                  <div key={item} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">
                      {index + 1}
                    </div>

                    <div>
                      <p className="font-bold text-slate-800">{item}</p>

                      <p className="mt-1 text-sm text-slate-500">
                        Our team will guide you through this stage.
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <div className="flex gap-3">
                  <div className="text-xl">🛡️</div>

                  <div>
                    <p className="font-black text-blue-900">
                      Complete support from our team
                    </p>

                    <p className="mt-1 text-sm leading-6 text-blue-700">
                      We help you understand and complete each stage of the
                      process so you don't have to navigate it alone.
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => openApplication(selectedCountry.name)}
                className="mt-6 w-full rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Fill Application Form for {selectedCountry.name} →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPLICATION MODAL */}

      {showApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6">
          <div className="mx-auto my-4 w-full max-w-3xl overflow-hidden rounded-[1.5rem] bg-white shadow-2xl sm:my-8 sm:rounded-[2rem]">
            <div className="bg-slate-950 px-5 py-6 text-white sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
                    Start Your Journey
                  </p>

                  <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                    Application Form
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Tell us about yourself and your preferred study destination.
                  </p>
                </div>

                <button
                  onClick={closeApplication}
                  disabled={submitting || paymentProcessing}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ×
                </button>
              </div>
            </div>

            {submitted ? (
              <div className="px-6 py-16 text-center sm:px-10">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl text-emerald-600">
                  ✓
                </div>

                <h3 className="mt-6 text-2xl font-black text-slate-900">
                  Application Received!
                </h3>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                  {paymentMethod === "online"
                    ? "Your application and payment have been successfully received. Our team will contact you regarding the next steps."
                    : "Your application has been submitted successfully. Our team will contact you regarding the next steps and offline payment process."}
                </p>

                <button
                  onClick={() => {
                    setShowApplication(false);
                    setSubmitted(false);
                    setFormData(initialFormData);
                  }}
                  className="mt-7 rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 sm:p-8">
                {/* STEP 01 */}

                <div className="mb-8">
                  <div className="mb-4">
                    <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                      Step 01
                    </p>

                    <h3 className="mt-1 text-lg font-black">
                      Select your destination
                    </h3>
                  </div>

                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Preferred Country *
                  </label>

                  <select
                    required
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >
                    <option value="">Select a country</option>

                    {countries.map((country) => (
                      <option key={country.code} value={country.name}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* STEP 02 */}

                <div className="mb-8">
                  <div className="mb-5">
                    <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                      Step 02
                    </p>

                    <h3 className="mt-1 text-lg font-black">
                      Basic Information
                    </h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Full Name"
                      name="fullName"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Phone Number"
                      name="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Current City"
                      name="city"
                      placeholder="Enter your city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Highest Qualification *
                      </label>

                      <select
                        required
                        name="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      >
                        <option value="">Select qualification</option>
                        <option value="12th">12th / Intermediate</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Bachelors">Bachelor's Degree</option>
                        <option value="Masters">Master's Degree</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <Input
                      label="Percentage / CGPA"
                      name="percentage"
                      placeholder="e.g. 78% or 8.2 CGPA"
                      value={formData.percentage}
                      onChange={handleChange}
                      required
                    />

                    <Input
                      label="Preferred Course"
                      name="course"
                      placeholder="e.g. MBA, MS Computer Science"
                      value={formData.course}
                      onChange={handleChange}
                    />

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Preferred Intake
                      </label>

                      <select
                        name="intake"
                        value={formData.intake}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      >
                        <option value="">Select intake</option>
                        <option value="January">January</option>
                        <option value="May">May</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-sm font-bold text-slate-700">
                        Passport Status
                      </label>

                      <select
                        name="passport"
                        value={formData.passport}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      >
                        <option value="">Select status</option>
                        <option value="Available">
                          I have a passport
                        </option>
                        <option value="Applied">
                          Passport applied
                        </option>
                        <option value="Not Available">
                          I don't have a passport
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* STEP 03 PAYMENT */}

                <div>
                  <div className="mb-5">
                    <p className="text-xs font-black uppercase tracking-wider text-blue-600">
                      Step 03
                    </p>

                    <h3 className="mt-1 text-lg font-black">
                      Application Fee
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Application processing fee:{" "}
                      <strong className="text-slate-900">
                        ₹{APPLICATION_FEE}
                      </strong>
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <PaymentOption
                      selected={paymentMethod === "online"}
                      onClick={() => {
                        if (!submitting && !paymentProcessing) {
                          setPaymentMethod("online");
                          setPaymentError("");
                        }
                      }}
                      title="Pay Online"
                      description="Secure Razorpay payment"
                      icon="💳"
                    />

                    <PaymentOption
                      selected={paymentMethod === "offline"}
                      onClick={() => {
                        if (!submitting && !paymentProcessing) {
                          setPaymentMethod("offline");
                          setPaymentError("");
                        }
                      }}
                      title="Pay Offline"
                      description="Submit now & pay later"
                      icon="🏢"
                    />
                  </div>

                  <div className="mt-5 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                    <strong className="text-slate-700">
                      {paymentMethod === "online"
                        ? "Online payment:"
                        : "Offline payment:"}
                    </strong>{" "}
                    {paymentMethod === "online"
                      ? "After submitting the application, Razorpay Checkout will open for the ₹199 application fee."
                      : "Your application will be submitted immediately. Our team will contact you regarding the offline payment process."}
                  </div>
                </div>

                {/* ERRORS */}

                {submitError && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
                    {submitError}
                  </div>
                )}

                {paymentError && (
                  <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm font-semibold text-orange-700">
                    {paymentError}
                  </div>
                )}

                {/* SUBMIT */}

                <button
                  type="submit"
                  disabled={submitting || paymentProcessing}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-xl shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Submitting Application..."
                    : paymentProcessing
                      ? "Processing Payment..."
                      : paymentMethod === "online"
                        ? `Continue to Secure Payment • ₹${APPLICATION_FEE} →`
                        : "Submit Application →"}
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                  By submitting this form, you agree to be contacted by our
                  team regarding your study abroad application.
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/*
 * INPUT COMPONENT
 */

const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label} {required && "*"}
      </label>

      <input
        required={required}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />
    </div>
  );
};

/*
 * PAYMENT OPTION
 */

const PaymentOption = ({
  selected,
  onClick,
  title,
  description,
  icon,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-4 rounded-2xl border p-4 text-left transition ${selected
        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/10"
        : "border-slate-200 bg-white hover:border-slate-300"
        }`}
    >
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${selected ? "bg-blue-600 text-white" : "bg-slate-100"
          }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-black text-slate-900">{title}</p>

        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <div
        className={`ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${selected
          ? "border-blue-600 bg-blue-600"
          : "border-slate-300 bg-white"
          }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-white" />}
      </div>
    </button>
  );
};

export default AbroadPage;