// filepath: /C:/Users/ASUS/713-Day05/src/routes/eventRoute.ts
import express, { Request, Response } from "express";
import * as service from "../services/eventService";
import type { Event } from "../models/event";
const router = express.Router();

router.get("/", async (req, res) => {
  const pageSize = parseInt(req.query.pageSize as string) || 3;
  const pageNo = parseInt(req.query.pageNo as string) || 1;
  const keyword = req.query.keyword as string || '';

  try {
    const result = await service.getAllEventsWithPagination(keyword, pageSize, pageNo);

    if (result.events.length === 0) {
      res.status(404).send("No event found");
      return;
    }

    res.setHeader("x-total-count", result.count.toString());
    res.json(result.events);
  } catch (error) {
    if (pageNo < 1 || pageSize < 1) {
      res.status(400).send("Invalid pageNo or pageSize");
    } else {
      res.status(500).send("Internal Server Error");
    }
    return;
  } finally {
    console.log(`Request is completed. with pageNo=${pageNo} and pageSize=${pageSize}`);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const event = await service.getEventById(id);
    if (event) {
      res.json(event);
    } else {
      res.status(404).send("Event not found");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/", async (req, res) => {
  try {
    const newEvent: Event = req.body;
    const result = await service.addEvent(newEvent);
    res.json(result);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

export default router;