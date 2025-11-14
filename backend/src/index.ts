import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import issuesRouter from "./routes/issues";
import matchRouter from "./routes/match";
import impactRouter from "./routes/impact";
import aiRouter from "./routes/ai";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Project UNITE API", version: "0.1.0" },
  },
  apis: ["./src/routes/*.ts"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/issues", issuesRouter);
app.use("/api/match", matchRouter);
app.use("/api/impact", impactRouter);
app.use("/api/ai", aiRouter);

app.get("/", (req, res) => res.json({ ok: true, message: "Project UNITE API" }));

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Emit issueUpdate events every 10 seconds
setInterval(() => {
  const mockIssue = {
    id: Math.random().toString(36).substring(7),
    title: `Issue ${Math.floor(Math.random() * 1000)}`,
    category: ["infrastructure", "healthcare", "education", "environment"][Math.floor(Math.random() * 4)],
    location: {
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
    },
    severity: Math.floor(Math.random() * 5) + 1,
    timestamp: new Date().toISOString(),
  };

  io.emit("issueUpdate", mockIssue);
  console.log(`Emitted issueUpdate:`, mockIssue);
}, 10000);

httpServer.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
  console.log(`Socket.io server ready`);
});
