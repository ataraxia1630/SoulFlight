module.exports =
  (fields = []) =>
  (req, _res, next) => {
    fields.forEach((f) => {
      if (req.body[f] && typeof req.body[f] === "string") {
        try {
          req.body[f] = JSON.parse(req.body[f]);
        } catch {
          req.body[f] = {};
        }
      }
    });
    next();
  };
