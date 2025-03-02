import express from 'express';
import cors from 'cors';
import filesRouter from './routes/fileRouter';
import settingsRouter from './routes/settingsRouter';

const app = express();

// Habilitar el body
app.use(express.json());
// Habilitar las cors
app.use(cors());

// Rutas
app.use('/api/files', filesRouter);
app.use('/api/settings', settingsRouter)


export default app;
