import { PrismaClient, Prisma } from '@prisma/client';
import { Event, PageEvent } from '../models/event';

const prisma = new PrismaClient();

export async function getAllEventsWithOrganizerPagination(
  keyword: string,
  pageSize: number,
  pageNo: number
): Promise<PageEvent> {
  const where: Prisma.EventWhereInput = {
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
      description: true,
      location: true,
      date: true,
      time: true,
      petsAllowed: true,
      organizerId: true,
      organizer: {
        select: {
          id: true,
          name: true
        }
      },
      participants: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  const formattedEvents = events.map(event => ({
    ...event,
    date: event.date.toString()
  }));

  const count = await prisma.event.count({ where });
  return { count, events: formattedEvents };
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

export async function getEventById(id: number): Promise<Event | null> {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      organizer: true,
      participants: true,
    },
  });

  if (event) {
    return {
      ...event,
      date: event.date.toString(),
    };
  }

  return null;
}

export function addEvent(eventCreateInput: Prisma.EventCreateInput) {
  return prisma.event.create({
    data: eventCreateInput,
  });
}

export function countEvent() {
  return prisma.event.count();
}