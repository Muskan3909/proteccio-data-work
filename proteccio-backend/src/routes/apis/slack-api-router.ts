import express from "express";

const slackApiRouter = express.Router();

slackApiRouter.get("/status", (_req, res) => {
  res.status(200).send({ connected: false });
});

slackApiRouter.get("/channel-configs/project/:projectId", (_req, res) => {
  res.status(200).send({ ok: true, body: [] });
});

export default slackApiRouter;
