import request from "supertest";
import { app, mongoose, server } from "../server.js";

beforeAll(async () => {
  // No need to start the server here; it's already started in server.js
});

afterAll(async () => {
  // Close the server
  await server.close();

  // Close the MongoDB connection
  await mongoose.connection.close();
});

describe("GET /", () => {
  it("should return 'Backend is running'", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe("Backend is running");
  });
});

describe("GET /api/auth (Non-existent route)", () => {
  it("should return 404", async () => {
    const res = await request(app).get("/api/auth");
    expect(res.statusCode).toEqual(404);
  });
});