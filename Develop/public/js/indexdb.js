// database for offline
let db;

// name and version
const request = indexedDB.open("Budget_Tracker", 1);

request.onupgradeneeded = function (event) {
  // save a reference to database

  const db = event.target.result;
  // create object store/table called 'new_Transaction' auto increment

  db.createObjectStore("new_Transaction", { autoIncrement: true });
};
