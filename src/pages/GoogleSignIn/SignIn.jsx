import React, { useState } from "react";
import classes from "./SignIn.module.scss";
import GoogleButton from "react-google-button";
import { FaUser } from "react-icons/fa";

// import logo from "./../../assets/logo.png";
import { useCookies } from "react-cookie";

import { app } from "./Firebase";
import { getFirestore } from "firebase/firestore";
import { auth } from "./Firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import ProfileModal from "../ProfileModal/ProfileModal";

const SignIn = ({ signInModel, setSignInModel }) => {
  const [formModal, setFormModal] = useState(false);

  //cookies for setting up the session
  const [_, setCookies] = useCookies(["access_token"]);
  const provider = new GoogleAuthProvider();

  //Initialize the firestore db
  //   const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const profileFiller = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      console.log(docSnap);
      console.log(uid);
      if (!docSnap.exists()) {
        setFormModal(true);
      } else {
        setSignInModel();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const signInWithGoogle = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      setCookies("access_token", response.user.accessToken);
      window.localStorage.setItem("userID", response.user.uid);
      //   console.log(response);
      if (response) profileFiller(response.user.uid);
      //   console.log(response.user.uid);
      // setSignInModel();
    } catch (error) {
      console.log(error);
    }
  };

  if (signInModel)
    return (
      <div className={classes.overlay}>
        <div className={classes.closeOverlay} onClick={setSignInModel} />
        <div className={classes.container}>
          <div className={classes.header}>
            <FaUser className={classes.icon} />
            <h1>Greetings !</h1>
          </div>
          <GoogleButton onClick={signInWithGoogle} />
        </div>
        <ProfileModal formModal={formModal} setSignInModel={setSignInModel} />
      </div>
    );
};

export default SignIn;
