import { default as Author, AuthorModel } from "../../models/library/Author";
import { Request, Response, NextFunction } from "express";
import async from "async";
import Book, { BookModel } from "../../models/library/Book";

import { body, validationResult } from "express-validator/check";
import { sanitizeBody } from "express-validator/filter";

// Display list of all Authors.
export const author_list = (req: Request, res: Response, next: NextFunction) => {
  Author.find()
    .sort([["family_name", "ascending"]])
    .exec((err, list_authors: AuthorModel[]) => {
      if (err) {
        return next(err);
      }
      // Successful, so render
      res.render("api/library/author_list", {
        title: "Author List",
        author_list: list_authors
      });
    });
};

export const author_detail = (req: Request, res: Response, next: NextFunction) => {

  async.parallel({
    author: (callback: ApiHelper.Callback<AuthorModel>) => {
      Author
        .findById(req.params.id)
        .exec(callback);
    },
    author_books: (callback: ApiHelper.Callback<BookModel[]>) => {
      Book
        .find({ "author": req.params.id })
        .exec(callback);
    }
  },
    (err: any, result: { author: AuthorModel, author_books: BookModel[] }) => {
      if (err) {
        next(err);
      }
      if (result.author === null) {
        err = new Error("Author not found");
        err.status = 404;
        return next(err);
      }

      res.render("api/library/author_detail", { title: "Author detail", ...result });
    });
};

// Display Author create form on GET.
export const author_create_get = (req: Request, res: Response) => {
  res.render("api/library/author_form", { title: "Create Author" });
};

// Handle Author create on POST.
export const author_create_post = [

  // Validate fields.
  body("first_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ checkFalsy: true })
    .isISO8601(),
  body("date_of_death", "Invalid date of death")
    .optional({ checkFalsy: true })
    .isISO8601(),

  // Sanitize fields.
  sanitizeBody("first_name")
    .trim()
    .escape(),
  sanitizeBody("family_name")
    .trim()
    .escape(),
  sanitizeBody("date_of_birth")
    .toDate(),
  sanitizeBody("date_of_death")
    .toDate(),

  // Process request after validation and sanitization.
  (req: Request, res: Response, next: NextFunction) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    // Create an Author object with escaped and trimmed data.
    const author = new Author(
      {
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
      });
    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("api/library/author_form", { title: "Create Author", author: req.body, errors: errors.array() });
      return;
    }
    else {
      // Data from form is valid.
      // TODO: Check if Author with same name already exists.

      author.save(function (err) {
        if (err) { return next(err); }
        // Successful - redirect to new author record.
        res.redirect(author.url);
      });
    }
  }
];

// Display Author delete form on GET.
export const author_delete_get = (req: Request, res: Response, next: NextFunction) => {
  async.parallel({
    author: (callback: ApiHelper.Callback<AuthorModel>) => {
      Author.findById(req.params.id).exec(callback);
    },
    author_books: (callback: ApiHelper.Callback<BookModel[]>) => {
      Book.find({ "author": req.params.id }).exec(callback);
    },
  }, (err: any, result: { author: AuthorModel, author_books: BookModel[] }) => {
    if (err) { return next(err); }
    if (result.author == undefined) { // No results.
      res.redirect("/api/library/authors");
    }
    // Successful, so render.
    res.render("api/library/author_delete", { title: "Delete Author", ...result });
  });
};

// Handle Author delete on POST.
export const author_delete_post = (req: Request, res: Response, next: NextFunction) => {

  async.parallel({
    author: (callback: ApiHelper.Callback<AuthorModel>) => {
      Author.findById(req.body.authorid).exec(callback);
    },
    authors_books: (callback: ApiHelper.Callback<BookModel[]>) => {
      Book.find({ "author": req.body.authorid }).exec(callback);
    },
  }, (err: any, result: { author: AuthorModel, authors_books: BookModel[] }) => {
    if (err) { return next(err); }
    // Success
    if (result.authors_books.length > 0) {
      // Author has books. Render in same way as for GET route.
      res.render("author_delete", { title: "Delete Author", author: result.author, author_books: result.authors_books });
      return;
    }
    else {
      // Author has no books. Delete object and redirect to the list of authors.
      Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
        if (err) { return next(err); }
        // Success - go to author list
        res.redirect("/api/library/authors");
      });
    }
  });
};
// Display Author update form on GET.
export const author_update_get = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST.
export const author_update_post = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Author update POST");
};
