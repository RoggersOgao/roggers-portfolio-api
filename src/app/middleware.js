const corHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  
  const corsMiddleware = (handler) => (req, res) => {
    // Set CORS headers from the `corHeaders` object
    Object.entries(corHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    return handler(req, res);
  };
  
  const applyCorsMiddleware = (handler) =>
    corsMiddleware(async (request, response) => {
      try {
        const result = await handler(request, response);
        return result;
      } catch (error) {
        // Handle errors here or return an appropriate response
        console.error(error);
        return response.status(500).json({ message: "Internal server error" });
      }
    });
  
  export default applyCorsMiddleware;
  