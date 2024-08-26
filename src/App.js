import React, { useCallback, useEffect, useState } from "react";

const App = () => {
  const [taskData, setTaskData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [themColor, setThemeColor] = useState(localStorage.getItem("themeCOlor") ?? "#af42d7c6");
  const [taskFilter, setTaskFilter] = useState({
    taskName: "",
    status: "All",
  });
  const statusArray = ["New", "In Progress", "On Hold", "Completed"];

  const cardStyles = {
    padding: '10px',
    margin: '10px 20px',
    backgroundColor: 'white',
    borderRadius: '7px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: "5px 5px 5px rgba(0, 0, 0, 0.5)",
  };


  const inputTaskName = {
    width: "90%",
    backgroundColor: "transparent",
    border: "1px solid transparent",
    outline: "none",
    padding: "5px"
  }

  const colorDotStyle = {
    width: "15px",
    height: "15px",
    marginLeft: "5px",
    borderRadius: "50%",
    backgroundColor: "black"
  }

  const buttonStyle = {
    whiteSpace: "nowrap",
    backgroundColor: "transparent",
    borderRadius: "5px",
    border: "1px solid black"
  }

  const column1Style = {
    width: "400px",
    display: "flex",
    alignItems: "center"
  }
  const column2Style = {
    width: "150px",
    marginLeft: "5px"
  }
  const column3Style = {
    width: "100px",
    marginLeft: "5px"

  }
  const column4Style = {
    width: "150px",
    marginLeft: "5px"

  }
  const column5Style = {
    width: "200px",
    marginLeft: "5px"

  }

  const statusSelectStyle = {
    borderRadius: "5px",
    padding: '3px',
    border: "1px solid black"
  }


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

  const handleChangeTheme = (e) => {
    setThemeColor(e.target.value)
  }


  useEffect(() => {
    getTasks();
  }, [getTasks]);

  useEffect(() => {
    localStorage.setItem("themeCOlor", themColor)
  }, [themColor]);

  return (
    <div
      style={{
        backgroundColor: themColor,
        height: "100dvh",
        width: "100dvw",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <div
        style={{
          margin: '15px',
          width: '100%',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          border: '3px solid white'
        }}>

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
              style={cardStyles}>
              <span style={column1Style}>
                <span style={colorDotStyle}>

                </span>
                <input
                  onChange={handleChangeFilter}
                  name="taskName"
                  value={taskFilter.taskName}
                  placeholder="Search Task Name"
                  style={inputTaskName}
                />
              </span>

              <span style={column2Style}>
                <select
                  onChange={handleChangeFilter}
                  name="status"
                  value={taskFilter.status}
                  style={statusSelectStyle}
                >
                  <option value="All">All</option>
                  {statusArray.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </span>

              <span style={column3Style}>
                <button
                  title="Create Task"
                  onClick={handleCreateTask}
                  style={buttonStyle}
                >
                  Create
                </button>
              </span>

              <span style={column4Style}>Created At</span>
              <span style={column5Style}>
                Theme Color &nbsp;
                <input
                  value={themColor}
                  onChange={(e) => handleChangeTheme(e)}
                  type="color"
                  style={{ cursor: "pointer" }} />
                &nbsp;
                <label title="Your data and theme color are saved only at the browser level. You will lose your data if you change browser"
                  style={{ fontSize: "20px" }}>
                  ⚠️
                </label>
              </span>
            </div>
            <div style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
              overflow: "auto"
            }}>
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                  <div style={cardStyles} key={index}>
                    <span style={column1Style}>
                      <span
                        style={{
                          backgroundColor: statusToDotColor(task.status),
                          borderRadius: "50px",
                          marginLeft: "5px",
                          height: "15px",
                          width: "15px",
                        }}
                      >
                      </span>
                      <input
                        name="taskName"
                        onBlur={(e) => handleUpdateTask(e, index)}
                        onChange={(e) => handleUpdateTask(e, index)}
                        value={task.taskName}
                        style={inputTaskName}
                      />
                    </span>
                    <span style={column2Style}>
                      <select
                        name="status"
                        onChange={(e) => handleUpdateTask(e, index)}
                        value={task.status}
                        style={statusSelectStyle}
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
                    <span style={column3Style}>
                      <button
                        title="Delete"
                        onClick={() => handleDeleteTask(index)}
                        style={buttonStyle}
                      >
                        Delete
                      </button>
                    </span>
                    <span style={column4Style}>
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                    <span style={column5Style}></span>
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
                      Oops You don't have any task, &nbsp;
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
    </div >
  );
};

export default App;
