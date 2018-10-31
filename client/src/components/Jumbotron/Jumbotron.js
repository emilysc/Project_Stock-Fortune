import React from "react";
import "./Jumbotron.css";

const Jumbotron = (props) => (
  <div className="jumbotron text-center">
    <h1>Emily's Stock Fortune</h1>
    {props.user && <h2>Welcome back {props.user.displayName} , <a href="/auth/logout">Logout</a></h2>}
  </div>
);

export default Jumbotron;
