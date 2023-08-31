/**Test company routes modified from example code in "Intro to Postress with Node" */
/** GET /companies - returns `{companies: [company, ...]}` */
const app = require("../app.js");
const request = require("supertest");

describe("GET /companies", function() {
    test("Gets a list of 2 companies", async function() {
      const response = await request(app).get(`/companies`);
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
            companies:[{"code":"apple","name":"Apple Computer"},{"code":"ibm","name":"IBM"}]
        });
    });
  });