import React from "react";
import PropTypes from "prop-types";

const ButtonPair = ({ handler1, handler2, label1, label2, class1, class2 }) => {
  return (
    <div className="button-pair">
      <button className={`btn ${class1}`} onClick={handler1}>
        {label1}
      </button>
      <button className={`btn ${class2}`} onClick={handler2}>
        {label2}
      </button>
    </div>
  );
};

ButtonPair.propTypes = {
  handler1: PropTypes.func.isRequired,
  handler2: PropTypes.func.isRequired,
  label1: PropTypes.string,
  label2: PropTypes.string,
  class1: PropTypes.string,
  class2: PropTypes.string
};

ButtonPair.defaultProps = {
  handler1: null,
  handler2: null,
  label1: "",
  label2: "",
  class1: "",
  class2: ""
};

export default ButtonPair;
