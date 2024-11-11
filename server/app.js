const express = require('express');
const app = express();
require('dotenv').config(); // Load environment variables
const connectToDb = require('./config/mongoose-connection'); // Import DB connection
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes')

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

connectToDb(); // Connect to MongoDB

// Root route
app.use('/api/auth', authRoutes)



// Start server
app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000');
});
