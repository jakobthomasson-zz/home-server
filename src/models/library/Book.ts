import mongoose from "mongoose";
import { AuthorModel } from "./Author";
import { GenreModel } from "./Genre";
export type BookModel = mongoose.Document & {
  title: string,
  summary: string,
  isbn: string,
  author: AuthorModel, // TODO: vet inte hur denna ska va
  genre: GenreModel[], // TODO: hur?
  url: string
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
    return "/api/library/book/" + this._id;
  });

// Export model
const Book = mongoose.model<BookModel>("Book", bookSchema);
export default Book;