const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const orderRoutes = require('./api/routes/orders');
const productsRoutes = require('./api/routes/products');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://anmol_gupta:'+ process.env.MONGO_ATLAS_PWD +'@rest-shop-api-tbipj.mongodb.net/test?retryWrites=true')
 .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    //console.log('Connection failed');
    err => {
        console.log(err)
    }
  })
mongoose.Promise = global.Promise; // this is done to remove the depriciation 
// warning.
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads')); // this will make the uploads folder 
// statically public which is not accessible to public by default.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'X-Requested-With, Origin, Content-Type, Accept, Authorization'
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, DELETE, PATCH, POST, GET');
        return res.status(200).json({});
    }
    next();
})

app.use('/products', productsRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;