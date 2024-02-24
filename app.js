import express from 'express';
import mongoose from 'mongoose';
import router from './routes/router';
import blogRouter from './routes/blog-routes';

const app = express();

const PORT = 5000;

app.use(express.json());
app.use('/api/user',router);
app.use('/api/blog', blogRouter)

mongoose
.connect('mongodb+srv://admin:7SAiWTFDA95n8wTE@cluster0.btjlvyh.mongodb.net/Blog?retryWrites=true&w=majority'
).then(()=>app.listen(PORT, 
    console.log(`Listening to the server on port no ${PORT}`)
    )).then(()=>console.log(`you are connected to the database and your port no is ${PORT}`)).catch((err)=>{
        console.log(err);
    });


//7SAiWTFDA95n8wTE