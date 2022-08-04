import React from "react";
import "./Progress.css";

const Progress = ({ percent }) => {
  return (
    <div className="progress-boundary">
      <div style={{ width: `${percent}%` }}>{`${percent} %`}</div>
    </div>
  );
};

export default Progress;
