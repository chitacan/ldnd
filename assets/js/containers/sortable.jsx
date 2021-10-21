import { Providers } from "./providers";
import { memo, useCallback, useState } from "react";
import { useDrop, useDrag } from "react-dnd";

const ITEMS = [
  { id: 1, text: "🍎 Apple" },
  { id: 2, text: "🍇 Grape" },
  { id: 3, text: "🍉 Watermelon" },
  { id: 4, text: "🍑 Peach" },
  { id: 5, text: "🍌 Banana" },
  { id: 6, text: "🍍 Pineapple" },
  { id: 7, text: "🥭 Mango" }
];

const Card = memo(function Card({ id, text, moveCard, findCard }) {
  const {index: originalIndex} = findCard(id);
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "CARD",
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveCard(droppedId, originalIndex);
        } else {
          console.log("dropped", item);
        }
      },
    }),
    [id, originalIndex, moveCard]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "CARD",
      canDrop: () => false,
      hover({ id: draggedId }) {
        if (draggedId !== id) {
          const { index: overIndex } = findCard(id);
          moveCard(draggedId, overIndex);
        }
      },
    }),
    [findCard, moveCard]
  );
  return (
    <div
      ref={(node) => drag(drop(node))}
      className="border border-dashed border-gray-400 px-4 py-2 m-1 cursor-move"
      style={{ opacity: isDragging ? 0.3 : 1 }}
    >
      {text}
    </div>
  );
});

const App = memo(function App() {
  const [cards, setCards] = useState(ITEMS);
  const findCard = useCallback(
    (id) => {
      const card = cards.filter(d => d.id === +id)[0];
      return {
        card,
        index: cards.indexOf(card),
      };
    },
    [cards]
  );
  const moveCard = useCallback(
    (id, atIndex) => {
      const { card } = findCard(id);
      const removed = cards.filter(d => d.id !== id)
      const lower = removed.slice(0, atIndex)
      const upper = removed.slice(atIndex)
      setCards([...lower, card, ...upper]);
    },
    [findCard, cards, setCards]
  );
  const [, drop] = useDrop(() => ({ accept: "CARD" }));
  return (
    <div ref={drop} className="w-60 mt-4">
      {cards.map((card) => (
        <Card
          key={card.id}
          id={card.id}
          text={card.text}
          moveCard={moveCard}
          findCard={findCard}
        />
      ))}
    </div>
  );
});

export default ({ socket = {} }) => (
  <Providers socket={socket}>
    <App />
  </Providers>
);
