"use strict";

const _ = require("lodash");

// Print all entries, across all of the sources, in chronological order.

module.exports = (logSources, printer) => {
  let logMap = new Map();

  for (let i = 0; i < logSources.length; i++) {
    const logSource = logSources[i];

    while (logSource.drained !== true) {
      const logEntry = logSource.pop();
      if (logEntry !== false) logMap.set(logEntry.date, logEntry);
    }
  }

  logMap = new Map(
    [...logMap.entries()].sort((a, b) => {
      return new Date(b.key).getTime() - new Date(a.key).getTime();
    })
  ).forEach((value, key, map) => {
    printer.print(value, map, count);
  });

  printer.done();

  return console.log("Sync sort complete.");
};


function sort(o) {
  return Object.keys(o)
    .sort((a,b) => new Date(a).getTime() - new Date(b).getTime()) 
    .reduce((a, k) => { 
        a[k] = o[k];
        return a;
      }, {});
}