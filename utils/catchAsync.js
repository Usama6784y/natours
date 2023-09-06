module.exports =
  // eslint-disable-next-line arrow-body-style
  (fn) => {
    // return (req, res, next, id = 5) => {
    return (req, res, next) => {
      // console.log(id, 'first');
      // fn(req, res, next, theId).catch((err) => next(err));
      // fn(req, res, next, id).catch(next);
      fn(req, res, next).catch(next);

      // console.log(id, 'second');
    };
  };
