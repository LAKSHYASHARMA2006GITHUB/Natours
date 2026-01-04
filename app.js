const express  = require('express');
const app= express();
const morgan = require('morgan');
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./Routes/tourRoutes')
const userRouter = require('./Routes/userRoutes')




//middleware functions.
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(morgan('dev')); 
app.use(express.static(`${__dirname}/public`));
app.use((req,res,next)=>{               
    console.log("hello from the server...😀🙏");
    next();
}) 

app.use((req,res,next)=>{
    req.requestTime = new Date().toISOString();
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

