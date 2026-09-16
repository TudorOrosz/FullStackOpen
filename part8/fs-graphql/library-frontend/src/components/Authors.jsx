import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_AUTHOR, ALL_AUTHORS, ALL_BOOKS } from "../queries";

const Authors = (props) => {
  const [authorName, setAuthorName] = useState("");
  const [birthYear, setBirthYear] = useState("");

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
  });

  if (!props.show) {
    return null;
  }

  const authors = props.authors;

  const submit = async (event) => {
    event.preventDefault();

    console.log("update author...");
    updateAuthor({
      variables: { name: authorName, setBornTo: Number(birthYear) },
    });

    setAuthorName("");
    setBirthYear("");
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={authorName}
            onChange={({ target }) => setAuthorName(target.value)}
          />
        </div>
        <div>
          born
          <input
            value={birthYear}
            onChange={({ target }) => setBirthYear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default Authors;
