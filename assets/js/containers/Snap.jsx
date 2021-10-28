import { Providers } from "./providers";
import { useDragLayer, useDrag, useDrop } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useEffect, useState, memo, useCallback } from "react";

const BOXES = {
  a: { top: 20, left: 80, title: "Drag me around" },
  b: { top: 180, left: 20, title: "Drag me too" },
};

function getStyles(left, top, isDragging) {
  const transform = `translate3d(${left}px, ${top}px, 0)`;
  return {
    position: "absolute",
    transform,
    WebkitTransform: transform,
    // IE fallback: hide the real node using CSS when dragging
    // because IE will ignore our custom "empty image" drag preview.
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : "",
  };
}
const Box = memo(function Box({ title, yellow, preview }) {
  const backgroundColor = yellow ? "yellow" : "white";
  return (
    <div
      className="border border-dashed border-gray-400 cursor-move px-4 py-2"
      style={{ backgroundColor }}
      role={preview ? "BoxPreview" : "Box"}
    >
      {title}
    </div>
  );
});

const snapToGrid = (x, y) => {
  const snappedX = Math.round(x / 32) * 32;
  const snappedY = Math.round(y / 32) * 32;
  return [snappedX, snappedY];
};

function getItemStyles(initialOffset, currentOffset, isSnapToGrid) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }
  let { x, y } = currentOffset;
  if (isSnapToGrid) {
    x -= initialOffset.x;
    y -= initialOffset.y;
    [x, y] = snapToGrid(x, y);
    x += initialOffset.x;
    y += initialOffset.y;
  }
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
  };
}

const BoxDragPreview = memo(function BoxDragPreview({ title }) {
  const [tickTock, setTickTock] = useState(false);
  useEffect(
    function subscribeToIntervalTick() {
      const interval = setInterval(() => setTickTock(!tickTock), 500);
      return () => clearInterval(interval);
    },
    [tickTock]
  );
  return (
    <div className="inline-block transform -rotate-6">
      <Box title={title} yellow={tickTock} preview />
    </div>
  );
});

const CustomDragLayer = (props) => {
  const { itemType, isDragging, item, initialOffset, currentOffset } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));
  function renderItem() {
    switch (itemType) {
      case "BOX":
        return <BoxDragPreview title={item.title} />;
      default:
        return null;
    }
  }
  if (!isDragging) {
    return null;
  }
  return (
    <div className="fixed pointer-events-none z-50 left-0 top-0 w-full h-full">
      <div
        style={getItemStyles(initialOffset, currentOffset, props.isSnapToGrid)}
      >
        {renderItem()}
      </div>
    </div>
  );
};

const DraggableBox = memo(function DraggableBox(props) {
  const { id, title, left, top } = props;
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "BOX",
      item: { id, left, top, title },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top, title]
  );
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);
  return (
    <div
      ref={drag}
      style={getStyles(left, top, isDragging)}
      role="DraggableBox"
    >
      <Box title={title} />
    </div>
  );
});

const Container = ({ isSnapToGrid }) => {
  const [boxes, setBoxes] = useState(BOXES);
  const moveBox = useCallback(
    (id, left, top) => {
      setBoxes(
        Object.assign({}, boxes, {[id]: {...boxes[id], left, top}})
      );
    },
    [boxes]
  );
  const [, drop] = useDrop(
    () => ({
      accept: "BOX",
      drop(item, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset();
        let left = Math.round(item.left + delta.x);
        let top = Math.round(item.top + delta.y);
        if (isSnapToGrid) {
          [left, top] = snapToGrid(left, top);
        }
        moveBox(item.id, left, top);
        return undefined;
      },
    }),
    [moveBox]
  );
  return (
    <div ref={drop} className="w-80 h-80 border border-gray-400">
      {Object.keys(boxes).map((key) => (
        <DraggableBox key={key} id={key} {...boxes[key]} />
      ))}
    </div>
  );
};

export default ({ socket = {} }) => {
  return (
    <Providers socket={socket}>
      <Container isSnapToGrid={true} />
      <CustomDragLayer isSnapToGrid={true} />
    </Providers>
  );
};
