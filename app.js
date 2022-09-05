const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');

app.use(bodyParser.json());
app.use(express.json());

//import routes
const postsRoute = require('./routes/posts');
const authRoutes = require('./routes/auth'); 


//middleware
app.use('/posts', postsRoute);
app.use('/auth', authRoutes);



//Routes
app.get('/', (req, res) => {
    res.send("We are on home");
});



//connect to database
mongoose.connect(process.env.DB_CONNECTION,  
{useNewUrlParser: true}, 
() => console.log('Connected to DB!')
);

//listening to the server
app.listen(5000);