import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Box = ({ name }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "BOX",
    item: { name },
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        alert(`You dropped ${item.name} into ${dropResult.name}!`);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  return (
    <div
      ref={drag}
      role="Box"
      className="border border-dashed border-gray-400 m-2 p-1 w-min cursor-move"
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

export default SingleTarget = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div>
          <Dustbin />
        </div>
        <div>
          <Box name="Glass" />
          <Box name="Banana" />
          <Box name="Paper" />
        </div>
      </div>
    </DndProvider>
  );
};