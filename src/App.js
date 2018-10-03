import Factory from "./components/Factory";
import React, { Component } from "react";
import update from "immutability-helper";
import connect, { emit } from "./helpers/socket";
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
      "http://localhost:5000/",
      // "https://passport-challenge-server.herokuapp.com/",
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
    handleGenerateChildren: (id, children) => {
      let state = update(this.state.tree, {
        root: {
          [id]: {
            children: {
              $set: children
            }
          }
        }
      });
      this.setState({ tree: state });
    },
    handleChangeFactoryName: (id, factory) => {
      let state = update(this.state.tree, {
        root: {
          [id]: {
            $set: factory
          }
        }
      });

      this.setState({ tree: state });
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
