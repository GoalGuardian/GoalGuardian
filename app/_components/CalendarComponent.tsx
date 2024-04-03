"use client";

import { Modal } from "flowbite";
import React from "react";
import { create_event as create_calendar_event } from "@/app/api/create-event";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import {
  EventClickArg,
  EventContentArg,
  EventInput,
} from "@fullcalendar/core/index.js";
import EventModal from "./EventModal";

interface Props {
  events: EventInput[];
  role: String;
}

export default function CalendarComponent({ events, role }: Props) {
  // TODO: Check for date creation permissions
  const handleDateClick = (arg: DateClickArg) => {
    const modalEl = document.querySelector(
      "#authentication-modal",
    ) as HTMLElement;
    const modal = new Modal(modalEl);
    const closeEl = document.querySelector(
      '[data-modal-hide="authentication-modal"]',
    ) as HTMLElement;
    const submitButton = document.querySelector(
      '[type="submit"]',
    ) as HTMLElement;

    modal.show();

    closeEl?.addEventListener("click", () => {
      modal.hide();
    });

    submitButton?.addEventListener("click", () => {
      // This now holds the event that was created
      const event = create_calendar_event(
        new FormData(modalEl!.querySelector("form") as HTMLFormElement),
      );

      modal.hide();
      // TODO: Refresh the calendar
    });
  };

  // TODO: When a user clicks an event, we should show a modal with more information
  // about the event, and allow them to edit it
  const handleEventClick = (arg: EventClickArg) => {
    console.log(arg);
  };

  return (
    <>
      {/* Only render if the user is not a player role */}
      {role != "Player" ? <EventModal /> : null}

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        events={events}
        eventContent={renderEventContent}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
      />
    </>
  );
}

function renderEventContent(eventInfo: EventContentArg) {
  const isHome = eventInfo.event.allDay;

  return (
    <div className={isHome ? "bg-indigo-200" : "bg-amber-200"}>
      <b className="mr-2 text-black">{eventInfo.timeText}</b>
      <p className="inline-block text-black">{eventInfo.event.title}</p>
    </div>
  );
}