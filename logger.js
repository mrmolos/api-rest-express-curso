function log(req, res, next) {
    console.log('saludos desde la funcion log');
    next();
};

module.exports = log;