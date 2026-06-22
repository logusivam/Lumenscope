export const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err);

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy blocked this request' });
  }

  res.status(500).json({
    error: err.message || 'An unexpected error occurred'
  });
};
