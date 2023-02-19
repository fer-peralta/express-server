import supertest from "supertest";
import { expect } from "chai"
import { app } from "../../src/server.js"

const request = supertest(app)

describe("Api products test", () => {
    it("Get products", async () => {
        const response = await request.get("/api/products")
        expect(response.status).equal(200)
    })
    it("Get products by id", async () => {
        const response = await request.get("/api/products/1")
        expect(response.status).equal(200)
    })
})