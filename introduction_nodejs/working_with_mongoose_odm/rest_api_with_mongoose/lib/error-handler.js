const { EHttpStatus } = require('./utils');

function errorHandler(err, req, res, next) {
    // TODO: add logger
    console.error(err);

    res
      .status(err.status || EHttpStatus.InternalServerError)
      .json({
          apiVersion: 'v1',
          domain: err.domain || 'Server',
          error: {
              status: err.status || EHttpStatus.InternalServerError,
              code: err.code || 'InternalServerException',
              msg: err.message,
              errors: err.verbose,
          }
      });
}

module.exports = errorHandler;
