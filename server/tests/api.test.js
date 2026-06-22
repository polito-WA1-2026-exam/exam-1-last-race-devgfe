import request from "supertest";
import { app } from "../index.js";
import { UserLoginRequestDTO } from "../models/dto/user-dto.js"
import { ROUTES } from "../config/config.js";

describe("API Without login", () => {
    it("", async () => {
        const res = await request(app).get(ROUTES.V1_GAMES + "/ranking")
            .expect("Content-Type", /json/)
            .expect(401);

        console.log(res.body);
    });
});

describe("API /events", () => {
    let agent;

    beforeAll(async () => {
        agent = request.agent(app);
        const res = await agent.post(ROUTES.V1_AUTH)
            .send(new UserLoginRequestDTO("lucia@test.com", "password"))
            .expect(201); 
        
        console.log(res.body);
    });

    it("", async () => {
        const res = await agent.get(ROUTES.V1_EVENTS)
            .expect("Content-Type", /json/)
            .expect(200);

        console.log(res.body);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe("API /metro", () => {
    let agent;

    beforeAll(async () => {
        agent = request.agent(app);
        const res = await agent.post(ROUTES.V1_AUTH)
            .send(new UserLoginRequestDTO("lucia@test.com", "password"))
            .expect(201); 
        
        console.log(res.body);
    });

    it("", async () => {
        const res = await agent.get(ROUTES.V1_METRO + "/lines")
            .expect("Content-Type", /json/)
            .expect(200);

        console.log(res.body);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("", async () => {
        const res = await agent.get(ROUTES.V1_METRO + "/segments")
            .expect("Content-Type", /json/)
            .expect(200);

        console.log(res.body);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("", async () => {
        const res = await agent.get(ROUTES.V1_METRO + "/stations")
            .expect("Content-Type", /json/)
            .expect(200);

        console.log(res.body);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

describe.each([
    {user: new UserLoginRequestDTO("mario@test.com", "password"), expectedStatus: 200},
    {user: new UserLoginRequestDTO("luigi@test.com", "password"), expectedStatus: 200},
    {user: new UserLoginRequestDTO("lucia@test.com", "password"), expectedStatus: 404}
])("API /games", ({user, expectedStatus}) => {
    let agent;

    beforeAll(async () => {
        agent = request.agent(app);
        const res = await agent.post(ROUTES.V1_AUTH)
            .send(user)
            .expect(201); 
        
        console.log(res.body);
    });

    it("", async () => {
        const res = await agent.get(ROUTES.V1_GAMES + "/ranking")
            .expect("Content-Type", /json/)
            .expect(200);

        console.log(res.body);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it("", async () => {
        const res = await agent.get(ROUTES.V1_GAMES + "/my-best")
            .expect("Content-Type", /json/)
            .expect(expectedStatus);

        console.log(res.body);
    });
});

describe("API Route /games", () => {
    let agent;

    beforeAll(async () => {
        agent = request.agent(app);
        const res = await agent.post(ROUTES.V1_AUTH)
            .send(new UserLoginRequestDTO("lucia@test.com", "password"))
            .expect(201); 
        
        console.log(res.body);
    });

    it("", async () => {
        const res = await agent.post(ROUTES.V1_GAMES)
            .expect("Content-Type", /json/)
            .expect(200);

        console.log(res.body);
    });

    it("", async () => {
        const res = await agent.post(ROUTES.V1_GAMES + "/current")
            .expect("Content-Type", /json/)
            .expect(422);

        console.log(res.body);
    });
});