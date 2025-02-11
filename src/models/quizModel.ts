import mongoose, { Document, Schema } from "mongoose";

export interface IQuizQuestion extends Document {
  ordre: number;
  question: string;
  answers: {
    answer: string;
    impact: number;
  }[];
}

const QuizQuestionSchema: Schema = new Schema({
  ordre: { type: Number, required: true },
  question: { type: String, required: true },
  answers: [
    {
      answer: { type: String, required: true },
      impact: { type: Number, required: true }
    }
  ]
});

export default mongoose.model<IQuizQuestion>("QuizQuestion", QuizQuestionSchema);
