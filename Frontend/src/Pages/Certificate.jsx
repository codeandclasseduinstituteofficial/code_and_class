import React, { useEffect, useRef, useState } from 'react';
import domtoimage from 'dom-to-image';
import header from '../assets/Header.jpeg';
import footer from '../assets/Footer.jpeg';
import logo from '../assets/Logo.jpeg';
import img1 from '../assets/img1.jpeg'
import img2 from '../assets/img2.png'
import img3 from '../assets/img3.png'
import img4 from '../assets/img4.png'
import img5 from '../assets/img5.jpeg'
import qr1 from '../assets/qr1.jpeg'
import qr2 from '../assets/qr2.jpeg'
import { useParams } from 'react-router-dom';

const Certificate = ({ name, relation, course, period, examDate, division = 'A', dob }) => {

    const { id } = useParams()

    const [certDetails, setCertDetails] = useState(null);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [responseStatus, setResponseStatus] = useState(null)

    const API_BASE = `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}/certificates`

    const handleSearchCertificate = async () => {
        try {
            const response = await fetch(`${API_BASE}/download/${id.toUpperCase()}`, {
                method: 'GET',
            });

            if (response.ok) {
                setResponseStatus(200)
            }
            if(response.status === 404){
                setError('Certificate not found. Please check the number.');
            }

            if(response.status === 403) setError('Certificate not Verified Yet!.');

            const certificateData = await response.json();

            setHasSearched(true);

            if (certificateData && certificateData.name) {
                setCertDetails(certificateData);
                setError('');
            } else {
                setCertDetails(null);
            }
        } catch (err) {
            console.error(err);
            setCertDetails(null);
            setError('Error fetching certificate. Please try again.');
        }
    };

    useEffect(() => {
        handleSearchCertificate()
    }, [])

    const certificateRef = useRef();

    const downloadCertificate = () => {
        domtoimage.toPng(certificateRef.current)
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = 'certificate.png';
                link.href = dataUrl;
                link.click();
            });
    };

    return (
        <>
            {responseStatus ? (
                <div className="w-full h-screen mb-6 top-32 relative max-w-5xl mx-auto ">
                    <div ref={certificateRef} className="bg-white border border-gray-300 shadow-2xl rounded-lg overflow-x-hidden">
                        <img src={header} alt="Header" className="w-full" />

                        <div className="relative bg-white" >

                            <div className='absolute w-[100%] h-[100%] opacity-[0.3] z-0' style={{ backgroundImage: `url(${logo})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '35% auto', filter: 'brightness(140%)' }}></div>

                            <div className='relative z-10 p-8 text-lg space-y-4 '>
                                <div className="flex justify-between">
                                    <span>S.No: <span className="inline-block border-b-2 border-orange-700 min-w-[100px] pl-4 font-serif font-bold text-2xl">{certDetails?.certificate_no || ' '}</span></span>
                                    <span>Date: <span className="inline-block border-b-2 border-orange-700 min-w-[100px] pl-1 font-serif font-bold text-lg">{certDetails?.date || ' '}</span></span>
                                </div>
                                <p>
                                    This is to certify that: &nbsp;
                                    <span className="inline-block border-b-2 border-orange-700 min-w-[760px] pl-20 font-serif font-bold text-2xl">{certDetails?.name || ' '}</span>
                                </p>
                                <p>
                                    S/o, D/o, W/o: &nbsp;
                                    <span className="inline-block border-b-2 border-orange-700 min-w-[820px] pl-20 font-serif font-bold text-xl">{certDetails?.father_name || ' '}</span>
                                </p>
                                <p>
                                    has Successfully completed the course &nbsp;
                                    <span className="inline-block border-b-2 border-orange-700 min-w-[615px] pl-20 font-serif font-bold text-xl">{certDetails?.course || ' '}</span>
                                </p>
                                <p>
                                    at this institution during the period &nbsp;
                                    <span className="inline-block border-b-2 border-orange-700 min-w-[655px] pl-20 font-serif font-bold text-xl">{certDetails?.duration || ' '}</span>
                                </p>
                                <p>
                                    He/She has passed the examination on &nbsp;
                                    <span className="inline-block border-b-2 border-orange-700 min-w-[620px] pl-20 font-serif font-bold text-lg">{certDetails?.date || ' '}</span>
                                </p>
                                <p>
                                    In <span className="font-bold underline">{division}</span> Division. Date of birth as recorded in the government/school certificate: &nbsp;
                                    <span className="inline-block border-b-2 border-[#B24E23] min-w-[325px] pl-20 font-serif font-bold text-lg">{certDetails?.dob || ' '}</span>
                                </p>
                            </div>
                        </div>
                        <div className='bg-white flex justify-center items-center flex-col'>
                            <hr className='text-[#B24E23] border-b-2 w-[960px]' />
                            <div className='flex flex-col'>
                                <div className='pl-8'>
                                    <p className='text-sm text-left text-blue-900 font-bold'>GIVEN UNDER THE SEAL OF INSTITUTE</p>
                                </div>
                                <div className='flex justify-between gap-4 px-8'>
                                    <div className='flex gap-4'>
                                        <img className='w-[14%]' src={img4} alt="" />
                                        <img className='w-[14%]' src={img2} alt="" />
                                        <img className='w-[14%]' src={img3} alt="" />
                                        <img className='w-[14%]' src={img1} alt="" />
                                        <img className='w-[14%]' src={img5} alt="" />

                                    </div>
                                    <div className='flex justify-end pr-4 gap-4'>
                                        <img className='w-[20%]' src={qr1} alt="" />
                                        <img className='w-[20%]' src={qr2} alt="" />
                                    </div>
                                </div>
                            </div>
                            <hr className='text-[#B24E23] border-b-2 w-[960px]' />
                        </div>
                        <div className='flex items-end h-[8vh] w-full justify-end pr-32 gap-24'>
                            <p className='text-blue-900 text-[12px] font-bold'>
                                Faisal Bin Yahiya Rubaki
                                <span className='text-black text-center block'>CO-ORDINATOR</span>
                            </p>

                            <p className='text-blue-900 text-[12px] font-bold'>
                                Mr. Mohd Asif Khan
                                <span className='text-black text-center block'>DIRECTOR</span>
                            </p>
                        </div>

                        <img src={footer} alt="Footer" className="w-full bg-white" />
                    </div>

                    <div className="text-center mt-4">
                        <button
                            onClick={downloadCertificate}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700"
                        >
                            Download Certificate
                        </button>
                    </div>
                </div>) : (

                <div className="w-full h-screen mb-6 top-24 relative max-w-5xl mx-auto flex justify-center items-center ">
                    <p className='text-red-500 font-extrabold text-3xl'>{error}</p>
                </div>
            )
            }
        </>
    );
};

export default Certificate;