// filepath: /C:/Users/ASUS/713-Day05/src/services/eventService.ts
import { Prisma } from "@prisma/client";
import type { Event } from "../models/event";
import * as repo from "../repository/eventRepositoryPrisma";

export function getEventByCategory(category: string) {
  return repo.getEventByCategory(category);
}

export function getAllEvents() {
  return repo.getAllEventsWithOrganizer();
}

export function getEventById(id: number): Promise<Event | null> {
  return repo.getEventById(id);
}

export function addEvent(newEvent: Event) {
  const eventCreateInput: Prisma.eventCreateInput = {
    ...newEvent,
    organizer: newEvent.organizer ? { connect: { id: newEvent.organizer.id } } : undefined,
    participants: newEvent.participants ? { create: newEvent.participants.map(participant => ({ id: participant.id, name: participant.name, email: participant.email })) } : undefined
  };
  return repo.addEvent(eventCreateInput);
}

export function getAllEventsWithPagination(pageSize: number, pageNo: number) {
  return repo.getAllEventsWithOrganizerPagination(pageSize, pageNo);
}

export function count() {
  return repo.countEvent();
}