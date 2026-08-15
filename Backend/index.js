import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middlewares/errorMiddleware.js';
import lectureRoutes from './routes/lectureRoutes.js';
import spokenLectureRoutes from './routes/spokenLectureRoute.js';
import spokenEnglishLevelRoutes from './routes/spokenEnglishLevel.routes.js';
import meetingLinkRoutes from './routes/meetingLink.routes.js';
import feeRoutes from './routes/fee.routes.js';
import examRoutes from './routes/exam.routes.js';
import blogRoutes from './routes/blog.routes.js';
import courseRoutes from './routes/courseRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import notesRoute from './routes/notesRoute.js';
import galleryRoutes from './routes/galleryRoutes.js';
import ngoRoutes from './routes/ngo.routes.js';
import CourseApplication from './routes/courseApplication.route.js';
import tutionForm from './routes/tutionForm.route.js'
import tossApplication from './routes/tossApplication.route.js'
import idcard from './routes/idCard.route.js'
import paymentRoutes from './routes/paymentRoutes.js'
import enrollmentRoutes from './routes/enrollmentRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import successStoryRoutes from './routes/successStoryRoutes.js'
import studentVoiceRoutes from './routes/studentVoiceRoutes.js'
import supportersRoutes from './routes/supporter.routes.js'
import homeSchoolingRoutes from './routes/homeSchoolingRoutes.js'
import classTenthRoutes from './routes/classTenth.routes.js'
import intermediateRoutes from './routes/intermediate.route.js'
import videoRoutes from './routes/video.routes.js'
import purchaseRoutes from './routes/purchase.routes.js'
import progressRoutes from './routes/progress.routes.js'
import searchRoutes from './routes/search.routes.js'

const app = express();

// ALLOWED_ORIGINS in .env is a comma-separated list (e.g. the production
// domain(s) plus local dev ports). Previously this env var was defined but
// never actually read — CORS was hardcoded to localhost only, which silently
// blocked every credentialed request (logins, form submissions, payments,
// purchases) from the deployed site while working fine locally.
const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ||
    "http://localhost:5173,http://localhost:5174"
)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests without an Origin header
            // e.g. Postman, server-to-server requests
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error(`CORS blocked for origin: ${origin}`)
            );
        },

        credentials: true,

        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],
    })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/spoken-lectures', spokenLectureRoutes);
app.use('/api/spoken-english', spokenEnglishLevelRoutes);
app.use('/api/meeting-links', meetingLinkRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/notes', notesRoute);
app.use('/api/gallery', galleryRoutes);
app.use('/api/ngos', ngoRoutes);
app.use('/api/courseApplication', CourseApplication)
app.use('/api/tutionForm', tutionForm)
app.use('/api/tossApplication', tossApplication)
app.use('/api/idcard', idcard)
app.use('/api/payments', paymentRoutes)
app.use('/api/enrollments', enrollmentRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api/successStories', successStoryRoutes)
app.use('/api/studentVoice', studentVoiceRoutes)
app.use('/api/supporters', supportersRoutes)
app.use('/api/homeSchooling', homeSchoolingRoutes)
app.use('/api/classTenth', classTenthRoutes)
app.use('/api/intermediate', intermediateRoutes)
app.use('/api/video', videoRoutes)
app.use('/api/purchase', purchaseRoutes)
app.use('/api/progress', progressRoutes)
app.use('/api/search', searchRoutes)
app.get('/api/health', async (req, res) => {
    try {
        res.status(200).json({
            status: 'OK',
            uptime: process.uptime(),
            timestamp: new Date(),
            db: 'Connected',
        });
    } catch (error) {
        res.status(500).json({
            status: 'FAIL',
            error: error.message,
        });
    }
});

// Error Handling
app.use(errorHandler);

const port = process.env.PORT || 8000

// Connect DB and Start server
mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
}).catch((err) => {
    console.error(err);
});