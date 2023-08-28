import React, { useState } from "react";
import "./Navbar.scss";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineClose } from "react-icons/ai";
import { useCookies } from "react-cookie";

import { NavLink, useNavigate } from "react-router-dom";
import SignIn from "../../pages/GoogleSignIn/SignIn";
const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  const [signInModel, setSignInModel] = useState(false);
  const [cookies, setCookies, removeCookies] = useCookies(["access_token"]);

  const logout = () => {
    removeCookies("access_token");
    window.localStorage.removeItem("userID");
    setToggle(false);
  };

  return (
    <div className="navbar">
      <div className="nav-info">
        <img src="./favicon.png"></img>
        <h1>DocAround</h1>
      </div>
      <div className="nav-items">
        {!cookies.access_token ? (
          <>
            <NavLink to="/" className="nav-item">
              Home
            </NavLink>
            {/* <NavLink to="/about" className="nav-item">
              About
            </NavLink> */}

            <NavLink onClick={() => setSignInModel(true)}>
              <button>Login</button>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/" className="nav-item">
              Forums
            </NavLink>
            <NavLink to="/emergency" className="nav-item">
              Emergency
            </NavLink>
            <NavLink to="/message" className="nav-item">
              Message
            </NavLink>
            <NavLink to="/">
              <button onClick={logout}>Logout</button>
            </NavLink>
          </>
        )}
      </div>
      {toggle ? (
        <div className="nav-mobile">
          <div className="mobile-card">
            {!cookies.access_token ? (
              <>
                <NavLink
                  to="/"
                  className="nav-mob"
                  onClick={() => {
                    setToggle(false);
                  }}
                >
                  Home
                </NavLink>
                {/* <NavLink
                  to="/about"
                  className="nav-mob"
                  onClick={() => {
                    setToggle(false);
                  }}
                >
                  About
                </NavLink> */}

                <NavLink
                  to="/login"
                  onClick={(e) => {
                    setSignInModel(true);
                    setToggle(false);
                  }}
                >
                  <button>Login</button>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/"
                  className="nav-mob"
                  onClick={() => setToggle(false)}
                >
                  Forums
                </NavLink>
                <NavLink
                  to="/myrecipes"
                  className="nav-mob"
                  onClick={() => setToggle(false)}
                >
                  Emergency
                </NavLink>
                <NavLink
                  to="/fav"
                  className="nav-mob"
                  onClick={() => setToggle(false)}
                >
                  Message
                </NavLink>

                <NavLink to="/">
                  <button onClick={logout}>Logout</button>
                </NavLink>
              </>
            )}
          </div>
          <AiOutlineClose
            className={`close`}
            onClick={() => setToggle(false)}
          />
        </div>
      ) : (
        ""
      )}
      <GiHamburgerMenu
        className={`ham ${toggle ? "" : "active"}`}
        onClick={() => setToggle(true)}
      />
      <SignIn
        signInModel={signInModel}
        setSignInModel={() => setSignInModel(false)}
      />
    </div>
  );
};

export default Navbar;
