import { Request, Response, NextFunction } from "express";
import { default as BookInstance, BookInstanceModel } from "../../models/library/BookInstance";

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
export const bookinstance_create_get = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: BookInstance create GET");
};

// Handle BookInstance create on POST.
export const bookinstance_create_post = (req: Request, res: Response) => {
  res.send("NOT IMPLEMENTED: BookInstance create POST");
};

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
