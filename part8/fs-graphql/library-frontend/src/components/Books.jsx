import { useState } from "react";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);

  if (!props.show) {
    return null;
  }

  const genres = [...new Set(props.books.flatMap((book) => book.genres))];
  const books = selectedGenre
    ? props.books.filter((book) => book.genres.includes(selectedGenre))
    : props.books;

  return (
    <div>
      <h2>books</h2>
      {selectedGenre && <p> in genre <b>{selectedGenre}</b></p>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => setSelectedGenre(genre)}
            type="button"
          >
            {genre}
          </button>
        ))}
        <button onClick={() => setSelectedGenre(null)} type="button">
          all genres
        </button>
      </div>
    </div>
  );
};

export default Books;
