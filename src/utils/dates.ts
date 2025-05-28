import { format } from "date-fns";

const formatISOString = (date: string | undefined, fmt: string) => {
  if (!date) return "";
  return format(new Date(date), fmt);
};

export const toTime = (date?: string) => formatISOString(date, "HH:mm");
