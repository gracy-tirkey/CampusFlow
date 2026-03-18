import Doubt from "../models/Doubt.js";

export const createDoubt = async (req,res)=>{

  try{

    const { question } = req.body;

    const doubt = new Doubt({
      question,
      image: req.file?.path,
      askedBy: req.user.id
    });

    await doubt.save();

    res.status(201).json(doubt);

  }catch(error){

    console.log("DOUBT ERROR:", error);

    res.status(500).json({
        message: error.message
    });

    }
  }
;


export const getAllDoubts = async (req,res)=>{

  try{

    const doubts = await Doubt.find()
    .populate("askedBy","name role")
    .populate("answers.answeredBy","name role");

    res.json(doubts);

  }catch(error){

    res.status(500).json({
      message:"Error fetching doubts"
    });

  }

};


export const answerDoubt = async (req,res)=>{

  try{

    const { text } = req.body;

    const doubt = await Doubt.findById(req.params.id);

    doubt.answers.push({
      text,
      answeredBy:req.user.id
    });

    await doubt.save();

    res.json({
      message:"Answer added"
    });

  }catch(error){

    res.status(500).json({
      message:"Error answering doubt"
    });

  }

};