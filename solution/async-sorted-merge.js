"use strict";

// Print all entries, across all of the *async* sources, in chronological order.

module.exports = (logSources, printer) => {
  return new Promise((resolve, reject) => {
    resolve(printLogs(logSources, printer));
  }).then(function(){
    console.log("Async sort complete.")
  });
};

async function printLogs(logSources, printer)
{
  let logMap = new Map();

  for (let i = 0; i < logSources.length; i++) {
    const logSource = logSources[i];

    while (logSource.drained !== true) {
      const logEntry = await logSource.popAsync();
      if (logEntry !== false) logMap.set(logEntry.date, logEntry);
    }
  }

  logMap = new Map(
    [...logMap.entries()].sort((a, b) => {
      return new Date(b.key) - new Date(a.key);
    })
  ).forEach((value, key, map) => {
    printer.print(value);
  });

  printer.done();
}