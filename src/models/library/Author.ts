import mongoose from "mongoose";
import moment from "moment";

export type AuthorModel = mongoose.Document & {
  first_name: string,
  family_name: string,
  date_of_birth: Date,
  date_of_death: Date,
};

const authorSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true, max: 100 },
    family_name: { type: String, required: true, max: 100 },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
  }
);

// Virtual for author's full name
authorSchema
  .virtual("name")
  .get(function () {
    return this.family_name + ", " + this.first_name;
  });

// Virtual for author's lifespan
authorSchema
  .virtual("lifespan")
  .get(function () {
    return moment(this.date_of_birth).format("MMMM Do, YYYY").toString() + " - " + moment(this.date_of_death).format("MMMM Do, YYYY").toString();
  });

// Virtual for author's URL
authorSchema
  .virtual("url")
  .get(function () {
    return "/catalog/author/" + this._id;
  });

// Export model
const Author = mongoose.model("Author", authorSchema);
export default Author;