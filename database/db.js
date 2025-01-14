import mongoose from 'mongoose';

const connectdb = async (req, res) => {
    try{
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB Connected...');
    }catch(err){
        console.error(err);
    }
}

export default connectdb;