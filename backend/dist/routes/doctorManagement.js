import { Router } from 'express';
import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();
const router = Router();
// --- DOCTORS CRUD ---
router.get('/', async (req, res) => {
    try {
        const doctors = await prisma.doctor.findMany({
            orderBy: { createdAt: 'desc' },
        });
        res.json(doctors);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
});
router.post('/', async (req, res) => {
    try {
        const { name, specialization, qualification, phone, email, bio, imageUrls, active } = req.body;
        const newDoctor = await prisma.doctor.create({
            data: { name, specialization, qualification, phone, email, bio, imageUrls, active },
        });
        res.status(201).json(newDoctor);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create doctor' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);
        const { name, specialization, qualification, phone, email, bio, imageUrls, active } = req.body;
        const updated = await prisma.doctor.update({
            where: { id },
            data: { name, specialization, qualification, phone, email, bio, imageUrls, active },
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update doctor' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const id = String(req.params.id);
        await prisma.doctor.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete doctor' });
    }
});
// --- PATIENT MESSAGES ---
router.get('/messages', async (req, res) => {
    try {
        const messages = await prisma.patientMessage.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(messages);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch patient messages' });
    }
});
router.delete('/messages/:id', async (req, res) => {
    try {
        const id = String(req.params.id);
        await prisma.patientMessage.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
});
// --- DOCTOR RATINGS ---
router.get('/ratings', async (req, res) => {
    try {
        const ratings = await prisma.doctorRating.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(ratings);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch ratings' });
    }
});
// --- APPOINTMENTS ---
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await prisma.appointmentRequest.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(appointments);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});
router.patch('/appointments/:id/status', async (req, res) => {
    try {
        const id = String(req.params.id);
        const { status } = req.body; // 'Pending' | 'Confirmed' | 'Cancelled'
        const updated = await prisma.appointmentRequest.update({
            where: { id },
            data: { status },
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update appointment status' });
    }
});
export default router;
