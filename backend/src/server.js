import connectDB from './config/db.js';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5009;

connectDB();

app.listen(PORT, ()=>{
    try{
         console.log(`Server running on port ${PORT}`)
    }catch(error){
        console.log(error.message);
    }

})