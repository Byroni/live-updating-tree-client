import Factory from "./components/Factory";
import React, { Component } from "react";
import update from "immutability-helper";
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
      editableFactory: {}
    };

    connect(
      SERVER_URL,
      this.eventHandler
    );
  }

  componentDidMount() {
    emit("getTree");
  }

  eventHandler = {
    handleGetTree: tree => {
      this.setState({ tree });
    },
    handleGenerateChildren: tree => {
      this.setState({ tree });
    },
    handleChangeFactoryName: tree => {
      this.setState({ tree });
    },
    handleError: err => {
      console.log(err);
    }
  };

  handleEmit(event, payload = null) {
    emit(event, payload);
  }

  renderFactories() {
    return this.state.tree.root.map(factory => {
      return (
        <Factory
          handleEmit={this.handleEmit}
          factory={factory}
          key={factory.id}
        />
      );
    });
  }

  render() {
    return (
      <div className="main">
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
    );
  }
}

export default App;
