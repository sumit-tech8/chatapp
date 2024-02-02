import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';  
import authRoutes from './routes/authRoute.js'
import avatarRoutes from './routes/avatarRoute.js'
import cors from 'cors'
import chatModel from './models/chatModel.js'
import path from 'path'

//configure env 
dotenv.config();

//database config
connectDB();

//rest object
const app = express();

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, './my-app/build')))

//routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/Avatar', avatarRoutes);


//chat-routes
// Routes
app.get('/api/messages', async (req, res) => {
    try {
      const messages = await chatModel.find();
      res.json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });
  
  app.post('/api/messages', async (req, res) => {
    const { text } = req.body;
    const message = new chatModel({ text });
  
    try {
      await message.save();
      res.status(201).json(message);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });   


//rest api
app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./my-app/build/index.html'));
})

app.get('/',(req,res) => {
    res.send("<h1>Welcome to chat app <h1/>")
});

//port
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
    console.log(`server running on ${process.env.DEV_MODE} mode on port ${PORT}` .bgCyan.white);
});