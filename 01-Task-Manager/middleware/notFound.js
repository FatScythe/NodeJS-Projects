const notFound = (req, res) =>
  res.status(404).send("Err: Route doesn't Exist !!!");

module.exports = notFound;
