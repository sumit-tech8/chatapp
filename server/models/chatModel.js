import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    
    text: {
        type: String,
      },
  });
  
  export default mongoose.model('Message', messageSchema);