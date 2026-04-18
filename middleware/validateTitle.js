function validateTitle(req, res, next) {
  if (!req.body.title || req.body.title.trim() === "") {
    return res.status(400).json({ error: "title is required" });
  }
  next();
}

module.exports = { validateTitle };