import mongoose from "mongoose";

export type BookModel = mongoose.Document & {
  title: string,
  summary: string,
  isbn: string,
  author: any, // TODO: vet inte hur denna ska va
  genre: any, // TODO: hur?
};

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Author", required: true },
    summary: { type: String, required: true },
    isbn: { type: String, required: true },
    genre: [{ type: mongoose.Schema.Types.ObjectId, ref: "Genre" }]
  }
);

// Virtual for book's URL
bookSchema
  .virtual("url")
  .get(function () {
    return "/catalog/book/" + this._id;
  });

// Export model
const Book = mongoose.model("Book", bookSchema);
export default Book;