import React, { useContext } from "react";
import { useDrop } from "react-dnd";

import { MdAdd } from "react-icons/md";

import { Container } from "./styles";

import BoardContext from "../Board/context";
import Card from "../Card";

export default function List({ data, index: listIndex }) {
  const { move } = useContext(BoardContext);

  const [, dropRef] = useDrop({
    accept: "CARD",
    hover(item, monitor) {
      if (data.cards.length !== 0) return;

      const draggedListIndex = item.listIndex;
      const targetListIndex = listIndex;

      const draggedIndex = item.index;

      move(draggedListIndex, targetListIndex, draggedIndex, -1);

      item.index = 0;
      item.listIndex = targetListIndex;
    },
  });

  return (
    <Container ref={dropRef} done={data.done}>
      <header>
        <h2>{data.title}</h2>
        {data.creatable && (
          <button type="button">
            <MdAdd size={24} color="#fff" />
          </button>
        )}
      </header>

      <ul>
        {data.cards.map((card, index) => (
          <Card key={card.id} listIndex={listIndex} index={index} data={card} />
        ))}
      </ul>
    </Container>
  );
}
