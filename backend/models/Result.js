import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({

  quizId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Quiz"
  },

  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
  },

  score:{
    type:Number
  }

},{timestamps:true});

export default mongoose.model("Result", resultSchema);