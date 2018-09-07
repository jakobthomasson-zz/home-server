import { default as Author, AuthorModel } from "../../models/library/author";
import { Request, Response, NextFunction } from "express";
const async = require("async");

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

// // Display detail page for a specific Author.
// exports.author_detail = function(req, res, next) {
//   async.parallel(
//     {
//       author: function(callback) {
//         Author.findById(req.params.id).exec(callback);
//       },
//       authors_books: function(callback) {
//         Book.find({ author: req.params.id }, "title summary").exec(callback);
//       }
//     },
//     function(err, results) {
//       if (err) {
//         return next(err);
//       } // Error in API usage.
//       if (results.author == undefined) {
//         // No results.
//         const err = new Error("Author not found");
//         err.status = 404;
//         return next(err);
//       }
//       // Successful, so render.
//       res.render("author_detail", {
//         title: "Author Detail",
//         author: results.author,
//         author_books: results.authors_books
//       });
//     }
//   );
// };

// Display Author create form on GET.
export const author_create_get = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Author create GET");
};

// Handle Author create on POST.
export const author_create_post = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Author create POST");
};

// Display Author delete form on GET.
export const author_delete_get = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Author delete GET");
};

// Handle Author delete on POST.
export const author_delete_post = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Author delete POST");
};

// Display Author update form on GET.
export const author_update_get = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Author update GET");
};

// Handle Author update on POST.
export const author_update_post = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: Author update POST");
};
