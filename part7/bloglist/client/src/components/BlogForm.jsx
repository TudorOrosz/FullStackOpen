import { useField } from "../hooks/index.js";

const BlogForm = ({ createBlog }) => {
  const title = useField("");
  const author = useField("");
  const url = useField("");

  // the event function maybe -> go through the logic

  const addBlog = async (event) => {
    event.preventDefault();
    await createBlog({
      title: title.value,
      author: author.value,
      url: url.value,
    });

    title.reset();
    author.reset();
    url.reset();
  };

  return (
    <div>
      <h2>Create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title
            <input
              type={title.type}
              value={title.value}
              onChange={title.onChange}
              placeholder="write title here"
            />
          </label>
        </div>

        <div>
          <label>
            author
            <input
              type={author.type}
              value={author.value}
              onChange={author.onChange}
              placeholder="write author name here"
            />
          </label>
        </div>

        <div>
          <label>
            url
            <input
              type={url.type}
              value={url.value}
              onChange={url.onChange}
              placeholder="write url here"
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
