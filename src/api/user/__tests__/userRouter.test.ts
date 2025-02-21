import { destroyDB, initializeDB } from "@/config/db";
import { app } from "@/server";
import request from "supertest";

beforeAll(async () => {
  await initializeDB();
});

afterAll(async () => {
  await destroyDB();
});

describe("Auth routes", () => {
  test("should return 401 if user is not found", async () => {
    const a = await request(app).get("/users/test").send();
    expect(a.status).toBe(200);
  });
});
