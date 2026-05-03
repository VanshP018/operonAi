const auditLogs = [];

export const logEvent = (event) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    ...event,
  };

  auditLogs.push(logEntry);
  console.log("/audit", logEntry);
};

export const getLogs = () => [...auditLogs];
