import { ME } from "../queries";
import { useQuery } from "@apollo/client/react";

const Recommended = (props) => {
  const resultME = useQuery(ME, { skip: !props.show });

  if (!props.show) {
    return null;
  }

  if (resultME.error) {
    return <p>Could not load data.</p>;
  }

  if (resultME.loading || !resultME.data) {
    return <p>Loading...</p>;
  }

  const favoriteGenre = resultME.data.me?.favoriteGenre;

  if (!favoriteGenre) {
    return <div>You do not have a favorite Genre set dude</div>;
  }

  const books = props.books.filter((book) =>
    book.genres.includes(favoriteGenre),
  );

  return (
    <div>
      <h2>reccomendations</h2>
      <p>
        {" "}
        books in your favourite genre <b>{favoriteGenre}</b>
      </p>
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
    </div>
  );
};

export default Recommended;
