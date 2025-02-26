import request from "supertest";
import app from "../index.js"; // Ensure your Express app is exported

describe("Sample Test", () => {
  it("should return a 200 status", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});
