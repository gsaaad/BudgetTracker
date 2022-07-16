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
    uploadTransactions();
  }
};

request.onerror = function (event) {
  console.log(event.target.errorCode);
};

function saveTransactions(newTransaction) {
  // create transaction
  const transaction = db.transaction(["new_Transaction", "readwrite"]);

  // access the objectStore
  const budgetObjectStore = transaction.objectStore("new_Transaction");

  //   add new transaction
  budgetObjectStore.add(newTransaction);
}

function uploadTransactions() {
  // open the transaction

  const transaction = db.transaction(["new_Transaction"], "readwrite");

  // access pending object store

  const budgetObjectStore = transaction.objectStore("new_Transaction");

  // get all records from store

  const getAllTransactions = budgetObjectStore.getAll();

  // if its success

  getAllTransactions.onsuccess = function () {
    // if there was data in indexedDB store, send to API server

    if (getAllTransactions.results.length > 0) {
      console.log("MORE THAN 0 TRANSACTIONS");

      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAllTransactions.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse);
          }
          const transaction = db.transaction(["new_Transaction", "readwrite"]);
          const budgetObjectStore = transaction.objectStore("new_Transaction");

          // clear rest of items
          budgetObjectStore.clear();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
}

window.addEventListener("online", uploadTransactions);
