import mongoose from "mongoose";

export type GenreModel = mongoose.Document & {
  name: string;
};

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, min: 3, max: 100 },
});

// Virtual for genre's URL
genreSchema.virtual("url").get(function () {
  return "/api/library/genre/" + this._id;
});

// Export model
const Genre = mongoose.model("Genre", genreSchema);
export default Genre;
