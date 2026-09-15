import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";

const App = () => {
  const [page, setPage] = useState("authors");

  const resultAuthors = useQuery(ALL_AUTHORS);
  const resultBooks = useQuery(ALL_BOOKS);

  if (resultAuthors.error || resultBooks.error) {
    return <p>Could not load library data.</p>;
  }

  if (!resultAuthors.data || !resultBooks.data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
      </div>

      <Authors
        show={page === "authors"}
        authors={resultAuthors.data.allAuthors}
      />

      <Books show={page === "books"} books={resultBooks.data.allBooks} />

      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
