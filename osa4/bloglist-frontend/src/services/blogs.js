// services/blogs.js
import axios from 'axios';

const baseUrl = 'http://localhost:3003/api/blogs'; // Adjust this URL to match your backend API

let token = null;

const setToken = newToken => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const update = (id, newBlog) => {
  console.log("Making PUT request to:", `${baseUrl}/${id}`); // Log the URL
  const config = {
    headers: { Authorization: token },
  };

  return axios.put(`${baseUrl}/${id}`, newBlog, config)
    .then(response => response.data);
};

const create = async newBlog => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newBlog, config);
  return response.data;
};

const remove = id => {
  const config = {
    headers: { Authorization: token },
  };

  return axios.delete(`${baseUrl}/${id}`, config);
};

export default { getAll, create, setToken, update, remove };
