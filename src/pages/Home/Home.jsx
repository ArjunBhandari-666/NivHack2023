import React from "react";
import classes from "./Home.module.scss";

const Home = () => {
  return (
    <>
      <div className={classes.container}>
        <h1>
          Welcome to <span>DocAround</span>
        </h1>
        <p>
          Bridging the gaps in communication. Meet. Greet. Grow and save lives.
        </p>
      </div>
    </>
  );
};

export default Home;
