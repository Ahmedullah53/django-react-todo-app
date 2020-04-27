import React from "react";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        title: "",
        completed: false,
      },
      editing: false,
    };
  }

  componentWillMount = () => {
    this.fetchTasks();
  };

  getCookie = (name) => {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  fetchTasks = () => {
    console.log("fectcing..");
    fetch("http://127.0.0.1:8002/api/task-list")
      .then((response) => response.json())
      .then((data) => this.setState({ todoList: data }));
  };

  handleChange = (e) => {
    var name = e.target.name;
    var value = e.target.value;
    console.log("name: ", name);
    console.log("value: ", value);
    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value,
      },
    });
  };

  edit = (task) => {
    this.setState({
      activeItem: task,
      editing: true,
    });
  };

  delete = (task) => {
    const url = `http://127.0.0.1/api/task-delete/${task.id}`;
    const csrftoken = this.getCookie("csftoken");
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
    }).then((response) => {
      this.fetchTasks();
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log("ITEM:", this.state.activeItem);
    var url = "http://127.0.0.1:8002/api/task-create/";
    if (this.state.editing) {
      url = `http://127.0.0.1:8002/api/task-update/${this.state.activeItem.id}/`;
      this.setState({
        editing: false,
      });
    }
    const csrftoken = this.getCookie("csftoken");
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(this.state.activeItem),
    })
      .then((response) => {
        this.fetchTasks();
        this.setState({
          activeItem: {
            id: null,
            title: "",
            completed: false,
          },
        });
      })
      .catch((error) => {
        console.log("ERROR:", error);
      });
  };

  strikeUnstrike = (task) => {
    task.completed = !task.completed;
    const csrftoken = this.getCookie("csftoken");
    const url = `http://127.0.0.1:8002/api/task-update/${task.id}/`;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ completed: task.completed, title: task.title }),
    }).then(() => {
      this.fetchTasks();
    });

    console.log("Task Completed: ", task.completed);
  };

  render() {
    var tasks = this.state.todoList;
    return (
      <div className="container">
        <div id="task-container">
          <div id="form-wrapper">
            <form onSubmit={this.handleSubmit} id="form">
              <div className="flex-wrapper">
                <div style={{ flex: 6 }}>
                  <input
                    onChange={this.handleChange}
                    className="form-control"
                    id="title"
                    value={this.state.activeItem.title}
                    type="text"
                    name="title"
                    placeholder="Add task"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    id="submit"
                    className="btn btn-warning"
                    type="submit"
                    name="Add"
                    value="Submit"
                  />
                </div>
              </div>
            </form>
          </div>
          <div id="list-wrapper">
            {tasks.map((task, index) => (
              <div key={`todo${index}`} className="task-wrapper flex-wrapper">
                <div
                  onClick={() => this.strikeUnstrike(task)}
                  style={{ flex: 7 }}
                >
                  {task.completed ? <strike>{task.title}</strike> : task.title}
                </div>
                <div style={{ flex: 1 }}>
                  <button
                    onClick={() => this.edit(task)}
                    className="brn btn-sm btn-outline-info"
                  >
                    Edit
                  </button>
                </div>
                <div style={{ flex: 1 }}>
                  <button className="brn btn-sm btn-outline-dark delete">
                    -
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
