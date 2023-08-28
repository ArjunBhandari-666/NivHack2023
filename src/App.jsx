import { useState } from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import { useCookies } from "react-cookie";

import Home from "./pages/Home/Home";
import Forums from "./pages/Forums/Forums";
import Emergency from "./pages/Emergency/Emergency";

function App() {
  const [cookies] = useCookies(["access_token"]);
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {!cookies.access_token ? (
            <>
              <Route path="/" element={<Home />} />
              {/* <Route path="/about" element={<About />} /> */}
            </>
          ) : (
            <>
              <Route path="/" element={<Forums />} />
              <Route path="/emergency" element={<Emergency />} />
              {/* <Route path="/myrecipes" element={<MyRecipe />} />
              <Route path="/myrecipes/:id" element={<Recipe />} /> */}
            </>
          )}
        </Routes>

        {/* <SignIn /> */}
      </BrowserRouter>
    </>
  );
}

export default App;
