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

request.onsuccess = function (event) {
  // when db is successful, created object store/establish connection

  db = event.target.result;

  // check if app is online
  if (navigator.online) {
    // uploadTransactions()
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

// this will be used in add-transaction.js
function saveTransactions(newTransaction) {
  // create transaction
  const transaction = db.transaction(["Budget_Tracker", "readwrite"]);

  // access the objectStore
  const budgetObjectStore = transaction.objectStore("Budget_Tracker");

  //   add new transaction
  budgetObjectStore.add(newTransaction);
}
