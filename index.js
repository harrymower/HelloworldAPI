const express = require("express");
const app = express();

// The port is 3000, as specified in the openapi.yaml for the Development Server.
// Using process.env.PORT allows for flexibility in deployment environments.
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies. This is necessary to detect malformed JSON.
app.use(express.json());

// Create a router for the /v1 prefix, as specified in the servers.url in openapi.yaml
const v1Router = express.Router();

/**
 * This handler implements the GET /hello endpoint.
 * It corresponds to the 'getHelloWorld' operationId in the OpenAPI specification.
 */
v1Router.get("/hello", (req, res) => {
  // The response adheres to the '200' response definition in openapi.yaml.
  // It returns a JSON object with a 'message' property.
  res.status(200).json({
    message: "Hello World",
  });
});

/**
 * This handler implements the GET /goodbye endpoint.
 * It returns a simple string message.
 */
v1Router.get("/goodbye", (req, res) => {
  res.status(200).send("good bye");
});

// Mount the router on the /v1 path. All routes defined in v1Router will be prefixed with /v1.
app.use("/v1", v1Router);

// Custom error-handling middleware to handle 400 Bad Request errors.
// This middleware is placed after all other routes and middleware to act as a catch-all for errors.
app.use((err, req, res, next) => {
  // The express.json() middleware throws a SyntaxError if the request body is malformed.
  // We can check for this specific error to return a 400 response.
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Bad Request: Malformed JSON received.", err);
    // The response adheres to the '400' response definition in openapi.yaml.
    return res.status(400).json({
      error: "Invalid request parameters. The request body is not valid JSON.",
    });
  }

  // If it's not a JSON parsing error, pass it to the default Express error handler.
  // This could be expanded to handle other types of errors, like the 500 error.
  next(err);
});

// Start the server and listen for incoming requests.
app.listen(port, () => {
  console.log(`Hello World API server running on http://localhost:${port}`);
  console.log(`Try the endpoint: http://localhost:${port}/v1/hello`);
  console.log(`Try the new endpoint: http://localhost:${port}/v1/goodbye`);
});
