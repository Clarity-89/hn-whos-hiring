import React, { useEffect, useState } from "react";
import axios from "axios";
import { cacheAdapterEnhancer } from "axios-extensions";
import { BASE_URL } from "../../constants";
import styled from "styled-components";
import moment from "moment";

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
  const [comments, setComments] = useState([]);
  const id = "20867123";
  //const id = "20888156";

  useEffect(() => {
    const getData = async () => {
      const resp = await http.get(`/item/${id}.json`);
      setPost(resp.data);
      for (let promise of getComments(resp.data.kids)) {
        promise
          .then(resp => {
            const comment = resp.data;
            setComments(comments => [...comments, comment]);
          })
          .catch(e => {
            console.error(e);
          });
      }
    };

    getData();
  }, []);

  function* getComments(ids) {
    yield* ids.map(id => http.get(`/item/${id}.json`));
  }
  return (
    <Container>
      <div>{post.title}</div>;
      {comments
        .sort((a, b) => {
          if (a && b) {
            return b.time - a.time;
          }
          return 0;
        })
        .map(comment => {
          if (comment) {
            return (
              <div key={comment.id}>
                Posted: {moment(comment.time * 1000).format("YYYY-MM-DD HH:mm")}
                <p
                  key={comment.id}
                  // dangerouslySetInnerHTML={{ __html: comment.text }}
                >
                  {comment.text}
                </p>
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
