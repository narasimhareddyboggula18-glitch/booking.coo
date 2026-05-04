require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');

const authRoutes    = require('../server/routes/authRoutes');
const sportRoutes   = require('../server/routes/sportRoutes');
const bookingRoutes = require('../server/routes/bookingRoutes');
const eventRoutes   = require('../server/routes/eventRoutes');
const adminRoutes   = require('../server/routes/adminRoutes');

const app = express();

/* ── Middleware ─────────────────────────────────── */
app.use(helmet());

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  /\.vercel\.app$/,
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const ok = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    cb(ok ? null : new Error('CORS blocked'), ok);
  },
  credentials: true,
}));

app.use(express.json());
app.use(morgan('dev'));

/* ── Routes ─────────────────────────────────────── */
app.use('/api/auth',     authRoutes);
app.use('/api/sports',   sportRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/events',   eventRoutes);
app.use('/api/admin',    adminRoutes);
app.get('/api/health',   (_, res) => res.json({ status: 'ok', time: new Date() }));

/* ── MongoDB (cached for serverless) ────────────── */
let mongoConn = null;

async function connectDB() {
  if (mongoConn && mongoose.connection.readyState === 1) return;
  mongoConn = await mongoose.connect(process.env.MONGODB_URI);

  // Seed sports on first connect
  const Sport = require('../server/models/Sport');
  const count = await Sport.countDocuments();
  if (count === 0) {
    await Sport.insertMany([
      { name:'Cricket',     category:'outdoor', courtCount:2, description:'Full cricket pitch with matting wickets' },
      { name:'Football',    category:'outdoor', courtCount:1, description:'Full-size football field with goal posts' },
      { name:'Volleyball',  category:'outdoor', courtCount:2, description:'Outdoor volleyball courts with nets' },
      { name:'Kabaddi',     category:'outdoor', courtCount:1, description:'Regulation kabaddi mat' },
      { name:'Kho-Kho',     category:'outdoor', courtCount:1, description:'Kho-Kho field with center lane' },
      { name:'Throw Ball',  category:'outdoor', courtCount:1, description:'Throw ball court with net' },
      { name:'Basketball',  category:'indoor',  courtCount:1, description:'Indoor basketball court' },
      { name:'Table Tennis',category:'indoor',  courtCount:4, description:'4 TT tables in the sports hall' },
      { name:'Gym',         category:'indoor',  courtCount:1, description:'Fully equipped fitness centre' },
      { name:'Carrom',      category:'indoor',  courtCount:6, description:'6 carrom boards available' },
      { name:'Chess',       category:'indoor',  courtCount:10,description:'Multiple chess sets available' },
    ]);
    console.log('🌱 Sports seeded');
  }
}

/* ── Serverless handler ──────────────────────────── */
module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
