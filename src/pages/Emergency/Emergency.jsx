import React, { useState, useEffect } from "react";
import classes from "./Emergency.module.scss";
import ClipLoader from "react-spinners/ClipLoader";

import EmergencyModal from "./EmergencyModal/EmergencyModal";
const Emergency = () => {
  const [openEmergency, setOpenEmergency] = useState(false);

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(false);
  return (
    <div className={classes.container}>
      {!list ? (
        <h1>Please click on the SOS button below to get doctor details! </h1>
      ) : (
        <div list={classes.container}></div>
      )}
      <EmergencyModal
        openEmergency={openEmergency}
        setOpenEmergency={() => setOpenEmergency(false)}
      />
      <div className={classes.stat} onClick={() => setOpenEmergency(true)}>
        SOS
      </div>
    </div>
  );
};

export default Emergency;
