import mongoose from "mongoose";

const homeSchoolingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    videoLink: {
      type: String,
      required: true
    },
    ageLimit: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const HomeSchooling = mongoose.model(
  "HomeSchooling",
  homeSchoolingSchema
);

export default HomeSchooling;