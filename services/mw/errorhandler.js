const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return response.status(400).send({ error: 'malformatted id' });
    }

    next(error);
};


const mongoIdErrorHandler = () => errorHandler;

module.exports = mongoIdErrorHandler;
