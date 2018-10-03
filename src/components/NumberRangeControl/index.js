import React, { Component } from "react";
import PropTypes from "prop-types";
import ButtonPair from "../ButtonPair";
import { validate } from "../../helpers/validator";

class NumberRangeControl extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editable: false,
      mouseHover: false,
      numNodes: 1,
      lowerBound: 1,
      upperBound: 10,
      lockGenerate: false
    };

    this.generateChildren = this.generateChildren.bind(this);
    this.flipEditable = this.flipEditable.bind(this);
    this.save = this.save.bind(this);
  }

  componentDidMount() {
    if (this.props.factory.children != null) {
      this.setState({
        numNodes: this.props.factory.children.length,
        lowerBound: Math.min(...this.props.factory.children),
        upperBound: Math.max(...this.props.factory.children)
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      !this.props.lockGenerate &&
      prevProps.lockGenerate &&
      this.state.lockGenerate
    ) {
      this.setState({ lockGenerate: false });
    }

    if (
      this.props.factory.children != null &&
      prevProps.factory.children != null
    ) {
      let lowerBound = Math.min(...this.props.factory.children);
      let prevLowerBound = Math.min(...prevProps.factory.children);
      let upperBound = Math.max(...this.props.factory.children);
      let prevUpperBound = Math.max(...prevProps.factory.children);

      if (
        this.props.factory.children.length !== prevProps.factory.children.length
      )
        this.setState({ numNodes: this.props.factory.children.length });
      if (lowerBound !== prevLowerBound)
        this.setState({ lowerBound: lowerBound });
      if (upperBound !== prevUpperBound)
        this.setState({ upperBound: upperBound });
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
    if (this.state.lockGenerate === false) {
      this.props.lockGenerateButton();
      this.setState({ lockGenerate: true });
      this.props.handleEmit("generateChildren", {
        id: this.props.factory.id,
        numNodes: this.state.numNodes,
        lowerBound: this.state.lowerBound,
        upperBound: this.state.upperBound
      });
    } else {
      this.props.renderNotification(
        "warning",
        "Waiting on previous generation to finish"
      );
    }
  }

  handleEmptyInput(keys) {
    keys.forEach(key => {
      if (this.state[key] === "") {
        this.setState({ [key]: 0 });
      }
    });
  }

  //  Handles case when lowerbound > upperbound
  handleConstraints() {
    if (
      parseInt(this.state.lowerBound, 10) > parseInt(this.state.upperBound, 10)
    ) {
      this.setState({ lowerBound: 1, upperBound: 10 });
      this.props.renderNotification(
        "warning",
        "Lower bound must not be greater than upper bound"
      );
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
                } else {
                  this.props.renderNotification(
                    "warning",
                    "# of children should be a number between 1 - 15 (invlusive)"
                  );
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
                } else {
                  this.props.renderNotification(
                    "warning",
                    "Lower bound must be a number between 1 - 999 (inclusive)"
                  );
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
                } else {
                  this.props.renderNotification(
                    "warning",
                    "Upper bound must be a number between 1 - 999 (inclusive)"
                  );
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

NumberRangeControl.propTypes = {
  renderNotification: PropTypes.func.isRequired,
  lockGenerateButton: PropTypes.func.isRequired,
  lockGenerate: PropTypes.bool.isRequired,
  factory: PropTypes.object.isRequired,
  handleEmit: PropTypes.func.isRequired
};

NumberRangeControl.defaultProps = {
  renderNotification: null,
  lockGenerateButton: null,
  lockGenerate: false,
  factory: null,
  handleEmit: null
};

export default NumberRangeControl;
