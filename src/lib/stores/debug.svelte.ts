export const latestMessageLog = $state({ log: "" });

export const setLatestMessageLog = (log: string) =>
  (latestMessageLog.log = log);
