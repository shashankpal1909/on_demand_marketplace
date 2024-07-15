// src/components/Grid.tsx
import type React from "react";
import { useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Item {
  id: number;
  text: string;
}

interface CellProps {
  cellId: number;
  items: Item[];
  moveItem: (itemId: number, targetCellId: number) => void;
}

const Cell: React.FC<CellProps> = ({ cellId, items, moveItem }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "ITEM",
    drop: (item: { id: number }) => {
      moveItem(item.id, cellId);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <td
      ref={drop}
      className={`p-4 border border-gray-300 ${isOver ? "bg-blue-200" : ""}`}
    >
      {items.map((item) => (
        <DraggableItem key={item.id} item={item} />
      ))}
    </td>
  );
};

interface DraggableItemProps {
  item: Item;
}

const DraggableItem: React.FC<DraggableItemProps> = ({ item }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "ITEM",
    item: { id: item.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-2 border border-gray-500 ${isDragging ? "opacity-50" : ""}`}
    >
      {item.text}
    </div>
  );
};

const Grid: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, text: "Item 1" },
    { id: 2, text: "Item 2" },
    { id: 3, text: "Item 3" },
  ]);

  const [grid, setGrid] = useState<number[][]>([]);

  // Initialize the grid with empty arrays for each cell
  useEffect(() => {
    const rows = 3;
    const cols = 3;
    const initialGrid: number[][] = Array.from(
      { length: rows * cols },
      () => [],
    );
    setGrid(initialGrid);
  }, []);

  const moveItem = (itemId: number, targetCellId: number) => {
    const sourceCellId = grid.findIndex((cell) => cell.includes(itemId));
    if (sourceCellId !== targetCellId) {
      setGrid((prevGrid) => {
        const newGrid = prevGrid.map((cell) =>
          cell.filter((id) => id !== itemId),
        );
        newGrid[targetCellId].push(itemId);
        return newGrid;
      });
    }
  };

  const addItem = (text: string) => {
    const newItem: Item = { id: items.length + 1, text };
    setItems((prevItems) => [...prevItems, newItem]);
    // Adding the new item to the first cell by default
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[0].push(newItem.id);
      return newGrid;
    });
  };

  const [newItemText, setNewItemText] = useState("");

  // Generate a 3x3 grid for demonstration purposes
  const rows = 3;
  const cols = 3;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-grow flex-col">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newItemText.trim() !== "") {
              addItem(newItemText);
              setNewItemText("");
            }
          }}
          className="mb-4"
        >
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            className="p-2 border border-gray-300 mr-2"
            placeholder="New Item Text"
          />
          <button type="submit" className="p-2 bg-blue-500 text-white">
            Add Item
          </button>
        </form>

        <table className="w-full h-full table-fixed border-collapse">
          <tbody>
            {Array.from({ length: rows }, (_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: cols }, (_, colIndex) => {
                  const cellId = rowIndex * cols + colIndex;
                  return (
                    <Cell
                      key={cellId}
                      cellId={cellId}
                      items={
                        grid[cellId]
                          ? grid[cellId].map(
                              (itemId) =>
                                items.find((item) => item.id === itemId)!,
                            )
                          : []
                      }
                      moveItem={moveItem}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DndProvider>
  );
};

export default Grid;
