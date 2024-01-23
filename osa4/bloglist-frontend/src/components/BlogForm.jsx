const BlogForm = ({ newBlogTitle, setNewBlogTitle, newBlogAuthor, setNewBlogAuthor, newBlogUrl, setNewBlogUrl, addBlog }) => {
    return (
      <form onSubmit={addBlog}>
        <div>
          Title:
          <input
            type="text"
            value={newBlogTitle}
            name="BlogTitle"
            onChange={({ target }) => setNewBlogTitle(target.value)}
          />
        </div>
        <div>
          Author:
          <input
            type="text"
            value={newBlogAuthor}
            name="BlogAuthor"
            onChange={({ target }) => setNewBlogAuthor(target.value)}
          />
        </div>
        <div>
          URL:
          <input
            type="text"
            value={newBlogUrl}
            name="BlogURL"
            onChange={({ target }) => setNewBlogUrl(target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    );
  };
  
  export default BlogForm;
  