import express from 'express';
import cors from 'cors';
import router from './router';

const app = express();

// Habilitar el body
app.use(express.json());
// Habilitar las cors
app.use(cors());

app.use('/api', router);

export default app;
