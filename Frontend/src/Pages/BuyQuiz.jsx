import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaLock, FaSpinner, FaArrowLeft } from "react-icons/fa";
import { AuthContext } from "../context/AuthProvider";
import { authAxios } from "../utils/authAxios";

const loadRazorpayScript = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

const BuyQuiz = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { accessToken, user } = useContext(AuthContext);

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");

    const api = useMemo(() => authAxios(() => accessToken), [accessToken]);

    useEffect(() => {
        if (!accessToken) {
            navigate("/login");
            return;
        }

        const load = async () => {
            try {
                // getQuizToAttempt returns 200 (with questions) once the student
                // already has access — in that case there's nothing to buy, so send
                // them straight to the quiz. It returns 402 with { quiz: { title,
                // price } } while payment is still required, which is what this
                // page needs to show the buy button.
                const res = await api.get(`/quizzes/${id}`, { validateStatus: () => true });

                if (res.status === 200) {
                    navigate(`/quizzes/${id}`);
                    return;
                }

                if (res.status === 402 && res.data?.quiz) {
                    setQuiz(res.data.quiz);
                    return;
                }

                if (res.status === 401) {
                    navigate("/login");
                    return;
                }

                setError(res.data?.message || "This quiz could not be loaded.");
            } catch (err) {
                console.log("Failed to load quiz:", err);
                setError("This quiz could not be loaded.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id, accessToken, navigate, api]);

    const handleBuy = async () => {
        setError("");
        setProcessing(true);

        try {
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                setError("Could not load the payment gateway. Check your connection and try again.");
                setProcessing(false);
                return;
            }

            let orderData;
            try {
                const orderRes = await api.post(`/payments/create-topic-order`, {
                    contentId: id,
                    contentType: "Quiz",
                });
                orderData = orderRes.data;
            } catch (err) {
                setError(err.response?.data?.message || "Could not start the payment.");
                setProcessing(false);
                return;
            }

            const options = {
                key: orderData.keyId,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Code and Class",
                description: orderData.videoTitle || quiz?.title,
                order_id: orderData.orderId,
                prefill: { name: user?.name || "" },
                theme: { color: "#4f46e5" },
                handler: async (response) => {
                    try {
                        await api.post(`/payments/verify`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        });
                        navigate(`/quizzes/${id}`);
                    } catch (err) {
                        setError(
                            err.response?.data?.message ||
                            "Payment verification failed. Contact support if the amount was deducted."
                        );
                        setProcessing(false);
                    }
                },
                modal: { ondismiss: () => setProcessing(false) },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", () => {
                setError("Payment failed. Please try again.");
                setProcessing(false);
            });
            rzp.open();
        } catch (err) {
            setError("Something went wrong starting the payment.");
            setProcessing(false);
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-xl">Loading...</div>;
    }

    if (!quiz) {
        return <div className="text-center py-20 text-red-500">{error || "Quiz not found"}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-5 md:p-10 mt-10 flex items-center justify-center">
            <div className="max-w-lg w-full bg-white rounded-3xl shadow p-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6"
                >
                    <FaArrowLeft /> Back
                </button>

                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
                    <FaLock className="text-2xl text-orange-600" />
                </div>

                <h1 className="text-2xl font-bold text-center mt-5">{quiz.title}</h1>

                <p className="text-center text-gray-500 mt-2">
                    This is a paid quiz — unlock it to start writing.
                </p>

                <p className="text-center text-3xl font-bold text-indigo-600 mt-6">₹{quiz.price}</p>

                <button
                    onClick={handleBuy}
                    disabled={processing}
                    className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                    {processing ? (
                        <>
                            <FaSpinner className="animate-spin" /> Processing…
                        </>
                    ) : (
                        `Pay ₹${quiz.price} & Unlock`
                    )}
                </button>

                {error && <p className="text-sm text-red-500 text-center mt-4">{error}</p>}
            </div>
        </div>
    );
};

export default BuyQuiz;
