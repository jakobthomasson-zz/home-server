import mongoose from "mongoose";


export type BookInstanceModel = mongoose.Document & {
  book: any, // TODO:
  imprint: string,
  status: Date,
  due_back: Date,
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
    return "/catalog/bookinstance/" + this._id;
  });


// Export model
const BookInstance = mongoose.model("BookInstance", bookInstanceSchema);
export default BookInstance;