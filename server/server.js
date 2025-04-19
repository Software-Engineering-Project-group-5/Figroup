const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/settlements', require('./routes/settlementRoutes'));
app.use('/api/investments', require('./routes/investmentRoutes'));
app.use('/api/contributions', require('./routes/contributionRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/stocks', require('./routes/stocksRoutes'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));