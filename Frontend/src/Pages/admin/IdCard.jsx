import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useParams } from "react-router-dom";
import logo from "../../assets/Logo.jpeg";

const API_BASE = `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/idcard`;

const IdCard = () => {
    const { id } = useParams();
    const cardRef = useRef(null);
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchId = async () => {
            try {
                const res = await fetch(`${API_BASE}/${id}`);
                const data = await res.json();
                setStudent(data?.data || null);
            } catch (err) {
                console.error("Failed to fetch ID card data", err);
            }
        };

        fetchId();
    }, [id]);

    const downloadIdCard = async () => {
        if (!cardRef.current) return;

        try {
            setLoading(true);

            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                backgroundColor: "#F1E9DE",
                onclone: (doc) => {
                    // Safety: strip any unsupported colors
                    doc.querySelectorAll("*").forEach((el) => {
                        ["color", "backgroundColor", "borderColor"].forEach((prop) => {
                            const value = el.style?.[prop];
                            if (value?.includes("oklch")) {
                                el.style[prop] = "#000";
                            }
                        });
                    });
                },
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("landscape", "px", [320, 200]);
            pdf.addImage(imgData, "PNG", 0, 0, 320, 200);
            pdf.save("code-and-class-id-card.pdf");
        } catch (err) {
            console.error("ID card export failed", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 relative top-28 min-h-screen">

            {/* ID CARD */}
            <div
                ref={cardRef}
                style={{
                    width: 320,
                    height: 200,
                    backgroundColor: "#F1E9DE",
                    border: "1px solid #ccc",
                    borderRadius: 6,
                    padding: 8,
                    fontFamily: "Arial, sans-serif",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Watermark */}
                <img
                    src={logo}
                    alt="watermark"
                    style={{
                        position: "absolute",
                        inset: 0,
                        margin: "auto",
                        width: 160,
                        opacity: 0.1,
                    }}
                />

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, zIndex: 1, position: "relative" }}>
                    <img src={logo} alt="logo" width={32} height={32} />
                    <h2 style={{ fontSize: 12, fontWeight: "bold", color: "#1E3A8A" }}>
                        Code and Class Educational Institute
                    </h2>
                </div>

                <hr style={{ borderColor: "#B85025", margin: "4px 0" }} />

                {/* Body */}
                <div style={{ display: "flex", gap: 8, marginTop: 6, zIndex: 1, position: "relative" }}>
                    {/* Photo */}
                    <div
                        style={{
                            width: 120,
                            height: 100,
                            border: "1px dashed #666",
                            fontSize: 8,
                            color: "#555",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        Paste Photo
                    </div>

                    {/* Details */}
                    <div style={{ fontSize: 10, lineHeight: 1.4 }}>
                        <p><b>Name:</b> {student?.studentName}</p>
                        <p><b>Father:</b> {student?.family?.fatherName}</p>
                        <p><b>Course:</b> {student?.course}</p>
                        <p><b>Mobile:</b> {student?.mobileNumber}</p>
                        <p>
                            <b>Address:</b>{" "}
                            {[student?.village, student?.mandal, student?.district]
                                .filter(Boolean)
                                .join(", ")}
                        </p>
                    </div>
                </div>

                <hr style={{ borderColor: "#B85025", marginTop: 6 }} />
                <p style={{ fontSize: 9 }}>address</p>
            </div>

            {/* DOWNLOAD BUTTON */}
            <button
                onClick={downloadIdCard}
                disabled={loading}
                style={{
                    backgroundColor: "#1E3A8A",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: 6,
                    opacity: loading ? 0.7 : 1,
                }}
            >
                {loading ? "Generating..." : "Download ID Card"}
            </button>
        </div>
    );
};

export default IdCard;