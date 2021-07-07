module.exports = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({ msg: err.msg });
  } else {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
