import React from 'react';
import { FaDownload, FaFileAlt, FaLock } from 'react-icons/fa';
import NoteCheckout from './NoteCheckout';

const NotesCard = ({ id, image, title, driveLink, isPaid, price, unlocked, onUnlocked }) => {
    const locked = isPaid && !unlocked;

    return (
        <div className="group card-surface overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 hover:border-brand-300 w-full max-w-sm mx-auto">
            {/* Image */}
            <div className="relative overflow-hidden h-44">
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-brand-50 flex items-center justify-center">
                        <FaFileAlt className="text-4xl text-brand-300" />
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {isPaid ? (
                    <span className="absolute top-3 left-3 text-xs font-bold bg-amber-500 text-white px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                        {locked && <FaLock className="text-[10px]" />} ₹{price}
                    </span>
                ) : (
                    <span className="absolute top-3 left-3 text-xs font-bold bg-green-600 text-white px-2.5 py-1 rounded-full shadow-md">
                        Free
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col items-center gap-4">
                <h3 className="text-base font-bold text-slate-900 text-center line-clamp-2 min-h-[2.5rem]">
                    {title}
                </h3>

                {locked ? (
                    <NoteCheckout noteId={id} noteTitle={title} price={price} onUnlocked={onUnlocked} />
                ) : (
                    <a href={driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300"
                    >
                        <FaDownload className="text-sm" />
                        {isPaid ? 'Download' : 'Download Free'}
                    </a>
                )}
            </div>
        </div >
    );
};

export default NotesCard;
