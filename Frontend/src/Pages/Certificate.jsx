import React, { useEffect, useRef, useState } from 'react';
import domtoimage from 'dom-to-image';
import { useParams } from 'react-router-dom';

// --- Bring in every logo/seal exactly as it appears on the printed sample ---
// Add any of these you don't have yet to /assets and update the path.
import logo from '../assets/Logo.jpeg';           // shield "</>" Code and Class logo
import msme from '../assets/msme.webp';           // MSME badge
import iso from '../assets/iso.webp';             // ISO badge
import arpan from '../assets/iso.webp';         // gold "D" ARPAN badge
import accredited from '../assets/msme.webp'; // "ACCREDITED EDUCATIONAL SKILLS PARTNER" badge
import seal from '../assets/Logo.jpeg';           // center circular official seal

const Certificate = () => {
    const { id } = useParams();
    const [certDetails, setCertDetails] = useState(null);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('loading'); // loading | downloading | done | error
    const certificateRef = useRef();

    const API_BASE = `${import.meta.env.VITE_API_URL || "https://code-and-class.onrender.com/api"}/certificates`;

    useEffect(() => {
        const fetchCertificate = async () => {
            try {
                const response = await fetch(
                    `${API_BASE}/download/${id.toUpperCase()}`
                );

                if (response.status === 404) {
                    setError('Certificate not found. Please check the number.');
                    setStatus('error');
                    return;
                }
                if (response.status === 403) {
                    setError('Certificate not Verified Yet!');
                    setStatus('error');
                    return;
                }
                if (!response.ok) {
                    setError('Error fetching certificate. Please try again.');
                    setStatus('error');
                    return;
                }

                const data = await response.json();
                if (!data || !data.name) {
                    setError('Certificate not found. Please check the number.');
                    setStatus('error');
                    return;
                }

                setCertDetails(data);
            } catch (err) {
                console.error(err);
                setError('Error fetching certificate. Please try again.');
                setStatus('error');
            }
        };

        fetchCertificate();
    }, [id]);

    useEffect(() => {
        if (!certDetails) return;
        setStatus('downloading');
        const timer = setTimeout(() => {
            captureAndDownload();
        }, 300);
        return () => clearTimeout(timer);
    }, [certDetails]);

    const captureAndDownload = () => {
        if (!certificateRef.current) return;
        domtoimage
            .toPng(certificateRef.current, { quality: 1 })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `${certDetails?.certificate_no?.replace(/\//g, '-') || 'certificate'}.png`;
                link.href = dataUrl;
                link.click();
                setStatus('done');
            })
            .catch((err) => {
                console.error(err);
                setError('Could not generate the certificate image. Please try again.');
                setStatus('error');
            });
    };

    // Small inline icons so we don't need an icon-library dependency
    const PinIcon = () => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#B24E23"><path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z" /></svg>
    );
    const MailIcon = () => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#1e3a5f"><path d="M2 4h20v16H2V4zm2 2v.01L12 12l8-5.99V6H4zm16 12V8.24l-8 6-8-6V18h16z" /></svg>
    );
    const PhoneIcon = () => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="#1e3a5f"><path d="M6.6 10.8c1.4 2.7 3.6 4.9 6.3 6.3l2.1-2.1c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.9 21 3 13.1 3 3.5c0-.6.4-1 1-1H8c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.3 1.1L6.6 10.8z" /></svg>
    );

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 px-4">
            {status === 'loading' && (
                <p className="text-slate-500 text-lg">Fetching your certificate…</p>
            )}

            {status === 'downloading' && (
                <p className="text-slate-500 text-lg">Preparing your certificate for download…</p>
            )}

            {status === 'done' && (
                <div className="text-center space-y-3">
                    <p className="text-green-600 font-semibold text-xl">Your certificate has been downloaded.</p>
                    <button
                        onClick={() => { setStatus('downloading'); captureAndDownload(); }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                    >
                        Download Again
                    </button>
                </div>
            )}

            {status === 'error' && (
                <p className="text-red-500 font-extrabold text-2xl text-center">{error}</p>
            )}

            {/* Off-screen render target — used only to generate the PNG, never shown to the user */}
            {certDetails && (
                <div style={{ position: 'fixed', top: 0, left: '-10000px', zIndex: -1 }}>
                    <div
                        ref={certificateRef}
                        style={{
                            width: '1250px',
                            padding: '10px',
                            background: 'linear-gradient(135deg, #B24E23 0%, #c9a227 50%, #B24E23 100%)',
                            position: 'relative',
                        }}
                    >
                        {/* dark navy cut corners, like the printed sample */}
                        {[
                            { top: 0, left: 0, clip: 'polygon(0 0, 100% 0, 0 100%)' },
                            { top: 0, right: 0, clip: 'polygon(100% 0, 100% 100%, 0 0)' },
                            { bottom: 0, left: 0, clip: 'polygon(0 100%, 0 0, 100% 100%)' },
                            { bottom: 0, right: 0, clip: 'polygon(100% 100%, 0 100%, 100% 0)' },
                        ].map((c, i) => (
                            <div
                                key={i}
                                style={{
                                    position: 'absolute',
                                    width: '46px',
                                    height: '46px',
                                    background: '#1e2a4a',
                                    clipPath: c.clip,
                                    ...c,
                                }}
                            />
                        ))}

                        <div className="bg-white p-8" style={{ position: 'relative' }}>

                            {/* Header */}
                            <div className="flex items-start justify-between pb-4">
                                <div className="flex items-center gap-4">
                                    <img src={logo} alt="Code and Class" className="w-16 h-16 object-contain" />
                                    <div>
                                        <h1 className="text-4xl font-extrabold tracking-wide" style={{ color: '#1e3a5f' }}>CODE AND CLASS</h1>
                                        <h2 className="text-xl font-bold tracking-widest" style={{ color: '#B24E23' }}>EDUCATIONAL INSTITUTE</h2>
                                        <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                                            <PinIcon /> 18-7-257, Talab Katta Road, Hyderabad, Telangana - 500002, India
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pl-4" style={{ borderLeft: '2px solid #c9a227' }}>
                                    <div className="text-center">
                                        <p className="text-xs font-semibold" style={{ color: '#c9a227' }}>Registration No.</p>
                                        <p className="text-lg font-bold" style={{ color: '#1e3a5f' }}>302/2025</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t-2" style={{ borderColor: '#c9a227' }} />

                            {/* Title + date */}
                            <div className="flex items-center justify-between mt-6">
                                <h2 className="text-5xl font-serif font-bold tracking-widest" style={{ color: '#1e3a5f' }}>DIPLOMA</h2>
                                <p className="text-sm">Date of Issue: <span className="font-semibold">{certDetails.date || ''}</span></p>
                            </div>

                            {/* Body + side panel */}
                            <div className="flex gap-6 mt-6">
                                <div className="flex-1 space-y-3 text-[15px] leading-relaxed">
                                    <p>This is to certify that Mr./Ms. <span className="font-bold border-b-2 inline-block min-w-[400px]" style={{ borderColor: '#1e3a5f' }}>{certDetails.name}</span></p>
                                    <p>Son/Daughter of <span className="font-bold border-b-2 inline-block min-w-[400px]" style={{ borderColor: '#1e3a5f' }}>{certDetails.father_name || ''}</span></p>
                                    <p>has successfully completed the <span className="font-bold border-b-2 inline-block min-w-[350px]" style={{ borderColor: '#1e3a5f' }}>{certDetails.course}</span> course</p>
                                    <p>at <span className="font-semibold" style={{ color: '#B24E23' }}>Code and Class Educational Institute</span>.</p>
                                    <p>The programme was completed over a duration of <span className="font-bold border-b-2 inline-block min-w-[300px]" style={{ borderColor: '#1e3a5f' }}>{certDetails.duration || ''}</span></p>
                                    <p>The candidate has fulfilled all the academic requirements and has been awarded this Diploma carrying <span className="font-bold">9</span> credits.</p>
                                    <p className="italic" style={{ color: '#1e3a5f' }}>
                                        The student has demonstrated excellent performance, good conduct, and regular attendance
                                        throughout the training period. We wish the candidate every success in future academic and professional pursuits.
                                    </p>
                                </div>

                                {/* Side panel */}
                                <div className="w-[220px] flex flex-col gap-3">
                                    {/* BLANK passport-photo box — left empty on purpose so the printed photo can be pasted in */}
                                    <div
                                        className="w-full h-32 bg-white flex items-center justify-center"
                                        style={{ border: '1.5px solid #94a3b8' }}
                                    >
                                        <span className="text-[10px] text-slate-300">Passport Photo</span>
                                    </div>

                                    <div className="text-white text-center py-2" style={{ backgroundColor: '#1e3a5f' }}>
                                        <p className="text-xs font-semibold tracking-wide">CERTIFICATE NO.</p>
                                    </div>
                                    <p className="text-center font-bold" style={{ color: '#B24E23' }}>{certDetails.certificate_no}</p>
                                    <div className="p-2 text-xs" style={{ border: '1.5px solid #1e3a5f' }}>
                                        <p className="font-bold mb-1" style={{ color: '#1e3a5f' }}>VERIFY CERTIFICATE :</p>
                                        <p>visit :</p>
                                        <p className="font-semibold">www.codeandclass.com/verify</p>
                                        <p className="mt-1">Enter Certificate No. to verify the authenticity.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Accreditation strip */}
                            <div className="mt-6 border-t-2 pt-4" style={{ borderColor: '#c9a227' }}>
                                <p className="text-center font-bold text-sm tracking-wide" style={{ color: '#c9a227' }}>
                                    ISSUED UNDER THE OFFICIAL SEAL AND AUTHORITY OF<br />CODE AND CLASS EDUCATIONAL INSTITUTE
                                </p>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-3">
                                        <img src={msme} alt="MSME" className="h-10" />
                                        <img src={arpan} alt="ARPAN" className="h-10" />
                                        <img src={iso} alt="ISO" className="h-10" />
                                        <img src={accredited} alt="Accredited Educational Skills Partner" className="h-10" />
                                    </div>
                                    <div className="text-xs text-right leading-tight px-3 py-1" style={{ border: '1.5px solid #1e3a5f' }}>
                                        <p className="font-bold" style={{ color: '#1e3a5f' }}>TRAINER DETAILS</p>
                                        <p>Trainer ID: TB023247</p>
                                        <p>Assessor ID: AB175241</p>
                                    </div>
                                </div>
                            </div>

                            {/* Signatures */}
                            <div className="flex items-end justify-between mt-8 px-8">
                                <div className="text-center">
                                    <p className="font-serif italic text-lg" style={{ color: '#B24E23' }}>Faisal Bin Yahiya Rubaki</p>
                                    <p className="text-xs font-bold" style={{ color: '#1e3a5f' }}>ACADEMIC COORDINATOR</p>
                                </div>

                                <img src={seal} alt="Official Seal" className="w-20 h-20 object-contain" />

                                <div className="text-center">
                                    <p className="font-serif italic text-lg" style={{ color: '#B24E23' }}>Mr. Mohd Asif Khan</p>
                                    <p className="text-xs font-bold" style={{ color: '#1e3a5f' }}>DIRECTOR &amp; HEAD OF INSTITUTION</p>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-6 pt-3 border-t flex justify-between text-xs text-slate-600" style={{ borderColor: '#1e3a5f' }}>
                                <span className="flex items-center gap-1"><MailIcon /> codeandclass.com</span>
                                <span className="flex items-center gap-1"><MailIcon /> asifsir@codeandclass.com</span>
                                <span className="flex items-center gap-1"><PhoneIcon /> 9347230146, 7671844214</span>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Certificate;