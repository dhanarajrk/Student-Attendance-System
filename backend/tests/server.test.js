import request from "supertest";
import app from "../server.js";

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