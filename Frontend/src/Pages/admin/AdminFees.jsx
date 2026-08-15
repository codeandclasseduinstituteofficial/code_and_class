import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import toast from "react-hot-toast";
import {
    FaPlus,
    FaMoneyBillWave,
    FaTimes,
    FaTrash,
} from "react-icons/fa";

const API_BASE = import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api";

const AdminFees = () => {
    const { accessToken } = useContext(AuthContext);

    const [fees, setFees] = useState([]);
    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newFee, setNewFee] = useState({ user: "", course: "", label: "", totalFee: "" });
    const [saving, setSaving] = useState(false);

    const [payingFor, setPayingFor] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMode, setPaymentMode] = useState("offline");
    const [paymentNote, setPaymentNote] = useState("");

    const authHeaders = { Authorization: `Bearer ${accessToken}` };

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [feesRes, usersRes, coursesRes] = await Promise.all([
                fetch(`${API_BASE}/fees`, { headers: authHeaders }),
                fetch(`${API_BASE}/users`, { headers: authHeaders }),
                fetch(`${API_BASE}/courses`),
            ]);
            const feesData = await feesRes.json();
            const usersData = await usersRes.json();
            const coursesData = await coursesRes.json();

            setFees(feesData.data || []);
            setUsers(Array.isArray(usersData) ? usersData : usersData.data || []);
            setCourses(Array.isArray(coursesData) ? coursesData : coursesData.data || []);
        } catch (err) {
            console.log("Failed to load fees:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddFee = async (e) => {
        e.preventDefault();

        if (!newFee.user || !newFee.totalFee) {
            toast.error("Select a student and enter the total fee.");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/fees`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify({
                    ...newFee,
                    course: newFee.course || undefined,
                    totalFee: Number(newFee.totalFee),
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Could not create the fee record.");
                return;
            }

            toast.success("Fee record created.");
            setShowAddForm(false);
            setNewFee({ user: "", course: "", label: "", totalFee: "" });
            fetchAll();
        } catch (err) {
            toast.error("Something went wrong.");
        } finally {
            setSaving(false);
        }
    };

    const handleRecordPayment = async (e) => {
        e.preventDefault();

        if (!paymentAmount || Number(paymentAmount) <= 0) {
            toast.error("Enter a valid payment amount.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/fees/${payingFor._id}/payments`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders },
                body: JSON.stringify({
                    amount: Number(paymentAmount),
                    mode: paymentMode,
                    note: paymentNote,
                }),
            });
            const data = await res.json();

            if (!res.ok) {
                toast.error(data.message || "Could not record the payment.");
                return;
            }

            toast.success("Payment recorded.");
            setPayingFor(null);
            setPaymentAmount("");
            setPaymentNote("");
            fetchAll();
        } catch (err) {
            toast.error("Something went wrong.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this fee record?")) return;
        try {
            await fetch(`${API_BASE}/fees/${id}`, {
                method: "DELETE",
                headers: authHeaders,
            });
            fetchAll();
        } catch (err) {
            console.log("Delete failed:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-5 md:p-10 mt-10">
            <div className="max-w-6xl mx-auto">

                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-3xl font-bold">Student Fees</h1>
                        <p className="text-gray-500 mt-1">
                            Track who has paid, how much, and who still has dues.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg"
                    >
                        <FaPlus /> Add Fee Record
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-500 mt-8">Loading...</p>
                ) : fees.length === 0 ? (
                    <p className="text-gray-500 mt-8">No fee records yet.</p>
                ) : (
                    <div className="mt-8 bg-white rounded-2xl shadow overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b bg-gray-50">
                                    <th className="p-4">Student</th>
                                    <th className="p-4">Course / Label</th>
                                    <th className="p-4">Total Fee</th>
                                    <th className="p-4">Paid</th>
                                    <th className="p-4">Due</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {fees.map((fee) => (
                                    <tr key={fee._id} className="border-b last:border-0">
                                        <td className="p-4">
                                            <p className="font-semibold">{fee.user?.name}</p>
                                            <p className="text-gray-400 text-xs">{fee.user?.email}</p>
                                        </td>
                                        <td className="p-4">{fee.course?.title || fee.label || "—"}</td>
                                        <td className="p-4">₹{fee.totalFee}</td>
                                        <td className="p-4">₹{fee.amountPaid}</td>
                                        <td className="p-4">
                                            {fee.dueAmount > 0 ? (
                                                <span className="text-red-600 font-bold">₹{fee.dueAmount}</span>
                                            ) : (
                                                <span className="text-green-600 font-bold">Paid</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2 justify-end">
                                                {fee.dueAmount > 0 && (
                                                    <button
                                                        onClick={() => setPayingFor(fee)}
                                                        className="flex items-center gap-1 text-xs bg-green-50 text-green-700 px-3 py-2 rounded-lg hover:bg-green-100"
                                                    >
                                                        <FaMoneyBillWave /> Record Payment
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(fee._id)}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ADD FEE MODAL */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-6 md:p-8 relative">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
                            >
                                <FaTimes size={20} />
                            </button>

                            <h2 className="text-2xl font-bold">Add Fee Record</h2>

                            <form onSubmit={handleAddFee} className="mt-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Student</label>
                                    <select
                                        value={newFee.user}
                                        onChange={(e) => setNewFee({ ...newFee, user: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option value="">Select a student</option>
                                        {users.filter((u) => u.role !== "admin").map((u) => (
                                            <option key={u._id} value={u._id}>
                                                {u.name} ({u.email})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">
                                        Course (optional)
                                    </label>
                                    <select
                                        value={newFee.course}
                                        onChange={(e) => setNewFee({ ...newFee, course: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option value="">No specific course</option>
                                        {courses.map((c) => (
                                            <option key={c._id} value={c._id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">
                                        Label (if no course, e.g. "Tuition Fee")
                                    </label>
                                    <input
                                        type="text"
                                        value={newFee.label}
                                        onChange={(e) => setNewFee({ ...newFee, label: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">
                                        Total Fee (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={newFee.totalFee}
                                        onChange={(e) => setNewFee({ ...newFee, totalFee: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 text-white font-bold py-3 rounded-xl"
                                >
                                    {saving ? "Saving..." : "Create Fee Record"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {/* RECORD PAYMENT MODAL */}
                {payingFor && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 md:p-8 relative">
                            <button
                                onClick={() => setPayingFor(null)}
                                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700"
                            >
                                <FaTimes size={20} />
                            </button>

                            <h2 className="text-2xl font-bold">Record Payment</h2>
                            <p className="text-gray-500 mt-1">
                                {payingFor.user?.name} — due ₹{payingFor.dueAmount}
                            </p>

                            <form onSubmit={handleRecordPayment} className="mt-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Amount (₹)</label>
                                    <input
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Mode</label>
                                    <select
                                        value={paymentMode}
                                        onChange={(e) => setPaymentMode(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option value="offline">Offline / Cash</option>
                                        <option value="online">Online</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-1">Note (optional)</label>
                                    <input
                                        type="text"
                                        value={paymentNote}
                                        onChange={(e) => setPaymentNote(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl"
                                >
                                    Record Payment
                                </button>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminFees;
