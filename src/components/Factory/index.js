import React, { Component } from "react";
import PropTypes from "prop-types";
import ButtonPair from "../ButtonPair";
import NumberRangeControl from "../NumberRangeControl";

class Factory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editable: false,
      mouseHover: false,
      name: ""
    };

    this.flipEditable = this.flipEditable.bind(this);
    this.deleteFactory = this.deleteFactory.bind(this);
    this.changeFactoryName = this.changeFactoryName.bind(this);
  }

  componentDidMount() {
    this.setState({ name: this.props.factory.name });
    this.input = null;
  }

  componentDidUpdate() {
    if (this.input != null) this.input.focus();
  }

  flipEditable() {
    this.setState(prev => {
      return { editable: !prev.editable };
    });
  }
  renderChildren() {
    return this.props.factory.children.map((child, i) => {
      return <li key={i}>{child}</li>;
    });
  }

  deleteFactory() {
    this.props.handleEmit("deleteFactory", { id: this.props.factory.id });
  }

  changeFactoryName() {
    this.props.handleEmit("changeFactoryName", {
      name: this.state.name
    });
    this.flipEditable();
  }

  renderFactoryHeader() {
    return (
      <div className="header">
        <div className="flex-row flex-justify-center flex-align-items-center flex-justify-space-between flex-wrap">
          {this.state.editable ? (
            <div className="flex-row">
              <input
                ref={input => {
                  this.input = input;
                }}
                className="editable"
                type="text"
                maxLength="20"
                value={this.state.name}
                onChange={e => {
                  this.setState({ name: e.target.value });
                }}
              />
              <ButtonPair
                handler1={this.changeFactoryName}
                handler2={this.flipEditable}
                label1="save"
                label2="cancel"
                class1="btn-success"
                class2="btn-danger"
              />
            </div>
          ) : (
            <div
              className="flex-row flex-align-items-center"
              onMouseLeave={() => {
                this.setState({ mouseHover: false });
              }}
            >
              <div
                className="display-name"
                onMouseEnter={() => {
                  this.setState({ mouseHover: true });
                }}
              >
                {this.props.factory.name}
              </div>
              {this.state.mouseHover && (
                <ButtonPair
                  handler1={this.flipEditable}
                  handler2={this.deleteFactory}
                  label1="edit"
                  label2="delete"
                  class1="btn-primary"
                  class2="btn-danger"
                />
              )}
            </div>
          )}
          <NumberRangeControl
            factory={this.props.factory}
            handleEmit={this.props.handleEmit}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <li className="factory flex-column">
        {this.renderFactoryHeader()}
        <ul className="children flex-row flex-justify-space-around flex-wrap">
          {this.props.factory.children != null && this.renderChildren()}
        </ul>
      </li>
    );
  }
}

Factory.propTypes = {
  handleEmit: PropTypes.func.isRequired,
  factory: PropTypes.object.isRequired
};

Factory.defaultProps = {
  handleEmit: null,
  factory: null
};
export default Factory;
