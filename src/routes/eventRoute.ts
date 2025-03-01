// filepath: /C:/Users/ASUS/713-Day05/src/routes/eventRoute.ts
import express, { Request, Response } from "express";
import * as service from "../services/eventService";
import type { Event } from "../models/event";
const router = express.Router();

router.get("/", async (req, res) => {
  const pageSize = parseInt(req.query.pageSize as string) || 3;
  const pageNo = parseInt(req.query.pageNo as string) || 1;
  const keyword = req.query.keyword as string || '';
  const result = await service.getAllEventsWithPagination(keyword, pageSize, pageNo);

  res.setHeader("x-total-count", result.count.toString());
  res.json(result.events);
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const event = await service.getEventById(id);
  if (event) {
    res.json(event);
  } else {
    res.status(404).send("Event not found");
  }
});

router.post("/", async (req, res) => {
  const newEvent: Event = req.body;
  const result = await service.addEvent(newEvent);
  res.json(result);
});

export default router;