import React, { useState, useEffect } from "react";
import { Todo } from "./Todo";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { EditTodoForm } from "./EditTodoForm";
import axios from "axios";
import config from "../config";

export const TodoWrapper = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getTodos = async () => {
      const response = await axios.get(config.todos);
      setTodos(response.data.todos);
    };
    getTodos();
  }, []);

  const addTodo = async (todo) => {
    const response = await axios.post(config.todo, {
      todoId: uuidv4(),
      content: todo,
      isCompleted: false,
    });
    if (response.data.Message === "SUCCESS") {
      setTodos([...todos, response.data.Item]);
    }
  };

  const deleteTodo = async (id) => {
    const response = await axios.delete(config.todo, {
      params: { todoId: `${id}` },
    });
    if (response.status === 200)
      setTodos(todos.filter((todo) => todo.todoId !== id));
  };

  const toggleComplete = async (id) => {
    const response = await axios.patch(config.todoComplete, {
      todoId: id,
    });
    if (response.status === 200) {
      setTodos(
        todos.map((todo) =>
          todo.todoId === id ? { ...todo, isCompleted: true } : todo
        )
      );
    }
  };

  const editTodo = (id) => {
    console.log(id);
    setTodos(
      todos.map((todo) =>
        todo.todoId === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  const editTask = async (task, id) => {
    const response = await axios.patch(config.todo, {
      todoId: id,
      updateKey: "content",
      updateValue: task,
    });
    console.log(response);
    if (response.data.Message === "SUCCESS") {
      setTodos(
        todos.map((todo) =>
          todo.todoId === id
            ? { ...todo, content: task, isEditing: !todo.isEditing }
            : todo
        )
      );
    }
  };

  return (
    <div className="TodoWrapper">
      <h1>Get Things Done !</h1>
      <TodoForm addTodo={addTodo} />
      {/* display todos */}
      {todos.map((todo) =>
        todo.isEditing ? (
          <EditTodoForm editTodo={editTask} task={todo} />
        ) : (
          <Todo
            key={todo.todoId}
            task={todo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            toggleComplete={toggleComplete}
          />
        )
      )}
    </div>
  );
};
