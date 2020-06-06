import React, { useState } from "react";
import produce from "immer";
import { loadLists } from "../../services/api";

import BoardContext from "./context";

import { Container } from "./styles";

import List from "../List";

const data = loadLists();

export default function Board() {
  const [lists, setLists] = useState(data);

  function move(froml, tol, from, to) {
    console.log(froml, tol, from, to);
    setLists(
      produce(lists, (draft) => {
        const dragged = draft[froml].cards[from];

        draft[froml].cards.splice(from, 1);
        
        if (to === -1) {
          draft[tol].cards.push(dragged);
        } else {
          draft[tol].cards.splice(to, 0, dragged);
        }
      })
    );
  }

  return (
    <BoardContext.Provider value={{ lists, move }}>
      <Container>
        {lists.map((list, index) => (
          <List key={list.title} index={index} data={list}></List>
        ))}
      </Container>
    </BoardContext.Provider>
  );
}
