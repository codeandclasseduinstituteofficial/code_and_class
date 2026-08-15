import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Courses from './Pages/Courses';
import CourseDetailed from './Pages/CourseDetailed';
import CertificateVerification from './Pages/CertificateVerification';
import Contact from './Pages/Contact';
import Footer from './components/Footer';
import Progress from './components/LectureProgress';
import Dashboard from './Pages/admin/Dashboard';
import AddLectures from './Pages/admin/AddLectures';
import ManageSpokenEnglish from './Pages/admin/ManageSpokenEnglish';
import AdminFees from './Pages/admin/AdminFees';
import AdminMeetingLinks from './Pages/admin/AdminMeetingLinks';
import AdminExams from './Pages/admin/AdminExams';
import Exams from './Pages/Exams';
import AdminBlogs from './Pages/admin/AdminBlogs';
import Blogs from './Pages/Blogs';
import AddCourse from './Pages/admin/AddCourse';
import AddCertificate from './Pages/admin/AddCertificate';
import AddUsers from './Pages/admin/AddUsers';
import EditCertificate from './Pages/admin/EditCertificate';
import EditCourse from './Pages/admin/EditCourse';
import EditLecture from './Pages/admin/EditLecture';
import EditUser from './Pages/admin/EditUser';
import Login from './Pages/Login';
import PrivateRoute from './components/PrivateRoute';
import LectureProgress from './components/LectureProgress';
import SpokenEnglish from './Pages/SpokenEnglish';
import Logout from './components/Logout';
import Home from './Pages/Home';
import Notes from './Pages/Notes';
import AboutInstructor from './Pages/AboutInstructor';
import EditNotes from './Pages/admin/EditNotes';
import AddNotes from './Pages/admin/AddNotes';
import ScrollToTop from './components/ScrollToTop';
import Gallery from './Pages/Gallery';
import AddEditGallery from './Pages/admin/AddEditGallery';
import PartnerNGO from './Pages/PartnerNGO';
import NgoDetails from './Pages/admin/NgoDetails';
import Certificate from './Pages/Certificate';
import UsersDashboard from './Pages/users/usersDashboard';
import IdCard from './Pages/admin/IdCard';
import Quizzes from './Pages/Quizzes';
import QuizAttempt from './Pages/QuizAttempt';
import AddQuiz from './Pages/admin/AddQuiz';
import Orders from './Pages/admin/Orders';
import CourseApplication from './Pages/users/CourseApplication';
import TuitionApplication from './Pages/users/TuitionApplication';
import TossApplication from './Pages/users/TossApplication';
import ApplicationPayment from './Pages/users/ApplicationPayment';
import Applications from './Pages/admin/Applications';
import AddStudentVoice from './Pages/users/AddStudentVoice';
import AdminSuccessStories from './Pages/admin/AdminSuccessStories';
import AdminStudentVoice from './Pages/admin/AdminStudentVoice';
import ExploreOnlineCourses from './Pages/ExploreOnlineCourses';
import OnlineCourseDetails from './Pages/OnlineCourseDetails';
import Supporter from './Pages/admin/Supporter';
import { Toaster } from 'react-hot-toast';
import HomeSchooling from './Pages/HomeSchooling';
import HomeSchoolingAdmin from './Pages/admin/HomeSchoolingAdmin';
import ClassTenth from './Pages/ClassTenth';
import Intermediate from './Pages/Intermediate';
import ManageIntermediate from './Pages/admin/ManageIntermediate';
import ManageClassTen from './Pages/admin/ManageClassTen';
import TopicVideo from './Pages/TopicVideo';
import BuyVideo from './Pages/BuyVideo';
import AdminAddLecutres from './Pages/admin/lectures/AdminAddLecutres'

const App = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Toaster />
      <Navbar />

      <div>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/courses" element={<Courses />} />

          <Route path="/online-courses" element={<ExploreOnlineCourses />} />

          <Route path="/courses/:courseId" element={<CourseDetailed />} />

          <Route path="/online-courses/:courseId" element={<OnlineCourseDetails />} />

          <Route path="/certificate-verification" element={<CertificateVerification />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/gallery" element={<Gallery />} />

          <Route path="/quizzes" element={<Quizzes />} />

          <Route path="/quizzes/:quizId" element={<QuizAttempt />} />

          <Route

            path="/topic-video/:id"

            element={<TopicVideo />}

          />

          <Route
            path="/topic-video/:id"
            element={<TopicVideo />}
          />

          <Route
            path="/buy-video/:id"
            element={
              <PrivateRoute>
                <BuyVideo />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/add-quiz"
            element={
              <PrivateRoute roles={['admin']}>
                <AddQuiz />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/orders"
            element={
              <PrivateRoute roles={['admin']}>
                <Orders />
              </PrivateRoute>
            }
          />

          {/* <Route path="/classes/:classId" element={<LectureProgress />} /> */}

          <Route path="/classes/Home-Schooling" element={<HomeSchooling />} />

          <Route path="/classes/Class-10" element={<ClassTenth />} />

          <Route path="/classes/Intermediate" element={<Intermediate />} />

          <Route path="/spoken-english" element={<SpokenEnglish />} />

          <Route path="/notes" element={<Notes />} />

          <Route path="/about" element={<AboutInstructor />} />

          <Route path="/ngos" element={<PartnerNGO />} />

          <Route path="/login" element={<Login />} />

          <Route path="/logout" element={<Logout />} />

          <Route path="/certificate" element={<Certificate />} />

          <Route
            path="/user-dashboard"
            element={
              <PrivateRoute roles={['user']}>
                <UsersDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/user-course-application"
            element={
              <PrivateRoute roles={['user']}>
                <CourseApplication />
              </PrivateRoute>
            }
          />

          <Route
            path="/user-tuition-application"
            element={
              <PrivateRoute roles={['user']}>
                <TuitionApplication />
              </PrivateRoute>
            }
          />

          <Route
            path="/toss-application"
            element={
              <PrivateRoute roles={['user']}>
                <TossApplication />
              </PrivateRoute>
            }
          />

          <Route
            path="/add-student-voice"
            element={
              <PrivateRoute roles={['user']}>
                <AddStudentVoice />
              </PrivateRoute>
            }
          />

          <Route
            path="/application-payment/:type/:id"
            element={
              <PrivateRoute roles={['user']}>
                <ApplicationPayment />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/applications"
            element={
              <PrivateRoute roles={['admin']}>
                <Applications />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute roles={['admin']}>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/add-class-lecture"
            element={
              <PrivateRoute roles={['admin']}>
                <AddLectures />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/manage-spoken-english"
            element={
              <PrivateRoute roles={['admin']}>
                <ManageSpokenEnglish />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/fees"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminFees />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/meeting-links"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminMeetingLinks />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/exams"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminExams />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/blogs"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminBlogs />
              </PrivateRoute>
            }
          />

          <Route path="/exams" element={<Exams />} />
          <Route path="/blogs" element={<Blogs />} />

          <Route
            path="/dashboard/add-course"
            element={
              <PrivateRoute roles={['admin']}>
                <AddCourse />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/add-certificate"
            element={
              <PrivateRoute roles={['admin']}>
                <AddCertificate />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/add-users"
            element={
              <PrivateRoute roles={['admin']}>
                <AddUsers />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/edit-certificate"
            element={
              <PrivateRoute roles={['admin']}>
                <EditCertificate />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/edit-course"
            element={
              <PrivateRoute roles={['admin']}>
                <EditCourse />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/edit-gallery"
            element={
              <PrivateRoute roles={['admin']}>
                <AddEditGallery />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/edit-lecture"
            element={
              <PrivateRoute roles={['admin']}>
                <EditLecture />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/edit-users"
            element={
              <PrivateRoute roles={['admin']}>
                <EditUser />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/add-notes"
            element={
              <PrivateRoute roles={['admin']}>
                <AddNotes />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/edit-notes"
            element={
              <PrivateRoute roles={['admin']}>
                <EditNotes />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/ngo-details"
            element={
              <PrivateRoute roles={['admin']}>
                <NgoDetails />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/certificate/:id"
            element={
              <PrivateRoute roles={['user', 'admin']}>
                <Certificate />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/idcard/:id"
            element={
              <PrivateRoute roles={['admin']}>
                <IdCard />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/admin-student-voice"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminStudentVoice />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/success-stories"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminSuccessStories />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/admin-supporters"
            element={
              <PrivateRoute roles={['admin']}>
                <Supporter />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/admin-homeSchooling"
            element={
              <PrivateRoute roles={['admin']}>
                <HomeSchoolingAdmin />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/manage-class-ten"
            element={
              <PrivateRoute roles={['admin']}>
                <ManageClassTen />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard/manage-intermediate"
            element={
              <PrivateRoute roles={['admin']}>
                <ManageIntermediate />
              </PrivateRoute>
            }
          />

          <Route
            path="dashboard/add-class"
            element={
              <PrivateRoute roles={['admin']}>
                <AdminAddLecutres />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;