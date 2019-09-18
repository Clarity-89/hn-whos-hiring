import React, { useEffect, useState } from "react";
import axios from "axios";
import { cacheAdapterEnhancer } from "axios-extensions";
import { BASE_URL } from "../../constants";
import styled from "styled-components";
import moment from "moment";
import DOMPurify from "dompurify";

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
  const [pagination, setPagination] = useState({ page: 0, pageSize: 50 });
  const id = "20867123";

  const paginate = data => {
    const { page, pageSize } = pagination;
    return data.slice(page, (page + 1) * pageSize);
  };

  useEffect(() => {
    const getData = async () => {
      const resp = await http.get(`/item/${id}.json`);

      setPost(resp.data);
      const paginatedData = paginate(resp.data.kids);
      for (let promise of getComments(paginatedData)) {
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
      <h2>{post.title}</h2>
      {!comments.length ? (
        <p>Loading ...</p>
      ) : (
        comments
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
                  <strong>
                    Posted:{" "}
                    {moment(comment.time * 1000).format("YYYY-MM-DD HH:mm")}
                  </strong>
                  <p
                    key={comment.id}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(comment.text)
                    }}
                  />
                </div>
              );
            }
            return null;
          })
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  padding: 24px;
`;
export default List;
