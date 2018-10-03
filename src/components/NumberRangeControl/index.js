import React, { Component } from "react";
import ButtonPair from "../ButtonPair";
import { validate } from "../../helpers/validator";

class NumberRangeControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editable: false,
      mouseHover: false,
      numNodes: 0,
      lowerBound: 0,
      upperBound: 0
    };

    this.generateChildren = this.generateChildren.bind(this);
    this.flipEditable = this.flipEditable.bind(this);
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    if (this.props.factory.children != null) {
      this.setState({
        // TODO: should only be up to 15
        numNodes: this.props.factory.children.length,
        lowerBound: Math.min(...this.props.factory.children),
        upperBound: Math.max(...this.props.factory.children)
      });
    }
  }

  validate(key) {
    return validate(key, this.state[key]);
  }

  flipEditable() {
    this.setState(prev => {
      return {
        editable: !prev.editable
      };
    });
  }

  generateChildren() {
    this.props.handleEmit("generateChildren", {
      id: this.props.factory.id,
      numNodes: this.state.numNodes,
      lowerBound: this.state.lowerBound,
      upperBound: this.state.upperBound
    });
  }

  resetNumberRangeControl() {
    this.setState({
      numNodes: this.props.factory.length,
      lowerBound: Math.min(...this.props.factory.children),
      upperBound: Math.max(...this.props.factory.children)
    });
    this.flipEditable();
  }

  handleEmptyInput(keys) {
    keys.forEach(key => {
      if (this.state[key] === "") {
        this.setState({ [key]: 0 });
      }
    });
  }

  handleConstraints() {
    if (parseInt(this.state.lowerBound) > parseInt(this.state.upperBound)) {
      this.setState({ lowerBound: 1, upperBound: 10 });
    }
  }

  save() {
    this.handleEmptyInput(["numNodes", "lowerBound", "upperBound"]);
    this.handleConstraints();
    this.flipEditable();
  }

  renderDisplay() {
    let displayText = `{Nodes: ${this.state.numNodes} 
    | Range: ${this.state.lowerBound} - ${this.state.upperBound}}`;

    if (this.state.numNodes === 0) displayText = "{Empty!}";

    return (
      <div
        className="display flex-row flex-align-items-center"
        onMouseEnter={() => {
          this.setState({ mouseHover: true });
        }}
      >
        <div>{displayText}</div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.state.editable ? (
          <div>
            <ButtonPair
              handler1={this.save}
              handler2={this.flipEditable}
              label1="save"
              label2="cancel"
              class1="btn-success"
              class2="btn-primary"
            />
            <input
              type="text"
              value={this.state.numNodes}
              onChange={e => {
                // Validator
                if (
                  validate("numNodes", e.target.value) ||
                  e.target.value === ""
                ) {
                  this.setState({ numNodes: e.target.value });
                }
              }}
            />

            <input
              type="text"
              placeholder="lower"
              value={this.state.lowerBound}
              onChange={e => {
                // Validator
                if (
                  validate("lowerBound", e.target.value) ||
                  e.target.value === ""
                ) {
                  this.setState({ lowerBound: e.target.value });
                }
              }}
            />
            <input
              type="text"
              placeholder="upper"
              value={this.state.upperBound}
              onChange={e => {
                // Validator
                if (
                  validate("upperBound", e.target.value) ||
                  e.target.value === ""
                ) {
                  this.setState({ upperBound: e.target.value });
                }
              }}
            />
          </div>
        ) : (
          <div
            className="number-range-control flex-row"
            onMouseLeave={() => {
              this.setState({ mouseHover: false });
            }}
          >
            {this.state.mouseHover && (
              <ButtonPair
                handler1={this.generateChildren}
                handler2={this.flipEditable}
                label1="generate!"
                label2="edit"
                class1="btn-success"
                class2="btn-primary"
              />
            )}
            {this.renderDisplay()}
          </div>
        )}
      </div>
    );
  }
}

// TODO: Proptypes

export default NumberRangeControl;
