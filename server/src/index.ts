import cors from "cors";
import express, { type Request, type Response } from "express";
import { create, list, remove, type NewMember } from "./store.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "jgroup-server", time: new Date().toISOString() });
});

app.get("/api/members", (_req: Request, res: Response) => {
  res.json(list());
});

app.post("/api/members", (req: Request, res: Response) => {
  const body = req.body as Partial<NewMember>;
  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    res.status(400).json({ error: "A non-empty 'name' is required." });
    return;
  }
  const role = typeof body.role === "string" ? body.role : "Member";
  const member = create({ name, role });
  res.status(201).json(member);
});

app.delete("/api/members/:id", (req: Request, res: Response) => {
  const removed = remove(req.params.id);
  if (!removed) {
    res.status(404).json({ error: "Member not found." });
    return;
  }
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`jgroup-server listening on http://localhost:${PORT}`);
});
