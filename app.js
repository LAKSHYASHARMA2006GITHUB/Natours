const express  = require('express');
const app= express();
const morgan = require('morgan');
const ratelimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');


const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./Routes/tourRoutes')
const userRouter = require('./Routes/userRoutes');
const { default: rateLimit } = require('express-rate-limit');

//middleware functions.
//Global middlewares
//set security HTTP headers
app.use(helmet());
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

//Limit requests from same API
const limiter = rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:'Too many request form this IP,please try again in an hour!'
})
app.use('/api',limiter);

//Body parser,reading data from body into req.body
app.use(express.json({limit:'10kb'}));

//Data sanatization against NOSql query injection
app.use(mongoSanitize());
//Data sanitization  against XSS
app.use(xss());
//parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price'
    ],
  })
); 


app.use(express.json());
app.use(morgan('dev')); 
app.use(express.static(`${__dirname}/public`));
app.use((req,res,next)=>{               
    console.log("hello from the server...😀🙏");
    next();
}) 

//test middleware
app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
    console.log(req.headers)
    next();
})


// {
    // app.get('/api/v1/tours',getAllTour);
    
    // app.get('/api/v1/tours/:id',getTour);
    
    // app.post('/api/v1/tours',postTour);
    
    // app.patch('/api/v1/tours/:id',patchTour);
    
    // app.delete('/api/v1/tours/:id',deleteTour);
//}


//3. Routes 
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);

app.all('*', (req, res, next) => {

next(new AppError(`Can't find ${req.originalUrl} on the server!'t find`,404));
});

app.use(globalErrorHandler);

module.exports = app;
// const tour  = JSON.parse(
//     fs.readFileSync(`${__dirname}/dev-data/data/tours.json`)
// )

// app.get('/api/v2/tours',(req,res)=>{
//     res.status(200).json({
//         status:'success',
//         data:{
//             tours
//         }
//     })
// })

