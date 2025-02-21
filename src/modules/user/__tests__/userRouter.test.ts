import { destroyDB, initializeDB } from "@/db/db";
import { app } from "@/server";
import request from "supertest";

beforeAll(async () => {
  await initializeDB();
});

afterAll(async () => {
  await destroyDB();
});

describe("Auth routes", () => {
  test("should return user data", async () => {
    const a = await request(app).get("/users/test").send();
    expect(a.status).toBe(200);
  });
});
