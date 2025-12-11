const express  = require('express');
const app= express();

const morgan = require('morgan');
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



// app.get('/api/v1/tours',getAllTour);

// app.get('/api/v1/tours/:id',getTour);

// app.post('/api/v1/tours',postTour);

// app.patch('/api/v1/tours/:id',patchTour);

// app.delete('/api/v1/tours/:id',deleteTour);

//3. Routes 



app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/users',userRouter);
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


module.exports = app;
