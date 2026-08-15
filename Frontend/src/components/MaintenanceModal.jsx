// components/MaintenanceModal.jsx
import React from "react";
import { FaTools, FaTimes } from "react-icons/fa";

const MaintenanceModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div
            className="
                fixed inset-0 z-50
                flex items-center justify-center
                bg-black/50
                p-4
            "
            onClick={onClose}
        >
            <div
                className="
                    bg-white
                    rounded-2xl
                    shadow-xl
                    max-w-sm
                    w-full
                    p-6
                    relative
                "
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="
                        absolute top-4 right-4
                        text-gray-400 hover:text-gray-600
                    "
                >
                    <FaTimes size={18} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="
                        bg-yellow-100
                        text-yellow-600
                        rounded-full
                        p-4
                        mb-4
                    ">
                        <FaTools size={28} />
                    </div>

                    <h2 className="text-xl font-bold">
                        Service Under Maintenance
                    </h2>

                    <p className="text-gray-500 mt-2">
                        This feature is temporarily unavailable while
                        we perform maintenance. Please check back later.
                    </p>

                    <p className="text-gray-400 text-sm mt-3">
                        If you're an admin and need more details,
                        please contact the developer.
                    </p>

                    <button
                        onClick={onClose}
                        className="
                            mt-5
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            font-semibold
                            px-6 py-2
                            rounded-xl
                            transition
                        "
                    >
                        Okay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceModal;