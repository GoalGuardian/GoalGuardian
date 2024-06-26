"use server";

import { currentUser } from "@clerk/nextjs";
import prisma from "./turso";

const MILLISECONDS_IN_A_DAY = 60 * 60 * 24 * 1000;

export async function create_event(formData: FormData) {
  const name = formData.get("title") as string;
  const description = formData.get("description") as string;
  let colorData = formData.get("color") as string;
  const color = colorData.toLowerCase(); // Convert the color to lowercase
  const location = formData.get("location") as string;
  const start = formData.get("start") as string;
  const end = formData.get("end") as string;
  const group = formData.get("group") as string;

  const dbUser = await prisma.users.findFirst({
    where: { clerkId: (await currentUser())?.id },
  });
  const organizerId = dbUser?.id || 1; // Default to 1 if the user isn't in the database

  await prisma.events.create({
    data: {
      name,
      description,
      location,
      // If we don't have an end date, we know this is an all-day event and
      // we need to add a day to the start date to make sure it is on the correct day
      start_date: end
        ? new Date(start)
        : new Date(new Date(start).getTime() + MILLISECONDS_IN_A_DAY),
      // If we have an end date, we know this isn't an all-day event
      // Otherwise, this is a single-day event and we set end_date to null
      end_date: end ? new Date(end) : null,
      color,
      organizerId,
      groupId: group !== "everyone" ? parseInt(group) : null,
    },
  });
}

export async function update_event(id: string, start: string, end: string | null) {
  await prisma.events.update({
    where: { id: parseInt(id) },
    data: {
      // If we don't have an end date, we know this is an all-day event and we need to add a day to the start date
      // to make sure it is on the correct day.
      start_date: new Date(new Date(start).getTime() + (end ? 0 : MILLISECONDS_IN_A_DAY)),
      end_date: end ? new Date(end) : null,
    },
  });
}

export async function update_event_metadata(formData: FormData) {
  const name = formData.get("title") as string;
  const description = formData.get("description") as string;
  let colorData = formData.get("color") as string;
  const color = colorData.toLowerCase(); // Convert the color to lowercase
  const location = formData.get("location") as string;
  const start = formData.get("start") as string;
  const end = formData.get("end") as string;
  const group = formData.get("group") as string;

  await prisma.events.update({
    where: { id: parseInt(formData.get("id") as string) },
    data: {
      name,
      description,
      location,
      // If we don't have an end date, we know this is an all-day event and
      // we need to add a day to the start date to make sure it is on the correct day
      start_date: end
        ? new Date(start)
        : new Date(new Date(start).getTime() + MILLISECONDS_IN_A_DAY),
      // If we have an end date, we know this isn't an all-day event
      // Otherwise, this is a single-day event and we set end_date to null
      end_date: end ? new Date(end) : null,
      color,
      groupId: group !== "everyone" ? parseInt(group) : null,
    },
  });
}