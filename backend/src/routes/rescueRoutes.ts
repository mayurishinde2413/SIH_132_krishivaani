import { Router } from 'express';
import {
  createRescueCase,
  getRescueOptions,
  getRescueBuyers,
  getRescueMarkets,
  getRescueStorage,
  getRescueCases,
  updateCaseStatus,
} from '../controllers/rescueController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

// ─── Direct Module 06 Rescue Endpoints ───────────────────────────────────────
// POST /api/rescue/create — Create/register an emergency rescue case
router.post('/create', createRescueCase);
router.post('/cases', createRescueCase); // alias for backwards compatibility

// GET /api/rescue/options — Available dynamic rescue options by problem type
router.get('/options', getRescueOptions);

// GET /api/rescue/buyers — Alternative verified emergency rescue buyers
router.get('/buyers', getRescueBuyers);

// GET /api/rescue/markets — Nearby open mandi yards & live auction status
router.get('/markets', getRescueMarkets);

// GET /api/rescue/storage — Temporary cold storage and holding facilities
router.get('/storage', getRescueStorage);

// ─── Case Management ─────────────────────────────────────────────────────────
// GET /api/rescue/cases — List registered rescue cases
router.get('/cases', getRescueCases);

// PATCH /api/rescue/cases/:id/status — Update case progression status
router.patch('/cases/:id/status', updateCaseStatus);

export default router;
