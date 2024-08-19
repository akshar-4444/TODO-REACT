import React, { useCallback, useEffect, useState } from "react";
import "./Todolist.css";

const App = () => {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [taskFilter, setTaskFilter] = useState({
    taskName: "",
    status: "All",
  });
  const statusArray = ["New", "In Progress", "On Hold", "Completed"];

  const getTasksFromLocalStorage = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    return tasks;
  };

  const saveTasksToLocalStorage = (tasks) => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  const getTasks = useCallback(() => {
    const tasks = getTasksFromLocalStorage();
    setTaskData(tasks);
    setLoading(false);
  }, []);

  const handleCreateTask = () => {
    const newTask = {
      taskName: `New Task ${taskData.length + 1}`,
      status: "New",
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = [...taskData, newTask];
    setTaskData(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = taskData.filter((task, index) => index !== taskId);
    setTaskData(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleUpdateTask = (e, index) => {
    const updatedTasks = [...taskData];
    updatedTasks[index] = {
      ...updatedTasks[index],
      [e.target.name]: e.target.value,
    };
    setTaskData(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const handleChangeFilter = (e) => {
    const fieldKey = e.target.name;
    setTaskFilter({ ...taskFilter, [fieldKey]: e.target.value });
  };

  const filteredTasks = taskData.filter((task) => {
    const matchesName =
      taskFilter.taskName === "" ||
      task.taskName.toLowerCase().includes(taskFilter.taskName.toLowerCase());
    const matchesStatus =
      taskFilter.status === "All" || task.status === taskFilter.status;
    return matchesName && matchesStatus;
  });
  const statusToDotColor = (status) => {
    const colors = {
      New: "#336babbd",
      "In Progress": "#935ba39c",
      "On Hold": "#ff6e0094",
      Completed: "#46e429e6",
    };

    return colors[status] || "black";
  };

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  return (
    <div className="main-div-todo">
      <div className="sub-div-todo">
        {loading ? (
          <span
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            Loading...
          </span>
        ) : (
          <>
            <div
              style={{
                boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.5)",
              }}
              className="card-div-todo"
            >
              <span className="column1">
                <span className="color-dot"></span>
                <input
                  onChange={handleChangeFilter}
                  name="taskName"
                  value={taskFilter.taskName}
                  placeholder="Search Task Name"
                  className="input-task-name"
                />
              </span>

              <span className="column2">
                <select
                  onChange={handleChangeFilter}
                  name="status"
                  value={taskFilter.status}
                  style={{ borderRadius: "5px", padding: "3px", border: `1px solid black` }}
                >
                  <option value="All">All</option>
                  {statusArray.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </span>

              <span className="column3">
                <button
                  title="Create Task"
                  onClick={handleCreateTask}
                  style={{
                    whiteSpace: "nowrap",
                    backgroundColor: "transparent",
                    borderRadius: "5px",
                    border: `1px solid black`,
                  }}
                >
                  Create
                </button>
              </span>

              <span className="column4">Created At</span>
            </div>
            <div className="todo-list-data">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <div className="card-div-todo" key={index}>
                    <span className="column1">
                      <span
                        style={{
                          backgroundColor: statusToDotColor(task.status),
                          borderRadius: "50px",
                          marginLeft: "5px",
                          height: "15px",
                          width: "15px",
                        }}
                      ></span>
                      <input
                        name="taskName"
                        onBlur={(e) => handleUpdateTask(e, index)}
                        onChange={(e) => handleUpdateTask(e, index)}
                        value={task.taskName}
                        className="input-task-name"
                      />
                    </span>
                    <span className="column2">
                      <select
                        name="status"
                        onChange={(e) => handleUpdateTask(e, index)}
                        value={task.status}
                        style={{ borderRadius: "5px", padding: "3px", border: `1px solid black` }}
                      >
                        <option value="" disabled hidden>
                          Select
                        </option>
                        {statusArray.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </span>
                    <span className="column3">
                      <button
                        style={{
                          whiteSpace: "nowrap",
                          backgroundColor: "transparent",
                          borderRadius: "5px",
                          border: `1px solid black`,
                        }}
                        title="Delete"
                        onClick={() => handleDeleteTask(index)}
                      >
                        Delete
                      </button>
                    </span>
                    <span className="column4">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              ) : (
                <div
                  style={{
                    height: "90vh",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {taskFilter.taskName === "" && taskFilter.status === "All" ? (
                    <>
                      Oops You don't have any task,&nbsp;
                      <button
                        onClick={handleCreateTask}
                        style={{
                          whiteSpace: "nowrap",
                          borderRadius: "5px",
                          border: `1px solid black`,
                        }}
                      >
                        Create Task
                      </button>
                    </>
                  ) : (
                    "No task found with this filter"
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
