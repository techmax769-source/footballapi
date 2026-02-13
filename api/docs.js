import { successResponse } from '../lib/responseWrapper.js';

export default async function handler(req, res) {
  const docs = {
    openapi: "3.0.0",
    info: {
      title: "Max Sports API",
      version: "1.0.0",
      description: "Football Sports API powered by AllSportsAPI"
    },
    servers: [
      {
        url: "https://your-api.vercel.app",
        description: "Production server"
      }
    ],
    paths: {
      "/api/search": {
        get: {
          summary: "Search players and teams",
          parameters: [
            { name: "q", in: "query", required: true, schema: { type: "string" } },
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 20 } }
          ],
          responses: { "200": { description: "Successful response" } }
        }
      },
      "/api/trending": {
        get: {
          summary: "Get trending searches",
          responses: { "200": { description: "Successful response" } }
        }
      },
      "/api/livescore": {
        get: {
          summary: "Get live scores",
          parameters: [
            { name: "leagueId", in: "query", schema: { type: "string" } },
            { name: "countryId", in: "query", schema: { type: "string" } },
            { name: "teamId", in: "query", schema: { type: "string" } }
          ],
          responses: { "200": { description: "Successful response" } }
        }
      },
      "/api/fixtures": {
        get: {
          summary: "Get fixtures",
          parameters: [
            { name: "from", in: "query", schema: { type: "string" } },
            { name: "to", in: "query", schema: { type: "string" } },
            { name: "leagueId", in: "query", schema: { type: "string" } },
            { name: "teamId", in: "query", schema: { type: "string" } },
            { name: "timezone", in: "query", schema: { type: "string" } },
            { name: "withPlayerStats", in: "query", schema: { type: "boolean" } },
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 20 } }
          ],
          responses: { "200": { description: "Successful response" } }
        }
      },
      "/api/standings": {
        get: {
          summary: "Get league standings",
          parameters: [
            { name: "leagueId", in: "query", required: true, schema: { type: "string" } }
          ],
          responses: { "200": { description: "Successful response" } }
        }
      },
      "/api/leagues": {
        get: {
          summary: "Get leagues",
          parameters: [
            { name: "countryId", in: "query", schema: { type: "string" } }
          ],
          responses: { "200": { description: "Successful response" } }
        }
      },
      "/api/countries": {
        get: {
          summary: "Get countries",
          responses: { "200": { description: "Successful response" } }
        }
      },
      "/api/teams": {
        get: {
          summary: "Get teams",
          parameters: [
            { name: "leagueId", in: "query", schema: { type: "string" } },
            { name: "teamId", in: "query", schema: { type: "string" } }
          ],
          responses: { "200": { description: "Successful response" } }
        }
      },
      "/api/players": {
        get: {
          summary: "Get players",
          parameters: [
            { name: "playerId", in: "query", schema: { type: "string" } },
            { name: "playerName", in: "query", schema: { type: "string" } }
          ],
          responses: { "200": { description: "Successful response" } }
        }
      },
      "/api/h2h": {
        get: {
          summary: "Get head to head",
          parameters: [
            { name: "firstTeamId", in: "query", required: true, schema: { type: "string" } },
            { name: "secondTeamId", in: "query", required: true, schema: { type: "string" } }
          ],
          responses: { "200": { description: "Successful response" } }
        }
      },
      "/api/topscorers": {
        get: {
          summary: "Get top scorers",
          parameters: [
            { name: "leagueId", in: "query", required: true, schema: { type: "string" } }
          ],
          responses: { "200": { description: "Successful response" } }
        }
      },
      "/api/odds-live": {
        get: {
          summary: "Get live odds",
          responses: { "200": { description: "Successful response" } }
        }
      },
      "/api/odds-full": {
        get: {
          summary: "Get full odds",
          parameters: [
            { name: "matchId", in: "query", required: true, schema: { type: "string" } }
          ],
          responses: { "200": { description: "Successful response" } }
        }
      },
      "/api/probabilities": {
        get: {
          summary: "Get match probabilities",
          parameters: [
            { name: "matchId", in: "query", required: true, schema: { type: "string" } }
          ],
          responses: { "200": { description: "Successful response" } }
        }
      },
      "/api/videos": {
        get: {
          summary: "Get match videos",
          parameters: [
            { name: "eventId", in: "query", required: true, schema: { type: "string" } }
          ],
          responses: { "200": { description: "Successful response" } }
        }
      },
      "/api/health": {
        get: {
          summary: "Health check",
          responses: { "200": { description: "Healthy" } }
        }
      }
    }
  };
  
  return res.status(200).json(successResponse(docs));
}
