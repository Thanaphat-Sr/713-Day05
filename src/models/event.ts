import type { Organizer } from "./organizer";
import type {Participant } from "./participant";

export interface Event {
  id: number;
  category: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  petsAllowed: boolean;
  organizerId: number | null;
  organizer: {
    id: number;
    name: string;
  } | null;
  participants: {
    id: number;
    name: string;
    email: string;
  }[];
}
export interface PageEvent {
  count: number;
  events: Event[];
}