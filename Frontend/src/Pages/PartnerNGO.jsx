import React, { useState, useEffect, useMemo, useCallback } from "react";

/**
 * PartnerNGO — Code and Class
 * ---------------------------------------------------------------
 * Visual language: each NGO is presented as a "file card" — a nod
 * to the institute's identity as a coding school. Titlebars, a
 * monospace utility layer, and a violet/teal/amber accent trio
 * (borrowed from syntax highlighting) carry that theme without
 * tipping into a literal terminal pastiche.
 * ---------------------------------------------------------------
 */

const FONT_IMPORT_ID = "cc-partner-ngo-fonts";

const useDesignFonts = () => {
    useEffect(() => {
        if (document.getElementById(FONT_IMPORT_ID)) return;
        const link = document.createElement("link");
        link.id = FONT_IMPORT_ID;
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";
        document.head.appendChild(link);
    }, []);
};

const CardSkeleton = () => (
    <div className="rounded-xl border border-[#E4E4E1] bg-white overflow-hidden">
        <div className="h-8 bg-[#F0EFEC] border-b border-[#E4E4E1]" />
        <div className="h-44 bg-[#F0EFEC] animate-pulse" />
        <div className="p-4 space-y-3">
            <div className="h-4 w-2/3 bg-[#EDEDEA] rounded animate-pulse" />
            <div className="h-3 w-full bg-[#EDEDEA] rounded animate-pulse" />
            <div className="h-3 w-5/6 bg-[#EDEDEA] rounded animate-pulse" />
        </div>
    </div>
);

const TitleBar = ({ label }) => (
    <div className="flex items-center gap-2 h-8 px-3 bg-[#171923] shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-[#F2A93B]/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#0EA5A0]/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#6C4DF6]/80" />
        <span
            className="ml-2 truncate font-mono text-[11px] tracking-tight text-[#9CA3AF]"
            title={label}
        >
            {label}
        </span>
    </div>
);

const NgoCard = ({ ngo, onOpen }) => {
    const slug = (ngo.name || "ngo")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    return (
        <button
            type="button"
            onClick={() => onOpen(ngo)}
            className="group text-left rounded-xl border border-[#E4E4E1] bg-white overflow-hidden
                       transition-all duration-200 motion-safe:hover:-translate-y-1
                       hover:border-[#6C4DF6]/40 hover:shadow-[0_12px_30px_-12px_rgba(23,25,35,0.25)]
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C4DF6] focus-visible:ring-offset-2"
        >
            <TitleBar label={`ngo/${slug}.info`} />

            <div className="relative overflow-hidden">
                <img
                    src={ngo.image}
                    alt={ngo.name}
                    loading="lazy"
                    className="w-full h-48 object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.04]"
                />
                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <div className="p-4">
                <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-[#171923] leading-snug mb-1.5">
                    {ngo.name}
                </h3>
                <p className="text-sm text-[#5B5F6B] leading-relaxed line-clamp-3">
                    {ngo.shortDescription || ngo.description}
                </p>

                <span className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-[#6C4DF6] opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                    view_details <span aria-hidden>→</span>
                </span>
            </div>
        </button>
    );
};

const NgoDetail = ({ ngo, onClose }) => {
    useEffect(() => {
        const onKey = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-[#0B0D12]/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={ngo.name}
        >
            <div
                className="w-full max-w-2xl my-8 sm:my-0 rounded-xl overflow-hidden bg-white border border-[#E4E4E1] shadow-2xl motion-safe:animate-[cc-pop_.18s_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                <TitleBar label={`ngo/${(ngo.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.info`} />

                <div className="relative">
                    <img src={ngo.image} alt={ngo.name} className="w-full h-64 object-cover" />
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white
                                   flex items-center justify-center hover:bg-black/70 transition-colors
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 sm:p-8">
                    <p className="font-mono text-xs text-[#0EA5A0] mb-2 tracking-wide">
                        partner_organization
                    </p>
                    <h2 className="font-['Space_Grotesk'] text-2xl sm:text-3xl font-bold text-[#171923] mb-4">
                        {ngo.name}
                    </h2>
                    <p className="text-[#3F4250] leading-relaxed whitespace-pre-line">
                        {ngo.description}
                    </p>

                    <button
                        onClick={onClose}
                        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#171923] text-white
                                   px-5 py-2.5 text-sm font-medium hover:bg-[#2A2D3A] transition-colors
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C4DF6] focus-visible:ring-offset-2"
                    >
                        <span aria-hidden>←</span> Back to all NGOs
                    </button>
                </div>
            </div>
        </div>
    );
};

const PartnerNGO = () => {
    useDesignFonts();

    const [ngos, setNgos] = useState([]);
    const [selectedNgo, setSelectedNgo] = useState(null);
    const [status, setStatus] = useState("loading"); // loading | error | ready
    const [query, setQuery] = useState("");

    const fetchNgos = useCallback(async () => {
        try {
            setStatus("loading");
            const response = await fetch(`${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/ngos/ngos`);
            if (!response.ok) throw new Error("Failed to fetch NGOs");

            const data = await response.json();
            if (Array.isArray(data)) setNgos(data);
            else if (Array.isArray(data.ngos)) setNgos(data.ngos);
            else setNgos([]);

            setStatus("ready");
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    }, []);

    useEffect(() => {
        fetchNgos();
    }, [fetchNgos]);

    const filteredNgos = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return ngos;
        return ngos.filter((n) =>
            [n.name, n.shortDescription, n.description]
                .filter(Boolean)
                .some((f) => f.toLowerCase().includes(q))
        );
    }, [ngos, query]);

    return (
        <div className="min-h-screen bg-[#FAFAF8] relative top-16">
            <style>{`
                @keyframes cc-pop {
                    from { opacity: 0; transform: translateY(6px) scale(.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>

            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10 text-center">
                <p className="font-mono text-xs sm:text-sm text-[#0EA5A0] tracking-wide mb-3">
                    organizations we build alongside
                </p>
                <h1 className="font-['Space_Grotesk'] text-3xl sm:text-4xl md:text-5xl font-bold text-[#171923]">
                    Partner <span className="text-[#6C4DF6]">NGOs</span>
                </h1>
                <p className="mt-4 max-w-xl mx-auto text-[#5B5F6B] leading-relaxed">
                    Code &amp; Class works with mission-driven organizations to bring
                    computer literacy and career skills to more communities.
                </p>

                {status === "ready" && ngos.length > 0 && (
                    <div className="mt-8 max-w-md mx-auto">
                        <div className="flex items-center gap-2 rounded-lg border border-[#E4E4E1] bg-white px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#6C4DF6]/40 focus-within:border-[#6C4DF6]/50 transition-shadow">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="search --ngo name"
                                className="w-full bg-transparent outline-none text-sm text-[#171923] placeholder:text-[#A6A9B2] font-mono"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Body */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
                {status === "loading" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <CardSkeleton key={i} />
                        ))}
                    </div>
                )}

                {status === "error" && (
                    <div className="max-w-md mx-auto text-center rounded-xl border border-[#F3D9B1] bg-[#FFF8EC] px-6 py-10">
                        <p className="font-mono text-xs text-[#B45309] mb-2">Error: fetch_failed</p>
                        <h2 className="font-['Space_Grotesk'] text-xl font-semibold text-[#171923] mb-2">
                            Couldn't load NGO data
                        </h2>
                        <p className="text-sm text-[#5B5F6B] mb-6">
                            Something went wrong while reaching the server. Check your connection and try again.
                        </p>
                        <button
                            onClick={fetchNgos}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#171923] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#2A2D3A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6C4DF6] focus-visible:ring-offset-2"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {status === "ready" && (
                    filteredNgos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredNgos.map((ngo) => (
                                <NgoCard key={ngo._id || ngo.id} ngo={ngo} onOpen={setSelectedNgo} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="font-mono text-xs text-[#9CA3AF] mb-2">
                                {ngos.length === 0 ? "// no records in ngos[]" : `// 0 results for "${query}"`}
                            </p>
                            <p className="text-[#5B5F6B]">
                                {ngos.length === 0
                                    ? "No partner NGOs are listed yet."
                                    : "Try a different search term."}
                            </p>
                        </div>
                    )
                )}
            </div>

            {selectedNgo && (
                <NgoDetail ngo={selectedNgo} onClose={() => setSelectedNgo(null)} />
            )}
        </div>
    );
};

export default PartnerNGO;