import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
    FaBookOpen,
    FaClipboardCheck,
    FaGraduationCap,
    FaChartLine,
    FaFileAlt,
    FaArrowRight,
    FaVideo,
    FaSchool,
    FaUniversity,
} from "react-icons/fa";
import { AuthContext } from "../../context/AuthProvider";
import instance from "../../utils/axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const dashboardLinks = [
    { title: "Class 10", link: "/classes/Class-10", icon: FaSchool },
    { title: "Intermediate", link: "/classes/Intermediate", icon: FaUniversity },
    { title: "Course Application", link: "/user-course-application", icon: FaGraduationCap },
    { title: "Tuition Application", link: "/user-tuition-application", icon: FaBookOpen },
    { title: "TOSS Application", link: "/toss-application", icon: FaFileAlt },
    { title: "Add Student Voice", link: "/add-student-voice", icon: FaFileAlt },
];

const UsersDashboard = () => {
    const { user, accessToken } = useContext(AuthContext);

    const [enrollments, setEnrollments] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [meetingLinks, setMeetingLinks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!accessToken) return;
        const fetchData = async () => {
            try {
                const [enrollmentsRes, attemptsRes] = await Promise.all([
                    instance.get('/enrollments/my', { headers: { Authorization: `Bearer ${accessToken}` } }),
                    instance.get('/quizzes/attempts/my', { headers: { Authorization: `Bearer ${accessToken}` } }),
                ]);
                setEnrollments(enrollmentsRes.data);
                setAttempts(attemptsRes.data);
            } catch (err) {
                console.error('Failed to load dashboard data', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [accessToken]);

    useEffect(() => {
        if (!accessToken) return;

        // Upcoming online classes sent to this student
        fetch(`${API_BASE}/meeting-links/my`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
            .then((res) => res.json())
            .then((data) => setMeetingLinks(data.data || []))
            .catch(() => setMeetingLinks([]));

        // Fees-due toast
        fetch(`${API_BASE}/fees/my`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        })
            .then((res) => res.json())
            .then((data) => {
                const fees = data.data || [];
                const totalDue = fees.reduce(
                    (sum, f) => sum + Math.max((f.totalFee || 0) - (f.amountPaid || 0), 0),
                    0
                );
                if (totalDue > 0) {
                    toast.error(`Your fees are due: ₹${totalDue}`, { duration: 6000 });
                }
            })
            .catch(() => {});
    }, [accessToken]);

    if (!user) return null;

    const initials = user.name
        ?.split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const avgScore = attempts.length
        ? Math.round(attempts.reduce((sum, a) => sum + (a.percentage || 0), 0) / attempts.length)
        : null;

    const stats = [
        { label: 'Enrolled Courses', value: enrollments.length, icon: FaBookOpen, tint: 'brand' },
        { label: 'Quizzes Attempted', value: attempts.length, icon: FaClipboardCheck, tint: 'accent' },
        { label: 'Average Score', value: avgScore !== null ? `${avgScore}%` : '—', icon: FaChartLine, tint: 'green' },
    ];

    const tintClasses = {
        brand: 'bg-brand-100 text-brand-600',
        accent: 'bg-amber-100 text-amber-600',
        green: 'bg-green-100 text-green-600',
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 px-4 md:px-10 lg:px-20 py-10 relative top-16">
            <div className="max-w-6xl mx-auto">
                {/* Profile header */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-md">
                            {initials || 'U'}
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
                                Welcome back, {user.name?.split(' ')[0]}
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">
                                Here's a snapshot of your learning progress.
                            </p>
                        </div>
                    </div>
                    <Link to="/courses" className="btn-primary shrink-0">
                        Browse Courses <FaArrowRight className="text-xs" />
                    </Link>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                    {stats.map(({ label, value, icon: Icon, tint }) => (
                        <div key={label} className="card-surface p-6 flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tintClasses[tint]}`}>
                                <Icon className="text-lg" />
                            </div>
                            <div>
                                {loading ? (
                                    <div className="h-7 w-12 bg-slate-100 rounded animate-pulse" />
                                ) : (
                                    <div className="text-2xl font-extrabold text-slate-900">{value}</div>
                                )}
                                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick applications */}
                <div className="mb-12">
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Applications</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {dashboardLinks.map(({ title, link, icon: Icon }) => (
                            <Link
                                key={title}
                                to={link}
                                aria-label={title}
                                className="group card-surface p-6 hover:border-brand-300 hover:shadow-md transition-all flex items-center gap-4 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <div className="w-11 h-11 rounded-xl bg-brand-100 flex items-center justify-center shrink-0 group-hover:bg-brand-600 transition-colors">
                                    <Icon className="text-brand-600 group-hover:text-white transition-colors" />
                                </div>
                                <span className="font-semibold text-slate-700">{title}</span>
                                <FaArrowRight className="ml-auto text-xs text-slate-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* My Courses */}
                <Section title="My Courses" icon={<FaBookOpen />} count={enrollments.length}>
                    {loading ? (
                        <SkeletonGrid />
                    ) : enrollments.length ? (
                        enrollments.map((e) => (
                            <Link key={e._id} to={`/courses/${e.course?._id}`}>
                                <CourseItemCard
                                    title={e.course?.title}
                                    subtitle={e.source === 'purchase' ? 'Purchased' : 'Granted'}
                                    thumbnail={e.course?.thumbnail}
                                />
                            </Link>
                        ))
                    ) : (
                        <EmptyState
                            text="No courses yet — browse the catalog to get started."
                            actionLabel="Explore Courses"
                            actionLink="/courses"
                        />
                    )}
                </Section>

                {/* Upcoming Online Classes */}
                {meetingLinks.length > 0 && (
                    <Section title="Upcoming Classes" icon={<FaVideo />} count={meetingLinks.length}>
                        {meetingLinks.map((m) => (
                            <div key={m._id} className="card-surface p-4 hover:border-brand-300 transition-all">
                                <p className="font-semibold text-slate-800 line-clamp-1">{m.title}</p>
                                <p className="text-xs text-slate-500 mt-1">{m.course?.title}</p>
                                <p className="text-xs text-slate-500 mt-1">
                                    {new Date(m.scheduledAt).toLocaleString()}
                                </p>
                                <a
                                    href={m.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-brand-600 hover:underline"
                                >
                                    Join Class <FaArrowRight className="text-xs" />
                                </a>
                            </div>
                        ))}
                    </Section>
                )}

                {/* Quiz History */}
                <Section title="Quiz Attempts" icon={<FaClipboardCheck />} count={attempts.length}>
                    {loading ? (
                        <SkeletonGrid />
                    ) : attempts.length ? (
                        attempts.map((a) => (
                            <ItemCard
                                key={a._id}
                                name={a.quiz?.title}
                                subtitle={`${a.percentage}% (${a.score}/${a.totalQuestions})`}
                                badgeColor={a.percentage >= 70 ? 'green' : a.percentage >= 40 ? 'amber' : 'red'}
                            />
                        ))
                    ) : (
                        <EmptyState
                            text="No quiz attempts yet."
                            actionLabel="Try a Quiz"
                            actionLink="/quizzes"
                        />
                    )}
                </Section>
            </div>
        </div>
    );
};

export default UsersDashboard;

/* Reusable Components */

const Section = ({ title, icon, count, children }) => (
    <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-brand-600">{icon}</span> {title}
            </h2>
            {typeof count === 'number' && count > 0 && (
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">
                    {count}
                </span>
            )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {children}
        </div>
    </div>
);

const CourseItemCard = ({ title, subtitle, thumbnail }) => (
    <div className="card-surface overflow-hidden hover:border-brand-300 hover:shadow-md transition-all h-full flex flex-col">
        {thumbnail && (
            <div className="h-28 w-full overflow-hidden">
                <img src={thumbnail} alt={title} className="w-full h-full object-cover" />
            </div>
        )}
        <div className="p-4">
            <p className="font-semibold text-slate-800 line-clamp-1">{title}</p>
            {subtitle && (
                <span className="inline-block mt-1.5 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-full px-2 py-0.5">
                    {subtitle}
                </span>
            )}
        </div>
    </div>
);

const ItemCard = ({ name, subtitle, badgeColor = 'brand' }) => {
    const colorClasses = {
        green: 'text-green-700 bg-green-50 border-green-200',
        amber: 'text-amber-700 bg-amber-50 border-amber-200',
        red: 'text-red-700 bg-red-50 border-red-200',
        brand: 'text-brand-700 bg-brand-50 border-brand-200',
    };
    return (
        <div className="card-surface p-4 hover:border-brand-300 transition-all">
            <p className="font-semibold text-slate-800 line-clamp-1">{name}</p>
            {subtitle && (
                <span className={`inline-block mt-1.5 text-xs font-semibold rounded-full px-2 py-0.5 border ${colorClasses[badgeColor]}`}>
                    {subtitle}
                </span>
            )}
        </div>
    );
};

const SkeletonGrid = () => (
    <>
        {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card-surface p-4 animate-pulse">
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-slate-100 rounded w-1/3" />
            </div>
        ))}
    </>
);

const EmptyState = ({ text, actionLabel, actionLink }) => (
    <div className="col-span-full text-center py-10 border border-dashed border-slate-200 rounded-xl">
        <p className="text-slate-400 italic mb-3">{text}</p>
        {actionLabel && actionLink && (
            <Link to={actionLink} className="text-sm font-semibold text-brand-600 hover:underline inline-flex items-center gap-1">
                {actionLabel} <FaArrowRight className="text-xs" />
            </Link>
        )}
    </div>
);