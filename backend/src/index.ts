import express from 'express';
import cors from 'cors';
import doctorManagementRouter from './routes/doctorManagement.js';

const app = express();
app.use(cors());
app.use(express.json());

// Mount API routes
app.use('/api/admin/doctors', doctorManagementRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});