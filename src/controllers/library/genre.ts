import { Request, Response, NextFunction } from "express";
import { default as Genre, GenreModel } from "../../models/library/Genre";
import { default as Book, BookModel } from "../../models/library/Book";
import { body, validationResult } from "express-validator/check";
import { sanitizeBody } from "express-validator/filter";

import async from "async";

// Display list of all Genre.
export const genre_list = (req: Request, res: Response, next: NextFunction) => {
  Genre
    .find()
    .sort([["name", "ascending"]])
    .exec((err: any, result: GenreModel[]) => {
      if (err) {
        return next(err);
      }
      res.render("api/library/genre_list", {
        title: "Genre List",
        genre_list: result
      });
    });
};


// Display detail page for a specific Genre.
export const genre_detail = (req: Request, res: Response, next: NextFunction) => {
  async.parallel({
    genre: (callback: (err: any, result: any) => void) => {
      Genre
        .findById(req.params.id)
        .exec(callback);
    },
    genre_books: (callback: (err: any, result: any) => void) => {
      Book
        .find({ "genre": req.params.id })
        .exec(callback);
    },
  },
    (err: any, result: { genre: GenreModel, genre_books: BookModel }) => {
      if (err) {
        return next(err);
      }
      if (result.genre === null) {
        err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }

      res.render("api/library/genre_detail", { title: "Genre Detail", genre: result.genre, genre_books: result.genre_books });
    });
};

// Display Genre create form on GET.
export const genre_create_get = (req: Request, res: Response) => {
  res.render("api/library/genre_form", { title: "Create Genre" });
};













// Handle Genre create on POST.
export const genre_create_post = [

  // Validate that the name field is not empty.
  body("name", "Genre name required").isLength({ min: 1 }).trim(),

  // Sanitize (trim and escape) the name field.
  sanitizeBody("name").trim().escape(),

  // Process request after validation and sanitization.
  (req: Request, res: Response, next: NextFunction) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const genre = new Genre(
      { name: req.body.name }
    );


    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("api/library/genre_form", { title: "Create Genre", genre: genre, errors: errors.array() });
      return;
    }
    else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ "name": req.body.name })
        .exec(function (err, found_genre: GenreModel) {
          if (err) { return next(err); }

          if (found_genre) {
            // Genre exists, redirect to its detail page.
            res.redirect(found_genre.url);
          }
          else {

            genre.save(function (err) {
              if (err) { return next(err); }
              // Genre saved. Redirect to genre detail page.
              res.redirect(genre.url);
            });

          }

        });
    }
  }
];










// Display Genre delete form on GET.
export const genre_delete_get = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Genre delete GET");
};

// Handle Genre delete on POST.
export const genre_delete_post = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Genre delete POST");
};

// Display Genre update form on GET.
export const genre_update_get = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
export const genre_update_post = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
};