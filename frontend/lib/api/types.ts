import type { components } from "./schema";

type Schemas = components["schemas"];

export type Session = Schemas["SessionOut"];
export type SamplePatient = Schemas["SamplePatient"];
export type CalendarDay = Schemas["CalendarOut"];
export type CalendarAppointment = Schemas["CalendarAppointment"];
export type CallSettings = Schemas["CallStartOut"];
export type Language = CallSettings["language"];