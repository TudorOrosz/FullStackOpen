import { useState } from "react";
import { useApolloClient, useQuery } from "@apollo/client/react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token"),
  );
  const [page, setPage] = useState("authors");
  const resultAuthors = useQuery(ALL_AUTHORS);
  const resultBooks = useQuery(ALL_BOOKS);
  const client = useApolloClient();

  if (resultAuthors.error || resultBooks.error) {
    return <p>Could not load library data.</p>;
  }

  if (!resultAuthors.data || !resultBooks.data) {
    return <p>Loading...</p>;
  }

  const onLogout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {!token && <button onClick={() => setPage("login")}>login</button>}
        {token && <button onClick={onLogout}>logout</button>}
      </div>

      <Authors
        show={page === "authors"}
        authors={resultAuthors.data.allAuthors}
        token = {token}
      />
      <Books show={page === "books"} books={resultBooks.data.allBooks} />
      <NewBook show={page === "add"} />
      <LoginForm
        show={page === "login"}
        setToken={setToken}
        setPage={setPage}
      />
    </div>
  );
};

export default App;
