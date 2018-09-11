import { Request, Response, NextFunction } from "express";
import { default as BookInstance, BookInstanceModel } from "../../models/library/BookInstance";
import { default as Book, BookModel } from "../../models/library/Book";

import { body, validationResult } from "express-validator/check";
import { sanitizeBody } from "express-validator/filter";

// Display list of all BookInstances.
export const bookinstance_list = (req: Request, res: Response, next: NextFunction) => {
  BookInstance
    .find()
    .populate("book")
    .exec(function (err: any, result: BookInstanceModel[]) {
      if (err) { return next(err); }
      // Successful, so render
      res.render("api/library/bookinstance_list", { title: "Book Instance List", bookinstance_list: result });
    });
};

// Display detail page for a specific BookInstance.
export const bookinstance_detail = (req: Request, res: Response, next: NextFunction) => {
  BookInstance
    .findById(req.params.id)
    .populate("book")
    .exec((err: any, result: BookInstanceModel) => {
      if (err) {
        return next(err);
      }
      if (result === null) {
        err = new Error("Book copy not found");
        err.status = 404;
        return next(err);
      }

      res.render("api/library/bookinstance_detail", { title: "Book", bookinstance: result });

    });
};

// Display BookInstance create form on GET.
export const bookinstance_create_get = (req: Request, res: Response, next: NextFunction) => {

  Book.find({}, "title")
    .exec(function (err, result: BookModel[]) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render("api/library/bookinstance_form", { title: "Create BookInstance", book_list: result });
    });
};

// Handle BookInstance create on POST.
export const bookinstance_create_post =
  [

    // Validate fields.
    body("book", "Book must be specified").isLength({ min: 1 }).trim(),
    body("imprint", "Imprint must be specified").isLength({ min: 1 }).trim(),
    body("due_back", "Invalid date").optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody("book").trim().escape(),
    sanitizeBody("imprint").trim().escape(),
    sanitizeBody("status").trim().escape(),
    sanitizeBody("due_back").toDate(),

    // Process request after validation and sanitization.
    (req: Request, res: Response, next: NextFunction) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a BookInstance object with escaped and trimmed data.
      const bookinstance = new BookInstance(
        {
          book: req.body.book,
          imprint: req.body.imprint,
          status: req.body.status,
          due_back: req.body.due_back
        });

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values and error messages.
        Book.find({}, "title")
          .exec(function (err, books) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render("api/library/bookinstance_form", { title: "Create BookInstance", book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance });
          });
        return;
      }
      else {
        // Data from form is valid.
        bookinstance.save(function (err) {
          if (err) { return next(err); }
          // Successful - redirect to new record.
          res.redirect(bookinstance.url);
        });
      }
    }
  ];

// Display BookInstance delete form on GET.
export const bookinstance_delete_get = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
};

// Handle BookInstance delete on POST.
export const bookinstance_delete_post = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: BookInstance delete POST");
};

// Display BookInstance update form on GET.
export const bookinstance_update_get = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
};

// Handle bookinstance update on POST.
export const bookinstance_update_post = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
};
