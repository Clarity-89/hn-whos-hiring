import React from "react";
import styled from "styled-components";
import { List } from "./components/List";

function App() {
  return (
    <Main>
      <List />
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export default App;
