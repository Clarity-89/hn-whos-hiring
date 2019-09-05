import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../constants";

/**
 *
 * List
 *
 */
const List = () => {
  const [post, setPost] = useState([]);
  const id = "20867123";

  useEffect(() => {
    const getItems = async () => {
      const resp = await axios.get(`${BASE_URL}/item/${id}.json`);
      setPost(resp.data);
    };

    getItems();
  }, []);

  return <div>{post.title}</div>;
};

export default List;
