import { useEffect, useState } from "react";

const api_base = "http://localhost:3001";

function App() {
  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId); 
    };
  }, []);

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      const response = await fetch(`${api_base}/todos`);
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos: ", error);
    }
  };

  const completeTodo = async (id) => {
    try {
      const response = await fetch(`${api_base}/todo/complete/${id}`);
      const data = await response.json();

      setTodos((prevTodos) =>
        prevTodos.map((todo) => {
          if (todo._id === data._id) {
            return { ...todo, complete: data.complete };
          }

          return todo;
        })
      );
    } catch (error) {
      console.log("Error completing todo: ", error);
    }
  };

  const addTodo = async () => {
    try {
      const response = await fetch(`${api_base}/todo/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newTodo,
        }),
      });
      const data = await response.json();

      setTodos((prevTodos) => [...prevTodos, data]);
      setPopupActive(false);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo: ", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${api_base}/todo/delete/${id}`, { method: "DELETE" });
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  return (
    <div className="App">
      <h1>Welcome </h1>
      <h4>Your tasks</h4>
      <h3>{currentDateTime.toLocaleString()}</h3>

      <div className="todos">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <div
              className={"todo" + (todo.complete ? " is-complete" : "")}
              key={todo._id}
              onClick={() => completeTodo(todo._id)}
            >
              <div className="checkbox"></div>

              <div className="text">{todo.text}</div>

              <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>
                x
              </div>
            </div>
          ))
        ) : (
          <p>You currently have no tasks</p>
        )}
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>
        +
      </div>

      {popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>
            X
          </div>
          <div className="content">
            <h3>Add Task</h3>
            <input
              type="text"
              className="add-todo-input"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
            />
            <div className="button" onClick={addTodo}>
              Create Task
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
