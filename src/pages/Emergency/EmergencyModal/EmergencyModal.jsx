import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

import classes from "./EmergencyModal.module.scss";
import Select from "react-select";
import { optionList } from "../../../data";
import { collection, addDoc } from "firebase/firestore";

import { app } from "../../GoogleSignIn/Firebase";
import { getFirestore } from "firebase/firestore";

const EmergencyModal = ({ setOpenEmergency, openEmergency }) => {
  const [emergencyDetail, setEmergencyDetail] = useState({
    specialization: "",
    location: "",
  });
  const handleSpecialization = (data) => {
    let specialization = [];
    data.forEach((element) => {
      specialization = [...specialization, element.value];
    });
    setEmergencyDetail({
      ...emergencyDetail,
      specialization: specialization,
    });
  };

  const handleInputChange = (e) => {
    setEmergencyDetail({
      ...setEmergencyDetail,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      const db = getFirestore(app);

      const query = db.collection("users");

      querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
      });
      setOpenEmergency();
    } catch (err) {
      console.log(err);
    }
  };
  if (openEmergency)
    return (
      <div className={classes.overlay}>
        <div className={classes.container}>
          <header>
            <h1>Emergency Stat</h1>
            <AiOutlineClose
              className={classes.close}
              onClick={setOpenEmergency}
            />
          </header>
          <form>
            {/* <input
              type="text"
              name="title"
              value={emergencyDetail.title}
              onChange={handleInputChange}
              placeholder="Title"
            /> */}
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={emergencyDetail.location}
              onChange={handleInputChange}
            />

            <Select
              className={classes.selector}
              options={optionList}
              placeholder="Select field"
              onChange={handleSpecialization}
              isSearchable={true}
              isMulti
            />

            <button onClick={handleFormSubmit}>Submit</button>
          </form>
        </div>
      </div>
    );
};

export default EmergencyModal;
