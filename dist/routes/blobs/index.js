import express from "express";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
export function createBlobsRouter(directory, rawLimit) {
    const router = express.Router();
    router.use(express.raw({ type: "*/*", limit: rawLimit }));
    // Create
    router.post("/blobs", async (req, res) => {
        try {
            const id = crypto.randomUUID();
            const filePath = path.join(directory, id);
            await fs.writeFile(filePath, req.body);
            res.status(201).json({ id });
        }
        catch {
            res.sendStatus(500);
        }
    });
    // Read
    router.get("/blobs/:id", async (req, res) => {
        const filePath = path.join(directory, req.params.id);
        try {
            const data = await fs.readFile(filePath);
            res.type("application/octet-stream").send(data);
        }
        catch {
            res.sendStatus(404);
        }
    });
    // Update
    router.put("/blobs/:id", async (req, res) => {
        const filePath = path.join(directory, req.params.id);
        try {
            await fs.access(filePath);
            await fs.writeFile(filePath, req.body);
            res.sendStatus(204);
        }
        catch {
            res.sendStatus(404);
        }
    });
    // Delete
    router.delete("/blobs/:id", async (req, res) => {
        const filePath = path.join(directory, req.params.id);
        try {
            await fs.unlink(filePath);
            res.sendStatus(204);
        }
        catch {
            res.sendStatus(404);
        }
    });
    return router;
}
