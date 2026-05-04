require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');

const authRoutes    = require('./routes/authRoutes');
const sportRoutes   = require('./routes/sportRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const eventRoutes   = require('./routes/eventRoutes');
const adminRoutes   = require('./routes/adminRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ── Middleware ─────────────────────────────────── */
app.use(helmet());
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  /\.vercel\.app$/,
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true); // allow non-browser (Postman etc)
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    cb(allowed ? null : new Error('Not allowed by CORS'), allowed);
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

app.get('/api/health', (_, res) => res.json({ status: 'ok', time: new Date() }));

/* ── 404 ─────────────────────────────────────────── */
app.use((req, res) => res.status(404).json({ message: `Route ${req.originalUrl} not found` }));

/* ── Error handler ───────────────────────────────── */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

/* ── MongoDB + Listen ────────────────────────────── */
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');
    await seedSports();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

/* ── Seed sports data ────────────────────────────── */
async function seedSports() {
  const Sport = require('./models/Sport');
  const count = await Sport.countDocuments();
  if (count > 0) return;

  const sports = [
    { name:'Cricket',     category:'outdoor', courtCount:2, description:'Full cricket pitch with matting wickets', image:'' },
    { name:'Football',    category:'outdoor', courtCount:1, description:'Full-size football field with goal posts', image:'' },
    { name:'Volleyball',  category:'outdoor', courtCount:2, description:'Outdoor volleyball courts with nets', image:'' },
    { name:'Kabaddi',     category:'outdoor', courtCount:1, description:'Regulation kabaddi mat', image:'' },
    { name:'Kho-Kho',     category:'outdoor', courtCount:1, description:'Kho-Kho field with center lane', image:'' },
    { name:'Throw Ball',  category:'outdoor', courtCount:1, description:'Throw ball court with net', image:'' },
    { name:'Basketball',  category:'indoor',  courtCount:1, description:'Indoor basketball court', image:'' },
    { name:'Table Tennis',category:'indoor',  courtCount:4, description:'4 TT tables in the sports hall', image:'' },
    { name:'Gym',         category:'indoor',  courtCount:1, description:'Fully equipped fitness centre', image:'' },
    { name:'Carrom',      category:'indoor',  courtCount:6, description:'6 carrom boards available', image:'' },
    { name:'Chess',       category:'indoor',  courtCount:10,description:'Multiple chess sets available', image:'' },
  ];

  await Sport.insertMany(sports);
  console.log('🌱 Sports seeded');
}
