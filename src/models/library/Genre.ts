import mongoose from "mongoose";

export type GenreModel = mongoose.Document & {
  name: string;
};

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 3, max: 100 },
});

// Virtual for genre's URL
genreSchema.virtual("url").get(function () {
  return "/catalog/genre/" + this._id;
});

// Export model
module.exports = mongoose.model("Genre", genreSchema);
