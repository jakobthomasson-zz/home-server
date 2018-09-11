import { Request, Response, NextFunction } from "express";
import async from "async";

import { default as Author, AuthorModel } from "../../models/library/Author";
import { default as Book, BookModel } from "../../models/library/Book";
import { default as BookInstance, BookInstanceModel } from "../../models/library/BookInstance";
import { default as Genre, GenreModel } from "../../models/library/Genre";
import { body, validationResult } from "express-validator/check";
import { sanitizeBody } from "express-validator/filter";

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
export const book_create_get = (req: Request, res: Response, next: NextFunction) => {

  // Get all authors and genres, which we can use for adding to our book.
  async.parallel({
    authors: (callback: (err: any, res: AuthorModel[]) => void) => {
      Author.find(callback);
    },
    genres: (callback: (err: any, res: GenreModel[]) => void) => {
      Genre.find(callback);
    },
  }, (err: any, results: { authors: AuthorModel[], genres: GenreModel[] }) => {
    if (err) { return next(err); }
    res.render("api/library/book_form", { title: "Create Book", ...results });
  });

};

// Handle book create on POST.
export const book_create_post = [
  // Convert the genre to an array.
  (req: Request, res: Response, next: NextFunction) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined")
        req.body.genre = [];
      else
        req.body.genre = new Array(req.body.genre);
    }
    next();
  },

  // Validate fields.
  body("title", "Title must not be empty.").isLength({ min: 1 }).trim(),
  body("author", "Author must not be empty.").isLength({ min: 1 }).trim(),
  body("summary", "Summary must not be empty.").isLength({ min: 1 }).trim(),
  body("isbn", "ISBN must not be empty").isLength({ min: 1 }).trim(),

  // Sanitize fields (using wildcard).
  sanitizeBody("*").trim().escape(),

  // Process request after validation and sanitization.
  (req: Request, res: Response, next: NextFunction) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const book = new Book(
      {
        title: req.body.title,
        author: req.body.author,
        summary: req.body.summary,
        isbn: req.body.isbn,
        genre: req.body.genre
      });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel({
        authors: function (callback) {
          Author.find(callback);
        },
        genres: function (callback) {
          Genre.find(callback);
        },
      }, function (err, results: { genres: GenreModel[], authors: AuthorModel[] }) {
        if (err) { return next(err); }

        // Mark our selected genres as checked.
        for (let i = 0; i < results.genres.length; i++) {
          if (book.genre.indexOf(results.genres[i]._id) > -1) {
            results.genres[i].checked = true;
          }
        }
        res.render("book_form", { title: "Create Book", authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
      });
      return;
    }
    else {
      // Data from form is valid. Save book.
      book.save(function (err) {
        if (err) { return next(err); }
        // successful - redirect to new book record.
        res.redirect(book.url);
      });
    }
  }
];

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