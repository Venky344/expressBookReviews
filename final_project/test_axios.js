/**
 * Demonstration Script for Tasks 10-13 using Axios
 * 
 * Task 10: Get all books using async/await with Axios
 * Task 11: Get book details by ISBN using Promises with Axios (.then / .catch)
 * Task 12: Get book details by Author using Promises with Axios (.then / .catch)
 * Task 13: Get book details by Title using async/await with Axios
 */

const {
  getBooksWithAxios,
  getBookByISBNWithAxios,
  getBooksByAuthorWithAxios,
  getBooksByTitleWithAxios
} = require('./router/general.js');

async function runAxiosTests() {
  console.log("====================================================================");
  console.log("Starting Axios Asynchronous Tests (Tasks 10 - 13)");
  console.log("====================================================================\n");

  // Task 10: Get all books using async/await
  console.log(">>> Task 10: Fetching all books using async/await with Axios...");
  try {
    const allBooks = await getBooksWithAxios();
    console.log("[Task 10 SUCCESS] Total books retrieved:", Object.keys(allBooks).length);
    console.log("[Task 10 Sample Book 1]:", JSON.stringify(allBooks["1"]));
  } catch (err) {
    console.error("[Task 10 FAILED]:", err.message);
  }
  console.log();

  // Task 11: Search by ISBN using Promises (.then / .catch)
  console.log(">>> Task 11: Fetching book by ISBN (ISBN: 2) using Promises with Axios...");
  await getBookByISBNWithAxios("2")
    .then((book) => {
      console.log("[Task 11 SUCCESS] Book retrieved for ISBN 2:");
      console.log(JSON.stringify(book));
    })
    .catch((err) => {
      console.error("[Task 11 FAILED]:", err.message);
    });
  console.log();

  // Task 12: Search by Author using Promises (.then / .catch)
  console.log(">>> Task 12: Fetching books by Author ('Jane Austen') using Promises with Axios...");
  await getBooksByAuthorWithAxios("Jane Austen")
    .then((books) => {
      console.log("[Task 12 SUCCESS] Books retrieved by Jane Austen:", books.length);
      console.log(JSON.stringify(books));
    })
    .catch((err) => {
      console.error("[Task 12 FAILED]:", err.message);
    });
  console.log();

  // Task 13: Search by Title using async/await
  console.log(">>> Task 13: Fetching books by Title ('Things Fall Apart') using async/await with Axios...");
  try {
    const booksByTitle = await getBooksByTitleWithAxios("Things Fall Apart");
    console.log("[Task 13 SUCCESS] Books retrieved for 'Things Fall Apart':", booksByTitle.length);
    console.log(JSON.stringify(booksByTitle));
  } catch (err) {
    console.error("[Task 13 FAILED]:", err.message);
  }
  console.log();

  console.log("====================================================================");
  console.log("All Axios Asynchronous Tests Completed Successfully!");
  console.log("====================================================================");
}

runAxiosTests();
