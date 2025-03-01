// filepath: /C:/Users/ASUS/713-Day05/src/repository/eventRepositoryPrisma.ts
import { PrismaClient, Prisma } from '@prisma/client';
import type { Event } from '../models/event';

const prisma = new PrismaClient();

export function getAllEventsWithOrganizerPagination(
  pageSize: number,
  pageNo: number
) {
  return prisma.event.findMany({
    skip: pageSize * (pageNo - 1),
    take: pageSize,
    select: {
      id: true,
      category: true,
      organizerId: false,
      organizer: {
        select: {
          name: true
        }
      }
    }
  });
}

export function getEventByCategory(category: string) {
  return prisma.event.findMany({
    where: { category },
    include: {
      organizer: true,
      participants: true,
    },
  });
}

export function getAllEventsWithOrganizer() {
  return prisma.event.findMany({
    include: {
      organizer: true,
      participants: true,
    },
  });
}

export function getEventById(id: number): Promise<Event | null> {
  return prisma.event.findUnique({
    where: { id },
    include: {
      organizer: true,
      participants: true,
    },
  });
}

export function addEvent(eventCreateInput: Prisma.eventCreateInput) {
  return prisma.event.create({
    data: eventCreateInput,
  });
}
