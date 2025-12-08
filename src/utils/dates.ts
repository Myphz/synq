import type { ServerMessage } from "$lib/api/protocol";
import {
  differenceInHours,
  differenceInMinutes,
  format,
  isSameDay,
  isThisWeek,
  isThisYear,
  isYesterday,
  setDefaultOptions
} from "date-fns";
import { enGB } from "date-fns/locale";

setDefaultOptions({ locale: enGB });

const formatISOString = (date: string | undefined, fmt: string) => {
  if (!date) return "";
  return format(new Date(date), fmt);
};

export const toTime = (date?: string) => formatISOString(date, "HH:mm");
export const toDate = (date?: string) => formatISOString(date, "MMMM d");
export const toWeekDayInitials = (date?: string) => formatISOString(date, "E");

const pluralize = (
  baseName: string,
  count: number,
  plural?: string
): string => {
  if (count === 1) return baseName;
  return plural ?? `${baseName}s`;
};

type FormatUserStatusParams = Omit<
  Extract<ServerMessage, { type: "UPDATE_USER_STATUS" }>["data"],
  "lastSeen"
> & { lastSeen: string | null; exact?: boolean };

export const formatUserStatus = ({
  isOnline,
  isTyping,
  lastSeen,
  exact
}: FormatUserStatusParams): string => {
  if (isTyping) return "TYPING...";
  if (isOnline) return "ONLINE";
  if (!lastSeen) return "UNKNOWN";

  const lastSeenDate = new Date(lastSeen);
  const now = new Date();

  const minutesDiff = differenceInMinutes(now, lastSeenDate);
  const hoursDiff = differenceInHours(now, lastSeenDate);

  if (exact && isSameDay(lastSeenDate, now)) return toTime(lastSeen);

  if (minutesDiff < 1) return `just now`;

  if (minutesDiff < 60)
    return `${minutesDiff} ${pluralize("minute", minutesDiff)} ago`;

  if (hoursDiff < 24) return `${hoursDiff} ${pluralize("hour", hoursDiff)} ago`;

  if (isYesterday(lastSeenDate))
    return `yesterday at ${format(lastSeenDate, "p")}`;

  if (isThisWeek(lastSeenDate)) return `${format(lastSeenDate, "EEEE 'at' p")}`;

  if (isThisYear(lastSeenDate)) {
    return `${format(lastSeenDate, "MMM d 'at' p")}`;
  }

  // Fallback for older dates (not in current year)
  return `on ${format(lastSeenDate, "MMM d,yyyy")}`;
};
