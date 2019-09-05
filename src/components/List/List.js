import React, { useEffect, useState } from "react";
import axios from "axios";
import { cacheAdapterEnhancer } from "axios-extensions";
import { BASE_URL } from "../../constants";
import styled from "styled-components";
import { data } from "../../data";

const http = axios.create({
  baseURL: BASE_URL,
  headers: { "Cache-Control": "no-cache" },
  // cache will be enabled by default
  adapter: cacheAdapterEnhancer(axios.defaults.adapter)
});

/**
 *
 * List
 *
 */
const List = () => {
  const [post, setPost] = useState([]);
  const [comments, setComments] = useState(data);
  const id = "20867123";

  useEffect(() => {
    const getPost = async () => {
      const resp = await http.get(`/item/${id}.json`);
      setPost(resp.data);
      // let c = [];
      // for (let kid_id of resp.data.kids) {
      //   c.push(http.get(`/item/${kid_id}.json`).then(resp => resp.data));
      // }
      //
      // Promise.all(c).then(data =>     setComments(data));
    };

    getPost();
  }, []);

  return (
    <Container>
      <div>{post.title}</div>;
      {comments.map(comment => {
        if (comment) {
          return (
            <div>
              <p key={comment.id}>{comment.text}</p>
            </div>
          );
        }
        return null;
      })}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  max-width: 1200px;
`;
export default List;
