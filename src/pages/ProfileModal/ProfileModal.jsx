import React, { useState } from "react";
import classes from "./ProfileModal.module.scss";
import Select from "react-select";
import { app } from "../GoogleSignIn/Firebase";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";

const ProfileModal = ({ formModal, setSignInModel }) => {
  const optionList = [
    { value: "cardiologist", label: "Cardiologist" },
    { value: "dermitologist", label: "Dermitologist" },
    { value: "urologist", label: "Urologist" },
    { value: "immunologist", label: "Immunologist" },
    { value: "neurologist", label: "Neurologist" },
  ];

  const [userObject, setUserObject] = useState({
    name: "",
    country: "",
    state: "",
    city: "",
    age: "",
    contact: "",
    email: "",
  });

  const handleInputChange = (e) => {
    setUserObject({ ...userObject, [e.target.name]: e.target.value });
  };

  const [selectedSpecialization, setSelectedSpecialization] = useState();
  const [selectedInterest, setSelectedInterest] = useState();
  const [agreement, setAgreement] = useState(false);
  const handleSpecialization = (data) => {
    setSelectedSpecialization(data);
  };
  const handleInterests = (data) => {
    setSelectedInterest(data);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let interest = [];
    let specialization = [];
    selectedInterest.forEach((element) => {
      interest = [...interest, element.value];
    });
    selectedSpecialization.forEach((element) => {
      specialization = [...specialization, element.value];
    });

    const db = getFirestore(app);
    // console.log(localStorage.getItem())
    await setDoc(doc(db, "users", localStorage.getItem("userID")), {
      ...userObject,
      specialization: interest,
      selectedInterest: specialization,
    });
    setSignInModel();
  };
  if (formModal)
    return (
      <div className={classes.overlay}>
        <div className={classes.container}>
          <h2>Welcome Doc!</h2>
          <p>Lets take some time to finish up the profile!</p>
          <form>
            <input
              type="text"
              name="name"
              value={userObject.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={userObject.country}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={userObject.state}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={userObject.city}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="age"
              placeholder="Age"
              value={userObject.age}
              onChange={handleInputChange}
            />
            <input
              type="phone"
              name="contact"
              placeholder="Contact"
              value={userObject.contact}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userObject.email}
              onChange={handleInputChange}
            />
            <Select
              className={classes.selector}
              options={optionList}
              placeholder="Select Specialization"
              value={selectedSpecialization}
              onChange={handleSpecialization}
              isSearchable={true}
              isMulti
            />
            <Select
              className={classes.selector}
              options={optionList}
              placeholder="Select Interests"
              value={selectedInterest}
              onChange={handleInterests}
              isSearchable={true}
              isMulti
            />
            <div className={classes.terms}>
              <label>
                I agree to respect my patient's privacy and make my best efforts
                in saving a life
              </label>
              <input
                type="checkbox"
                name="Agreement"
                onChange={(e) => setAgreement(e.target.checked)}
              />
            </div>
            <button
              disabled={agreement ? false : true}
              onClick={handleFormSubmit}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
};

export default ProfileModal;
