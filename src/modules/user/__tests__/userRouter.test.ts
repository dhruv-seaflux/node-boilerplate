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
    const response = await request(app).get("/users/").send();
    expect(response.status).toBe(200);
  });
});
