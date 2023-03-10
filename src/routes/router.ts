import { Router, static as Static } from "express";
import { connectAppDescriptor, connectDescriptorGet } from "./atlassian-connect";
import { eventsRouter } from "./events";
import { logsRouter } from "./logs";
import { webhooksRouter } from "./webhooks";
import { connectIframeJWTMiddleware } from "../middlewares/connect-iframe-jwt-middleware";
import path from "path";

export const RootRouter = Router();

// This is the Connect JSON app descriptor
RootRouter.get("/atlassian-connect.json", connectDescriptorGet);

// Public files like images and stylesheets
RootRouter.use("/public", Static(path.join(process.cwd(), "static")));

// The Connect lifecycle events as specified in the Connect JSON above
RootRouter.use("/events", eventsRouter);

// Jira webhooks we listen to as specified in the Connect JSON above
RootRouter.use("/webhooks", webhooksRouter);

// Below are the Connect Module routes which need to pass the JWT check to continue
RootRouter.use(connectIframeJWTMiddleware);

RootRouter.get("/", (_req, res) => {
	res.render("index.mst", {
		index: "Index Page",
		body: "You in the home page!"
	});
});

RootRouter.get("/config", async (_req, res) => {
	res.render("config.mst", {
		index: "Connect app descriptor",
		config: JSON.stringify(connectAppDescriptor, undefined, 2)
	});
});

RootRouter.use("/logs", logsRouter);
