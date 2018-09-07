import { Request, Response, NextFunction } from "express";
import async from "async";

import { default as Author, AuthorModel } from "../../models/library/Author";
import { default as Book, BookModel } from "../../models/library/Book";
import { default as BookInstance, BookInstanceModel } from "../../models/library/BookInstance";
import { default as Genre, GenreModel } from "../../models/library/Genre";

export const index = (req: Request, res: Response) => {
  async.parallel(
    {
      author_count: (callback: (err: any, result: any) => void) => {
        Author.count({}, callback);
      },
      book_count: (callback: (err: any, result: any) => void) => {
        Book.count({}, callback);
      },
      book_instance_count: (callback: (err: any, result: any) => void) => {
        BookInstance.count({}, callback);
      },
      author_book_instance_available_count: (callback: (err: any, result: any) => void) => {
        BookInstance.count({ status: "Available" }, callback);
      },
      genre_count: (callback: (err: any, result: any) => void) => {
        Genre.count({}, callback);
      },
    },
    (err: any, result: any) => {
      console.log(result);
      res.render("api/library/index", { title: "Local Library Home", error: err, data: result });
    });
};

// Display list of all books.
export const book_list = (req: Request, res: Response, next: NextFunction) => {
  Book
    .find({}, "title author")
    .populate("author")
    .exec((err: any, result: BookModel[]) => {
      if (err) {
        return next(err);
      }
      res.render("api/library/book_list", { title: "Book List", book_list: result });
    });
};



// Display detail page for a specific book.
export const book_detail = (req: Request, res: Response, next: NextFunction) => {
  async.parallel({
    book: (callback: (err: any, result: BookModel) => void) => {
      Book
        .findById(req.params.id)
        .populate("genre")
        .exec(callback);
    },
    book_instances: (callback: (err: any, result: BookInstanceModel) => void) => {
      BookInstance
        .find({ "book": req.params.id })
        .exec(callback);
    }
  },
    (err: any, result: { book: BookModel, book_instances: BookInstanceModel }) => {
      if (err) {
        return next(err);
      }
      if (result.book === null) {
        err = new Error("Book not found");
        err.status = 404;
        return next(err);
      }

      res.render("api/library/book_detail", { title: "Title", ...result });

    });
};

// Display book create form on GET.
export const book_create_get = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Book create GET");
};

// Handle book create on POST.
export const book_create_post = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Book create POST");
};

// Display book delete form on GET.
export const book_delete_get = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Book delete GET");
};

// Handle book delete on POST.
export const book_delete_post = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Book delete POST");
};

// Display book update form on GET.
export const book_update_get = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Book update GET");
};

// Handle book update on POST.
export const book_update_post = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Book update POST");
};