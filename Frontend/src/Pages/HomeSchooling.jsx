import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
    FaYoutube,
    FaWhatsapp,
    FaArrowRight,
    FaLaptopHouse,
    FaChild,
    FaBookOpen,
    FaCertificate,
    FaClock,
    FaStar,
    FaCheckCircle,
    FaGraduationCap,
    FaPalette,
    FaCalculator,
    FaComments,
    FaPlayCircle,
    FaChevronDown,
} from "react-icons/fa";
import axios from "axios";


// const videos = [
//     {
//         title: "Alphabet & Phonics",
//         age: "3+ Years",
//         thumbnail:
//             "https://img.youtube.com/vi/HCU2Dh_M0Dk/maxresdefault.jpg",
//         youtube: "https://youtu.be/HCU2Dh_M0Dk",
//     },
//     {
//         title: "Numbers Shapes & Colours",
//         age: "3 - 4 Years",
//         thumbnail:
//             "https://img.youtube.com/vi/MyJCgW9sauA/maxresdefault.jpg",
//         youtube: "https://youtu.be/MyJCgW9sauA",
//     },
//     {
//         title: "Rhymes & Story Learning",
//         age: "4+ Years",
//         thumbnail:
//             "https://img.youtube.com/vi/1E0fQlLHzHA/maxresdefault.jpg",
//         youtube: "https://youtu.be/1E0fQlLHzHA",
//     },
// ];


const curriculum = [
    {
        icon: <FaBookOpen />,
        title: "English & Phonics",
        items: [
            "Alphabet recognition",
            "Letter sounds",
            "Early reading skills",
        ],
        color: "blue",
    },
    {
        icon: <FaCalculator />,
        title: "Math Foundations",
        items: [
            "Numbers",
            "Shapes",
            "Counting",
        ],
        color: "purple",
    },
    {
        icon: <FaPalette />,
        title: "Creative Learning",
        items: [
            "Drawing",
            "Craft activities",
            "Creative thinking",
        ],
        color: "orange",
    },
    {
        icon: <FaComments />,
        title: "Communication",
        items: [
            "Stories",
            "Rhymes",
            "Speaking confidence",
        ],
        color: "green",
    },
];

const API = `${import.meta.env.VITE_API_URL || "http://localhost:8080/api"}`


const faqs = [
    {
        q: "What age group is the program suitable for?",
        a: "Our Nursery Home Schooling Program is specially designed for children between 3 to 5 years old, focusing on early childhood development and school readiness.",
    },
    {
        q: "Are the classes live or recorded?",
        a: "We conduct interactive live online classes where children can engage with teachers, participate in activities, ask questions, and learn through fun sessions.",
    },
    {
        q: "How long is each online class?",
        a: "Each session is designed according to the attention span of young children and usually includes short, engaging activities like phonics, stories, songs, and creative tasks.",
    },
    {
        q: "Do children need any previous learning experience?",
        a: "No. Our program starts from the basics and helps children gradually develop language, maths, creativity, and communication skills.",
    },
    {
        q: "What subjects will my child learn?",
        a: "Children learn English phonics, alphabet recognition, numbers, counting, shapes, colours, storytelling, rhymes, creative activities, and communication skills.",
    },
    {
        q: "Will teachers give individual attention to children?",
        a: "Yes. Our teachers encourage every child to participate and provide guidance based on each child's learning pace and needs.",
    },
    {
        q: "Can parents stay with children during classes?",
        a: "Yes. Parents can support younger children during classes and understand the learning activities so they can continue practice at home.",
    },
    {
        q: "How can parents track their child's progress?",
        a: "Parents receive regular updates about participation, activities completed, and areas where the child is improving.",
    },
    {
        q: "What devices are required for online classes?",
        a: "A smartphone, tablet, or laptop with a stable internet connection is enough to attend classes comfortably.",
    },
    {
        q: "Is online learning effective for preschool children?",
        a: "Yes. Our classes combine interaction, storytelling, games, movement activities, and creative exercises to make online learning enjoyable and effective for young children.",
    },
];


const HomeSchooling = () => {

    const [videos, setVideos] = useState([]);
    const [openFaq, setOpenFaq] = useState(null);
    const [teachers, setTeachers] = useState([])
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await axios.get(`${API}/homeSchooling`);
                setVideos(res.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        const fetchSupporters = async () => {
            try {
                const response = await axios.get(`${API}/supporters`);
                setTeachers(response?.data?.data);
            } catch (error) {
                console.error("Failed to fetch supporters:", error);
            }
        };

        const fetchStudentVoices = async () => {
            try {
                const { data } = await axios.get(
                    `${API}/studentVoice/get-homeschooling-voices`
                );

                setTestimonials(data.voices || []);
            } catch (error) {
                console.log("Student voice error", error);
            }
        };

        fetchVideos();
        fetchSupporters();
        fetchStudentVoices();
    }, []);

    return (
        <div className="bg-slate-50 min-h-screen overflow-hidden">

            {/* HERO */}
            <section className="pt-28 px-5 lg:px-10">

                <div className=" max-w-7xl mx-auto rounded-[45px] overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 text-white shadow-2xl ">

                    <div className=" grid lg:grid-cols-2 gap-10 items-center p-8 md:p-14 ">

                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: .7 }}
                        >

                            <span className=" inline-flex bg-white/20 px-5 py-2 rounded-full font-semibold ">
                                🌱 Nursery Home Schooling
                            </span>

                            <h1 className="
text-5xl
md:text-6xl
font-black
leading-tight
mt-7
">

                                Give Your Child
                                <br />

                                <span className="text-yellow-300">
                                    The Best Start
                                </span>

                            </h1>



                            <p className="
mt-6
text-lg
leading-8
text-blue-100
">

                                Interactive online classes designed for
                                children aged 3–5 years.
                                Learn phonics, maths, stories and creativity
                                with caring teachers from home.

                            </p>



                            <div className="
flex flex-wrap gap-4 mt-8
">

                                <a
                                    className="
bg-green-500
text-white
px-8 py-4
rounded-full
font-bold
flex
items-center
gap-2
hover:scale-105
transition
shadow-lg
"
                                >
                                    🎓 Login & Fill Application Form
                                </a>


                                <a
                                    href="https://whatsapp.com/channel/0029VbBQoOTCHDyr0cD8Jr3j"
                                    target="_blank"
                                    className="
bg-yellow-400
text-slate-900
px-8 py-4
rounded-full
font-bold
flex
items-center
gap-2
hover:scale-105
transition
">

                                    Book Free Trial
                                    <FaArrowRight />

                                </a>



                                <a
                                    href="#videos"
                                    className="
border
border-white/40
px-8 py-4
rounded-full
font-bold
hover:bg-white
hover:text-blue-700
transition
">

                                    Watch Classes

                                </a>


                            </div>





                            <div className="
grid grid-cols-3
gap-4
mt-12
">


                                {[
                                    ["500+", "Happy Kids"],
                                    ["4.9★", "Parent Rating"],
                                    ["3-5", "Age Group"]
                                ].map((item, i) => (


                                    <div
                                        key={i}
                                        className="
bg-white/10
rounded-2xl
p-4
text-center
backdrop-blur
">


                                        <h3 className="
text-2xl
font-black
">
                                            {item[0]}
                                        </h3>


                                        <p className="
text-sm
text-blue-100
">
                                            {item[1]}
                                        </p>


                                    </div>


                                ))}


                            </div>


                        </motion.div>





                        <motion.div

                            initial={{ opacity: 0, scale: .9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: .7 }}

                            className="
relative
">


                            <div className="
bg-white/10
rounded-[40px]
p-6
backdrop-blur
">


                                <img

                                    src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1"

                                    alt="Child learning online at home"

                                    className="
rounded-[35px]
w-full
h-[450px]
object-cover
"

                                />


                            </div>





                            <div className="
absolute
top-10
right-5
bg-white
text-slate-900
rounded-2xl
shadow-xl
p-5
">


                                <p className="font-bold">
                                    👩‍🏫 Expert Teachers
                                </p>


                                <p className="text-sm text-slate-500">
                                    Caring educators
                                </p>
                            </div>

                            <div className=" absolute bottom-10 left-5 bg-white text-slate-900 rounded-2xl shadow-xl p-5 ">

                                <p className="font-bold">
                                    🎓 Live Classes
                                </p>

                                <p className="text-sm text-slate-500">
                                    Interactive learning
                                </p>

                            </div>

                        </motion.div>

                    </div>

                </div>

            </section>


            {/* TRUST FEATURES */}

            <section className="max-w-7xl mx-auto px-5 lg:px-10 py-24">

                <div className="text-center max-w-3xl mx-auto">

                    <div className="
    inline-flex
    items-center
    gap-2
    bg-blue-100
    text-blue-700
    px-5 py-2
    rounded-full
    font-semibold
    ">
                        <FaCertificate />
                        Trusted Learning Program
                    </div>


                    <h2 className="
    text-4xl md:text-5xl
    font-black
    text-slate-900
    mt-6
    ">
                        Why Parents Choose Us
                    </h2>


                    <p className="
    mt-5
    text-lg
    text-slate-600
    leading-8
    ">
                        A complete early learning experience designed to make
                        children confident, creative and ready for school.
                    </p>

                </div>




                <div className="
grid
sm:grid-cols-2
lg:grid-cols-4
gap-8
mt-14
">


                    {[
                        {
                            icon: <FaChild />,
                            title: "Child Friendly",
                            desc: "Fun activities designed specially for young minds."
                        },
                        {
                            icon: <FaLaptopHouse />,
                            title: "Learn Anywhere",
                            desc: "Online classes from the comfort of home."
                        },
                        {
                            icon: <FaBookOpen />,
                            title: "Complete Curriculum",
                            desc: "English, Maths, Stories, Rhymes and Creativity."
                        },
                        {
                            icon: <FaClock />,
                            title: "Flexible Learning",
                            desc: "Convenient learning with parent support."
                        },

                    ].map((item, index) => (

                        <div
                            key={index}
                            className="
        bg-white
        rounded-3xl
        p-8
        shadow-lg
        hover:-translate-y-3
        transition-all
        duration-300
        "
                        >

                            <div className="
            w-16 h-16
            rounded-2xl
            bg-blue-100
            text-blue-700
            flex
            items-center
            justify-center
            text-3xl
            ">
                                {item.icon}
                            </div>


                            <h3 className="
            text-xl
            font-bold
            mt-6
            ">
                                {item.title}
                            </h3>


                            <p className="
            mt-3
            text-slate-600
            leading-7
            ">
                                {item.desc}
                            </p>


                        </div>

                    ))}


                </div>


            </section>

            {/* HOW IT WORKS */}


            <section className="
py-24
max-w-7xl
mx-auto
px-5
lg:px-10
">


                <div className="text-center">


                    <h2 className="
text-4xl
md:text-5xl
font-black
">

                        How Your Child Learns

                    </h2>


                    <p className="
mt-5
text-slate-600
text-lg
">

                        Simple, joyful and effective learning journey

                    </p>


                </div>




                <div className="
grid
md:grid-cols-4
gap-8
mt-14
">


                    {[
                        ["1", "Join Live Class"],
                        ["2", "Fun Activities"],
                        ["3", "Practice Skills"],
                        ["4", "Build Confidence"]
                    ].map((x, i) => (


                        <div
                            key={i}
                            className="
bg-white
rounded-3xl
shadow-lg
p-8
text-center
"
                        >


                            <div className="
w-16
h-16
mx-auto
rounded-full
bg-blue-600
text-white
flex
items-center
justify-center
text-2xl
font-bold
">

                                {x[0]}

                            </div>


                            <h3 className="
mt-5
font-bold
text-xl
">

                                {x[1]}

                            </h3>


                        </div>


                    ))}


                </div>


            </section>



            {/* CURRICULUM */}


            <section id='curriculum' className="
bg-white
py-24
">


                <div className="
max-w-7xl
mx-auto
px-5
lg:px-10
">


                    <div className="text-center">

                        <h2 className="
        text-4xl md:text-5xl
        font-black
        ">
                            What Your Child Will Learn
                        </h2>


                        <p className="
        mt-5
        text-lg
        text-slate-600
        ">
                            A structured curriculum created for early childhood development.
                        </p>


                    </div>




                    <div className="
    grid
    md:grid-cols-2
    lg:grid-cols-4
    gap-8
    mt-14
    ">



                        {curriculum.map((item, index) => (


                            <div
                                key={index}
                                className="
        rounded-3xl
        bg-gradient-to-br
        from-blue-50
        to-white
        p-8
        shadow-md
        border
        border-slate-100
        hover:shadow-xl
        transition
        "
                            >


                                <div className="
            text-4xl
            text-blue-600
            ">
                                    {item.icon}
                                </div>



                                <h3 className="
            text-xl
            font-bold
            mt-5
            ">
                                    {item.title}
                                </h3>



                                <ul className="mt-5 space-y-3">


                                    {item.items.map((x, i) => (

                                        <li
                                            key={i}
                                            className="
                    flex
                    items-center
                    gap-2
                    text-slate-600
                    "
                                        >

                                            <FaCheckCircle
                                                className="text-green-500"
                                            />

                                            {x}

                                        </li>

                                    ))}


                                </ul>


                            </div>


                        ))}



                    </div>



                </div>


            </section>







            {/* LEARNING JOURNEY */}


            <section className="
max-w-6xl
mx-auto
px-5
lg:px-10
py-24
">



                <div className="text-center">


                    <h2 className="
    text-4xl md:text-5xl
    font-black
    ">
                        Your Child's Learning Journey
                    </h2>


                    <p className="
    mt-5
    text-slate-600
    text-lg
    ">
                        Step-by-step development from basics to confidence.
                    </p>


                </div>




                <div className="
grid
md:grid-cols-5
gap-6
mt-14
">


                    {[
                        "Alphabet",
                        "Phonics",
                        "Words",
                        "Reading",
                        "Confidence"
                    ].map((step, index) => (


                        <div
                            key={index}
                            className="
        relative
        bg-white
        rounded-3xl
        p-8
        shadow-lg
        text-center
        "
                        >


                            <div className="
            w-14
            h-14
            rounded-full
            bg-blue-700
            text-white
            mx-auto
            flex
            items-center
            justify-center
            text-xl
            font-bold
            ">
                                {index + 1}
                            </div>



                            <h3 className="
            mt-5
            font-bold
            ">
                                {step}
                            </h3>



                        </div>


                    ))}



                </div>


            </section>







            {/* VIDEO SECTION */}


            <section
                id="videos"
                className="
bg-slate-100
py-24
"
            >


                <div className="
max-w-7xl
mx-auto
px-5
lg:px-10
">



                    <div className="text-center">


                        <h2 className="
        text-4xl md:text-5xl
        font-black
        ">
                            Watch Sample Classes
                        </h2>


                        <p className="
        mt-5
        text-lg
        text-slate-600
        ">
                            Experience how children learn through fun and interactive sessions.
                        </p>


                    </div>

                    <div className="
    grid
    md:grid-cols-3
    gap-10
    mt-14
    ">


                        {videos.map((video, index) => (

                            <div
                                key={index}
                                className="
        bg-white
        rounded-3xl
        overflow-hidden
        shadow-xl
        hover:-translate-y-3
        transition
        "
                            >

                                <div className="relative">


                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="
                h-64
                w-full
                object-cover
                "
                                    />


                                    <div className="
                absolute
                inset-0
                flex
                items-center
                justify-center
                bg-black/30
                ">

                                        <FaPlayCircle
                                            className="
                    text-white
                    text-6xl
                    "
                                        />

                                    </div>


                                </div>





                                <div className="p-7">


                                    <h3 className="
text-xl
font-bold
">
                                        {video.title}
                                    </h3>



                                    <span className="
inline-block
mt-3
bg-blue-100
text-blue-700
px-4
py-1
rounded-full
text-sm
font-semibold
">
                                        {video.ageLimit}
                                    </span>




                                    <a
                                        href={video.youtube}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="
    mt-6
    bg-red-600
    text-white
    py-3
    rounded-xl
    flex
    items-center
    justify-center
    gap-2
    font-semibold
    hover:bg-red-700
    transition
    "
                                    >

                                        <FaYoutube />

                                        Watch Demo

                                    </a>




                                    <div className="
grid
grid-cols-2
gap-3
mt-3
">


                                        <a
                                            href="#curriculum"
                                            className="
        bg-blue-600
        text-white
        py-3
        rounded-xl
        flex
        items-center
        justify-center
        font-semibold
        hover:bg-blue-700
        transition
        "
                                        >

                                            Know More

                                        </a>



                                        <a
                                            href="https://whatsapp.com/channel/0029VbBQoOTCHDyr0cD8Jr3j"
                                            target="_blank"
                                            rel="noreferrer"
                                            className="
        bg-green-500
        text-white
        py-3
        rounded-xl
        flex
        items-center
        justify-center
        gap-2
        font-semibold
        hover:bg-green-600
        transition
        "
                                        >

                                            <FaWhatsapp />

                                            WhatsApp

                                        </a>


                                    </div>


                                </div>


                            </div>


                        ))}


                    </div>

                </div>
            </section>

            <section
                id="teachers"
                className="
bg-white
py-24
">

                <div className="
max-w-7xl
mx-auto
px-5
lg:px-10
">


                    <h2 className="
text-center
text-4xl
font-black
">

                        Meet Our Teachers

                    </h2>


                    <div className="grid md:grid-cols-3 gap-8 mt-12">

                        {
                            teachers.map((t, i) => (
                                <div
                                    key={t._id}
                                    className=" bg-white rounded-3xl p-8 shadow-lg text-center hover:-translate-y-2 transition ">
                                    <div className="text-5xl">
                                        <img src={t?.imgLink} alt={t?.name} />
                                    </div>

                                    <h3 className=" text-xl font-bold mt-4 ">
                                        {t?.name}
                                    </h3>

                                    <p className=" text-slate-500 mt-2 ">
                                        {t?.designation}
                                    </p>

                                </div>
                            ))
                        }

                    </div>


                </div>

            </section>

            {/* TESTIMONIALS */}

            <section className="
            max-w-7xl
            mx-auto
            px-5
            lg:px-10
            py-24
            ">


                <div className="text-center">

                    <h2 className="
                    text-4xl md:text-5xl
                    font-black
                    text-slate-900
                    ">
                        What Parents Say
                    </h2>


                    <p className=" mt-5 text-lg text-slate-600">
                        Thousands of parents trust our early learning program.
                    </p>
                </div>

                <div className="
                grid
                md:grid-cols-3
                gap-8
                mt-14
                ">


                    {testimonials?.map((item, index) => (

                        <div
                            key={index}
                            className="
                        bg-white
                        rounded-3xl
                        shadow-lg
                        p-8
                        hover:-translate-y-2
                        transition">

                            <div className="
                            flex
                            gap-1
                            text-yellow-400
                            text-xl
                            ">
                                {[1, 2, 3, 4, 5].map(i => (

                                    <FaStar key={i} />

                                ))}

                            </div>

                            <p className="
                            mt-6
                            text-slate-600
                            leading-8
                            ">
                                {item?.description}
                            </p>

                            <div className="mt-6">

                                <h3 className="
                                font-bold
                                text-lg
                                ">
                                    {item?.name}
                                </h3>

                            </div>


                        </div>


                    ))}


                </div>


            </section>


            <section className="max-w-6xl mx-auto px-5 py-10">

                <div className="
bg-yellow-400
rounded-3xl
p-8
flex
flex-col
md:flex-row
items-center
justify-between
gap-6
shadow-xl
">

                    <div>

                        <h2 className="
text-3xl
font-black
text-slate-900
">
                            Ready to Start Your Child's Learning Journey?
                        </h2>

                        <p className="
mt-3
text-slate-700
">
                            Login now and complete the application form to reserve your child's seat.
                        </p>

                    </div>


                    <a
                        href="#"
                        className="
bg-blue-700
text-white
px-8
py-4
rounded-full
font-bold
hover:bg-blue-800
transition
"
                    >
                        Login & Apply Now →
                    </a>


                </div>

            </section>

            {/* FAQ */}
            <section className="
            bg-white
            py-24
            ">


                <div className="
                max-w-4xl
                mx-auto
                px-5
                ">


                    <div className="text-center">


                        <h2 className="
                        text-4xl
                        md:text-5xl
                        font-black
                        ">
                            Frequently Asked Questions
                        </h2>


                    </div>




                    <div className="
                    mt-12
                    space-y-5
                    ">



                        {faqs.map((faq, index) => (


                            <div
                                key={index}
                                className="
                        border
                        border-slate-200
                        rounded-2xl
                        overflow-hidden
                        "
                            >


                                <button

                                    onClick={() => setOpenFaq(
                                        openFaq === index ? null : index
                                    )}

                                    className="
                            w-full
                            flex
                            justify-between
                            items-center
                            p-6
                            text-left
                            font-bold
                            text-lg
                            "

                                >


                                    {faq.q}


                                    <FaChevronDown
                                        className={`
                                transition
                                ${openFaq === index
                                                ? "rotate-180"
                                                : ""
                                            }
                                `}
                                    />


                                </button>




                                {openFaq === index && (

                                    <div className="
                                px-6
                                pb-6
                                text-slate-600
                                leading-7
                                ">

                                        {faq.a}

                                    </div>

                                )}


                            </div>


                        ))}



                    </div>


                </div>


            </section>

            {/* FINAL CTA */}
            <section className=" max-w-6xl mx-auto px-5 lg:px-10 py-24 ">

                <div className=" rounded-[40px] bg-gradient-to-r from-indigo-700 to-blue-700 text-white text-center p-10 md:p-16 shadow-2xl ">

                    <div className=" mx-auto w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-4xl ">
                        <FaGraduationCap />
                    </div>

                    <h2 className=" mt-8 text-4xl md:text-5xl font-black ">

                        Give Your Child
                        <br />
                        The Best Beginning

                    </h2>

                    <p className=" max-w-3xl mx-auto mt-6 text-lg text-blue-100 leading-8 ">

                        Join our Nursery Home Schooling Program and help
                        your child develop confidence, creativity and strong
                        learning foundations through joyful online classes.

                    </p>

                    <div className=" flex flex-wrap justify-center gap-5 mt-10 ">

                        <a
                            href="https://whatsapp.com/channel/0029VbBQoOTCHDyr0cD8Jr3j"
                            target="_blank"
                            rel="noreferrer"

                            className=" bg-green-500 hover:bg-green-600 px-8 py-4 rounded-full font-bold flex items-center gap-3 transition " >
                            <FaWhatsapp />
                            Enquire Now
                        </a>

                        <a
                            href="#videos"
                            className=" bg-white text-blue-700 px-8 py-4 rounded-full font-bold transition hover:scale-105 " >
                            Watch Demo
                        </a>

                    </div>

                </div>

            </section>

            {/* FLOATING WHATSAPP */}

            <a
                href="https://whatsapp.com/channel/0029VbBQoOTCHDyr0cD8Jr3j"
                target="_blank"
                rel="noreferrer"

                className=" fixed bottom-6 right-6 z-50 bg-green-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-2xl hover:scale-110 transition">

                <FaWhatsapp />

            </a>



        </div>
    );
};


export default HomeSchooling;