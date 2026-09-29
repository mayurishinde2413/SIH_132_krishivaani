import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import cropRoutes             from './routes/cropRoutes';
import marketRoutes           from './routes/marketRoutes';
import marketPriceRoutes      from './routes/marketPriceRoutes';
import fpoRoutes              from './routes/fpoRoutes';
import buyerRoutes            from './routes/buyerRoutes';
import buyerRequirementRoutes from './routes/buyerRequirementRoutes';
import authRoutes             from './routes/authRoutes';
import netRealisationRoutes   from './routes/netRealisationRoutes';
import fpoAggregationRoutes   from './routes/fpoAggregationRoutes';
import sellWaitRoutes         from './routes/sellWaitRoutes';
import buyerMatchingRoutes    from './routes/buyerMatchingRoutes';
import rescueRoutes            from './routes/rescueRoutes';

import { errorHandler } from './middleware/errorHandler';
import { notFound }     from './middleware/notFound';

dotenv.config(); // loads backend/.env

const app  = express();
const port = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ──────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'KrishiVaani backend' });
});

app.use('/api/auth',               authRoutes);
app.use('/api/net-realisation',    netRealisationRoutes);
app.use('/api/fpo',                fpoAggregationRoutes);
app.use('/api/sell-wait',          sellWaitRoutes);
app.use('/api',                    buyerMatchingRoutes);
app.use('/api/rescue',             rescueRoutes);
app.use('/api/crops',              cropRoutes);
app.use('/api/markets',            marketRoutes);
app.use('/api/market-prices',      marketPriceRoutes);
app.use('/api/fpos',               fpoRoutes);
app.use('/api/buyers',             buyerRoutes);
app.use('/api/buyer-requirements', buyerRequirementRoutes);

// ─── Error Handling ──────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`🚀 KrishiVaani backend running on http://localhost:${port}`);
});
