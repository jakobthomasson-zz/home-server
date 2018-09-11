import mongoose from "mongoose";
import moment from "moment";

export type BookInstanceModel = mongoose.Document & {
  book: any, // TODO:
  imprint: string,
  status: Date,
  due_back: Date,
  url: string,
  due_back_formatted: string
};



const bookInstanceSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true }, // reference to the associated book
    imprint: { type: String, required: true },
    status: { type: String, required: true, enum: ["Available", "Maintenance", "Loaned", "Reserved"], default: "Maintenance" },
    due_back: { type: Date, default: Date.now }
  }
);

// Virtual for bookinstance's URL
bookInstanceSchema
  .virtual("url")
  .get(function () {
    return "/api/library/bookinstance/" + this._id;
  });

bookInstanceSchema
  .virtual("due_back_formatted")
  .get(function () {
    return moment(this.due_back).format("MMMM Do, YYYY");
  });


// Export model
const BookInstance = mongoose.model<BookInstanceModel>("BookInstance", bookInstanceSchema);
export default BookInstance;