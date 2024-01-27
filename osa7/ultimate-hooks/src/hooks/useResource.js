import { useState, useEffect } from 'react';
import axios from 'axios';

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    // Fetch initial data
    const fetchData = async () => {
      const response = await axios.get(baseUrl);
      setResources(response.data);
    };
    fetchData();
  }, [baseUrl]);

  const create = async (newResource) => {
    const response = await axios.post(baseUrl, newResource);
    setResources(resources.concat(response.data));
    return response.data;
  };

  const service = {
    create,
  };

  return [resources, service];
};

export default useResource;
