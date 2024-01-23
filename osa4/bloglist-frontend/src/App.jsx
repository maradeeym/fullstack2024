import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState(null); // 'success' or 'error'
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogAuthor, setNewBlogAuthor] = useState('');
  const [newBlogUrl, setNewBlogUrl] = useState('');
  const [showBlogForm, setShowBlogForm] = useState(false);



  useEffect(() => {
    blogService
      .getAll()
      .then(initialBlogs => {
        setBlogs(initialBlogs); 
      });
  }, []);
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);
  

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      setUser(user);
      setUsername('');
      setPassword('');
      setNotificationMessage('Login successfully');
      setNotificationType('added');
      setTimeout(() => setNotificationMessage(null), 5000);
    } catch (exception) {
      setNotificationMessage('Wrong credentials');
      setNotificationType('error');
      setTimeout(() => setNotificationMessage(null), 5000);
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser'); // Updated key
    setUser(null);
    // Optionally, reset other states or redirect to a different page
  };

  const onLikeUpdate = (updatedBlog) => {
    setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog)
      .sort((a, b) => b.likes - a.likes)); // Re-sort blogs after update
  };

  const onBlogDelete = (id) => {
    blogService.remove(id)
      .then(() => {
        setBlogs(blogs.filter(blog => blog.id !== id));
      })
      .catch(error => {
        console.error('Error deleting blog:', error);
        // Handle error (e.g., show notification)
      });
  };

  const addBlog = async (event) => {
    event.preventDefault();
  
    try {
      const newBlogObject = {
        title: newBlogTitle,
        author: newBlogAuthor,
        url: newBlogUrl,
        likes: 0 // Assuming default likes is 0 for a new blog
      };
  
      const returnedBlog = await blogService.create(newBlogObject);
      setBlogs(blogs.concat(returnedBlog));
      setNotificationMessage('Blog added');
      setNotificationType('added');
      setTimeout(() => setNotificationMessage(null), 5000);
      setNewBlogTitle(''); // Clear the title input field
      setNewBlogAuthor(''); // Clear the author input field
      setNewBlogUrl(''); // Clear the url input field
      // Optional: Display a success message
    } catch (exception) {
      setNotificationMessage('Something went wrong');
      setNotificationType('error');
      setTimeout(() => setNotificationMessage(null), 5000);
    }
  };

  const toggleBlogForm = () => {
    setShowBlogForm(!showBlogForm);
  };
  
if (user === null) {
  return (
    <div>
      <Notification message={notificationMessage} type={notificationType} />
      <LoginForm 
        username={username} 
        setUsername={setUsername} 
        password={password} 
        setPassword={setPassword} 
        handleLogin={handleLogin} 
      />
    </div>
  );
}


return (
  <div>      
    <h2>Blogs</h2>
    {user && (
      <>
        <p>{user.username} logged in <button onClick={handleLogout}>Logout</button></p>
        <button onClick={toggleBlogForm}>
          {showBlogForm ? 'Hide' : 'Show'}
        </button>

        {showBlogForm && (
          <BlogForm
            newBlogTitle={newBlogTitle}
            setNewBlogTitle={setNewBlogTitle}
            newBlogAuthor={newBlogAuthor}
            setNewBlogAuthor={setNewBlogAuthor}
            newBlogUrl={newBlogUrl}
            setNewBlogUrl={setNewBlogUrl}
            addBlog={addBlog}
          />
        )}

          {blogs.map(blog => (
            <Blog key={blog.id} blog={blog} onLikeUpdate={onLikeUpdate} onBlogDelete={onBlogDelete}/>
          ))}
      </>
    )}
  </div>
);


};

export default App