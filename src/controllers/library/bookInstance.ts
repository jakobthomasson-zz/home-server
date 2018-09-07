// import { Request, Response } from "express";
// import Book from "../models/book";

// // import * as async from 'async';

// // exports.index = function (req: Request, res: Response) {
// //   async.parallel(
// //     {
// //       book_count(callback) {
// //         Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
// //       },
// //     },
// //     (err, results) => {
// //       res.render('index', {
// //         title: 'Local Library Home',
// //         error: err,
// //         data: results,
// //       });
// //     },
// //   );
// // };

// export let allBooks = (req: Request, res: Response) => {
//   Book.find((err: any, books: any) => {
//     if (err) {
//       res.send(err);
//     } else {
//       res.send(books);
//     }
//   });
// };

// export let getBook = (req: Request, res: Response) => {
//   Book.findById(req.params.id, (err: any, book: any) => {
//     if (err) {
//       res.send(err);
//     } else {
//       res.send(book);
//     }
//   });
// };

// export let addBook = (req: Request, res: Response) => {
//   const book = new Book(req.body);
//   book.save((err: any) => {
//     if (err) {
//       res.send(err);
//     } else {
//       res.send(book);
//     }
//   });
// };

// export let deleteBook = (req: Request, res: Response) => {
//   Book.deleteOne({ _id: req.params.id }, (err: any) => {
//     if (err) {
//       res.send(err);
//     } else {
//       res.send("Successfully deleted the book");
//     }
//   });
// };

// export let updateBook = (req: Request, res: Response) => {
//   Book.findByIdAndUpdate(req.params.id, req.body, (err: any, book: any) => {
//     if (err) {
//       res.send(err);
//     } else {
//       res.send("Successfully updated the book");
//     }
//   });
// };
