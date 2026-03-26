export function errorMiddleware(error, _req, res, _next) {
  const status = error.statusCode || 400;
  res.status(status).json({
    message: error.message || "Unexpected server error"
  });
}
