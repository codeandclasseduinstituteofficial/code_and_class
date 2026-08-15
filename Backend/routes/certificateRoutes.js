import express from 'express';
import {
    createCertificate,
    getCertificates,
    updateCertificate,
    deleteCertificate,
    getCertificateByNumber,
    getCertificateById
} from '../controllers/certificate.controller.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, admin, createCertificate)
    .get(protect, admin, getCertificates);

router.route('/:id')
    .put(protect, admin, updateCertificate)
    .delete(protect, admin, deleteCertificate);

router.get('/:certificate_no', getCertificateByNumber);
router.get('/download/:certificate_no', getCertificateById);


export default router;