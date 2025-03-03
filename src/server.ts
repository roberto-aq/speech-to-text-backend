import express from 'express';
import cors from 'cors';
import filesRouter from './routes/fileRouter';
import settingsRouter from './routes/settingsRouter';
import transcriptionsRouter from './routes/transcriptionRouter';

const app = express();

// Habilitar el body
app.use(express.json());
// Habilitar las cors
app.use(cors());

// Rutas
app.use('/api/files', filesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/transcriptions', transcriptionsRouter);

export default app;
