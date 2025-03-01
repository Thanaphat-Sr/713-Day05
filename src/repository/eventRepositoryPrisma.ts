// filepath: /C:/Users/ASUS/713-Day05/src/repository/eventRepositoryPrisma.ts
import { PrismaClient, Prisma } from '@prisma/client';
import { Event, PageEvent } from '../models/event';

const prisma = new PrismaClient();

export async function getAllEventsWithOrganizerPagination(
  keyword: string,
  pageSize: number,
  pageNo: number
): Promise<PageEvent> {
  const where = {
    OR: [
      { title: { contains: keyword } },
      { description: { contains: keyword } },
      { category: { contains: keyword } },
      { organizer: { name: { contains: keyword } } }
    ]

  };

  const events = await prisma.event.findMany({
    where,
    skip: pageSize * (pageNo - 1),
    take: pageSize,
    select: {
      id: true,
      title: true,
      category: true,
      organizerId: false,
      organizer: {
        select: {
          name: true
        }
      }
    }
  });

  const count = await prisma.event.count({ where });
  return { count, events } as PageEvent;  
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

export function countEvent() {
  return prisma.event.count();
}