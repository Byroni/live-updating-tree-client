import React from "react";
import PropTypes from "prop-types";

const Notification = ({ type, message }) => {
  return (
    <div className={`notification ${type}`}>
      <div className={`flex-row flex-align-items-center flex-justify-center`}>
        <p>{message}</p>
      </div>
    </div>
  );
};

Notification.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

Notification.defaultProps = {
  type: "info",
  message: ""
};

export default Notification;
