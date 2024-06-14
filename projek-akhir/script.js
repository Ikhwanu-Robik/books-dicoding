function closeWindow(caller, event) {
  event.preventDefault();
  caller.parentElement.parentElement.style.display = "none";

  let form = caller.parentElement;
  form.reset();
}

function getSiblingBook(caller) {
  let bookId = caller.nextSibling.onclick.toString();
  let arr = bookId.split("(");
  let idRaw = arr[2].split(")");
  let id = idRaw[0];
  return JSON.parse(localStorage.getItem(id));
}

function haventRead(caller) {
  let book = getSiblingBook(caller);
  let id = book.id;

  book.isComplete = false;

  uploadBook(id, book);
  deleteBookElement(id);
  document.querySelector("section.havent-read").appendChild(makeElementBook(id));
}

function haveRead(caller) {
  let book = getSiblingBook(caller);
  let id = book.id;

  book.isComplete = true;

  uploadBook(id, book);
  deleteBookElement(id);
  document.querySelector("section.have-read").appendChild(makeElementBook(id));
}

function fetchBooks() {
  const haveReadSec = document.querySelector("section.have-read");
  const haveNotReadSec = document.querySelector("section.havent-read");

  for (let key in localStorage) {
    const currentObj = JSON.parse(localStorage.getItem(key));
    if (currentObj !== null) {
      const newBook = makeElementBook(currentObj.id);
      if (currentObj.isComplete) {
        haveReadSec.appendChild(newBook);
      }
      else {
        haveNotReadSec.appendChild(newBook);
      }
    }
  }
}

function searchBook(form, event) {
  event.preventDefault();
  let query = document.getElementById("searchQuery").value;
  const bookList = document.getElementsByClassName("book");
  for (let i = 0; i < bookList.length; i++) {
    let title = bookList[i].childNodes[0].innerText;
    if (query == title) {
      document.getElementById('searchWindow').appendChild(bookList[i]);
    }
  }

  form.reset();
}

function createBook() {
  const id = +new Date();
  const title = document.getElementById("book-title").value;
  const author = document.getElementById("authorInForm").value;
  const year = document.getElementById("date-release").value;
  const isComplete = document.querySelector("#have-read:checked") ? true : false;

  const bookData = {
    id: id,
    title: title,
    author: author,
    year: year,
    isComplete: isComplete
  };

  return bookData;
}

function uploadBook(id, bookData) {
  localStorage.setItem(id.toString(), JSON.stringify(bookData));
}

function makeElementBook(id) {
  const bookData = JSON.parse(localStorage.getItem(id.toString()));
  const { title, author, year, isComplete } = bookData;

  const newBook = document.createElement("div");
  const titleSpan = document.createElement("span");
  const authorSpan = document.createElement("span");
  const yearSpan = document.createElement("span");
  const readStatButton = document.createElement("button");
  const removeButton = document.createElement("button");

  titleSpan.innerText = title;
  authorSpan.innerText = author;
  yearSpan.innerText = year;
  readStatButton.innerText = (isComplete === true) ? "Haven't Read" : "Have Read";
  readStatButton.setAttribute("onclick", (isComplete === true) ? "haventRead(this)" : "haveRead(this)");
  removeButton.innerText = "Delete Book";
  removeButton.setAttribute("onclick", "deleteBook(" + id + ")");

  newBook.appendChild(titleSpan);
  newBook.appendChild(authorSpan);
  newBook.appendChild(yearSpan);
  newBook.appendChild(readStatButton);
  newBook.appendChild(removeButton);
  newBook.setAttribute("class", "book");
  newBook.setAttribute("id", id);

  return newBook;
}

function popSearch() {
  const searchWindow = document.getElementById("searchWindow");
  searchWindow.style["display"] = "inline-block";
}

function popAddBook() {
  const searchWindow = document.getElementById("addBookWindow");
  searchWindow.style["display"] = "inline-block";
}

function addBook(form, event) {
  event.preventDefault();

  const bookData = createBook();
  const { id, isComplete } = bookData;

  uploadBook(id, bookData);

  const newBook = makeElementBook(id);

  const haveReadSec = document.querySelector("section.have-read");
  const haveNotReadSec = document.querySelector("section.havent-read");

  if (isComplete === true) {
    haveReadSec.appendChild(newBook);
  }
  else {
    haveNotReadSec.appendChild(newBook);
  }

  form.reset();
  form.parentElement.style.display = 'none';
}

function deleteBook(id) {
  deleteBookElement(id)
  localStorage.removeItem(id);
}

function deleteBookElement(id) {
  const bookElement = document.getElementById(id);
  bookElement.remove();
}