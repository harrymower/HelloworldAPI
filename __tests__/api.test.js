const request = require("supertest");
const app = require("../index"); // Import the refactored Express app

describe("Greetings API", () => {
  // Test suite for the /hello endpoint
  describe("GET /v1/hello", () => {
    it("should return 200 OK with the correct JSON message", async () => {
      const response = await request(app)
        .get("/v1/hello")
        .expect("Content-Type", /json/)
        .expect(200);

      // Assert that the response body is what we expect
      expect(response.body).toEqual({ message: "Hello World" });
    });
  });

  // Test suite for the /goodbye endpoint
  describe("GET /v1/goodbye", () => {
    it("should return 200 OK with the correct text message", async () => {
      const response = await request(app)
        .get("/v1/goodbye")
        .expect("Content-Type", /text/)
        .expect(200);

      // Assert that the response text is correct
      expect(response.text).toBe("good bye");
    });
  });

  // Test suite for API error handling
  describe("Error Handling", () => {
    it("should return 404 Not Found for a route that does not exist", () => {
      return request(app).get("/v1/nonexistent-route").expect(404);
    });

    it("should return 400 Bad Request when the JSON body is malformed", async () => {
      const response = await request(app)
        .post("/v1/hello") // The endpoint doesn't matter, the JSON middleware runs first
        .set("Content-Type", "application/json")
        .send('{"key": "value"') // Malformed JSON (missing closing brace)
        .expect("Content-Type", /json/)
        .expect(400);

      // Assert that the error message is correct as per our handler
      expect(response.body).toHaveProperty("error");
      expect(response.body.error).toBe(
        "Invalid request parameters. The request body is not valid JSON."
      );
    });
  });
});
