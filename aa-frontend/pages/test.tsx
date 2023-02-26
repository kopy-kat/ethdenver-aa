import type { NextPage } from "next";

import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

interface Todo {
  id: number;
  name: string;
  status: Status;
  isDone: boolean;
}

enum Status {
  Backlog,
  Active,
  Done,
}

enum TodosStatus {
  BacklogTodos = "BacklogTodos",
  ActiveTodos = "ActiveTodos",
  CompletedTodos = "CompletedTodos",
}

interface PluginProps {
  index: number;
  plugin: Todo;
  dragEnabled: boolean;
}

const PluginItem: React.FC<PluginProps> = ({ index, plugin, dragEnabled }) => {
  if (!dragEnabled) {
    return (
      <div className="flex rounded-md bg-yellow-300  w-full p-[20px] mt-[15px]">
        {plugin.name}
      </div>
    );
  }

  return (
    <Draggable draggableId={plugin.id.toString()} index={index} key={plugin.id}>
      {(draggableProvided, draggableSnapshot) => (
        <div
          className="flex rounded-md bg-yellow-300  w-full p-[20px] mt-[15px] transition hover:scale-105 hover:shadow-md"
          {...draggableProvided.draggableProps}
          {...draggableProvided.dragHandleProps}
          ref={draggableProvided.innerRef}
        >
          {plugin.name}
        </div>
      )}
    </Draggable>
  );
};

const Home: NextPage = () => {
  const [backlogTodos, setBacklogTodos] = useState<Todo[]>([]);
  const [activeTodos, setActiveTodos] = useState<Todo[]>([]);

  useEffect(() => {
    let parsed: Todo[] = [
      {
        id: 1677348790221,
        name: "yo",
        status: 0,
        isDone: false,
      },
    ];
    let parsed2: Todo[] = [
      {
        id: 1677348790222,
        name: "yo2",
        status: 0,
        isDone: false,
      },
    ];
    setBacklogTodos(parsed);
    setActiveTodos(parsed2);
  }, []);

  const onDragEndHandler = (result: DropResult) => {
    const { destination, source } = result;
    console.log(source, destination)

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;


    let add = backlogTodos[source.index];
    backlogTodos.splice(source.index, 1);

    if (add) {
      activeTodos.splice(destination.index, 0, add);
    }

    setBacklogTodos(backlogTodos);
    setActiveTodos(activeTodos);
  };

  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <div className="">
        <div className="flex flex-col items-center  min-h-screen pt-10">
          <div className="grid grid-cols-1 w-full gap-6 mt-4 lg:grid-cols-3">
            <Droppable droppableId={TodosStatus.BacklogTodos}>
              {(droppableProvided, droppableSnapshot) => (
                <div
                  className="bg-gray-400 px-5 py-3 rounded-md"
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                >
                  <span className="text-white text-2xl font-semibold">
                    Backlog
                  </span>
                  {backlogTodos?.map((todo, index) => (
                    <PluginItem
                      index={index}
                      key={todo?.id}
                      plugin={todo}
                      dragEnabled={true}
                    />
                  ))}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
            <Droppable droppableId={TodosStatus.ActiveTodos}>
              {(droppableProvided, droppableSnapshot) => (
                <div
                  className={`bg-blue-400 px-5 py-3 rounded-md ${
                    droppableSnapshot.isDraggingOver ? "opacity-80" : ""
                  }`}
                  ref={droppableProvided.innerRef}
                  {...droppableProvided.droppableProps}
                >
                  <span className="text-white text-2xl font-semibold">
                    Active
                  </span>
                  {activeTodos?.map((todo, index) => (
                    <PluginItem
                      index={index}
                      key={todo?.id}
                      plugin={todo}
                      dragEnabled={false}
                    />
                  ))}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Home;
