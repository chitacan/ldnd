import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useSocketPush, useSocketHandle } from "../hooks/live_socket";
import { Providers } from "./providers";

const Box = ({ name }) => {
  const [item, setItem] = useState(null);
  useSocketPush(["dropped", item], {
    refetchOnWindowFocus: false,
    enabled: item !== null,
  });
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "BOX",
    item: { name },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        console.log(item);
        setItem({ item, dropResult });
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }), [name]);

  return (
    <div
      ref={drag}
      role="Box"
      className="border border-dashed border-gray-400 m-2 p-1 w-min cursor-move float-left"
      style={{ opacity: isDragging ? 0.4 : 1 }}
      data-testid={`box-${name}`}
    >
      {name}
    </div>
  );
};

const Dustbin = () => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "BOX",
    drop: () => ({ name: "Dustbin" }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));
  const isActive = canDrop && isOver;
  let backgroundColor = "#222";
  if (isActive) {
    backgroundColor = "darkgreen";
  } else if (canDrop) {
    backgroundColor = "darkkhaki";
  }
  return (
    <div
      ref={drop}
      role="Dustbin"
      className="w-40 h-40 m-6 p-4 text-base text-white"
      style={{ backgroundColor }}
    >
      {isActive ? "Release to drop" : "Drag a box here"}
    </div>
  );
};

const App = () => {
  const [boxes] = useSocketHandle("boxes", ["Glass", "Banana", "Paper"]);
  return (
    <div>
      <div>
        <Dustbin />
      </div>
      <div>
        {boxes.map((box, i) => (
          <Box key={i} name={box} />
        ))}
      </div>
    </div>
  );
};

export default ({ socket = {} }) => {
  return (
    <Providers socket={socket}>
      <App />
    </Providers>
  );
};
