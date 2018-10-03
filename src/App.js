import React, { Component } from "react";
import Factory from "./components/Factory";
import Notification from "./components/Notification";
import connect, { emit } from "./helpers/socket";
import { SERVER_URL } from "./helpers/constants";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tree: {
        root: [
          {
            id: null,
            name: "",
            children: []
          }
        ]
      },
      lockGenerate: false,
      notification: false
    };

    connect(
      SERVER_URL,
      // "http://localhost:5000",
      this.eventHandler
    );

    this.lockGenerateButton = this.lockGenerateButton.bind(this);
    this.renderNotification = this.renderNotification.bind(this);
  }

  componentDidMount() {
    emit("getTree");
  }

  eventHandler = {
    handleGetTree: tree => {
      console.log("hanlded");
      this.renderNotification("success", "tree updated!");
      this.setState({ tree });
    },
    handleUnlockGenerateButton: () => {
      this.setState({ lockGenerate: false });
    },
    handleError: err => {
      this.renderNotification("danger", err.message);
    }
  };

  handleEmit(event, payload = null) {
    emit(event, payload);
  }

  lockGenerateButton() {
    this.setState({ lockGenerate: true });
  }

  renderFactories() {
    return this.state.tree.root.map(factory => {
      return (
        <Factory
          renderNotification={this.renderNotification}
          handleEmit={this.handleEmit}
          factory={factory}
          lockGenerateButton={this.lockGenerateButton}
          lockGenerate={this.state.lockGenerate}
          key={factory.id}
        />
      );
    });
  }

  renderNotification(type, message) {
    this.setState(
      { notification: <Notification type={type} message={message} /> },
      () => {
        clearTimeout();
        setTimeout(() => {
          this.setState({ notification: null });
        }, 4000);
      }
    );
  }

  render() {
    return (
      <div>
        {this.state.notification !== null && this.state.notification}
        {this.state.tree.root[0].id === null ? (
          <h1>Loading...</h1>
        ) : (
          <div className="main">
            <div className="root">
              <div className="root-name flex-row flex-justify-center">Root</div>
              <ul>{this.renderFactories()}</ul>
              <div
                className="create-factory-btn flex-row flex-justify-center flex-align-items-center"
                onClick={() => {
                  this.handleEmit("createFactory");
                }}
              >
                +
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
