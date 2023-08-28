import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiSolidMagicWand } from "react-icons/bi";
import { app } from "../../pages/GoogleSignIn/Firebase";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import classes from "./PostModal.module.scss";
import Select from "react-select";
import { optionList } from "../../data";
var suggestedSpecialization;
const PostModal = ({ postModal, setPostModal }) => {
  const [sidePanel, openSidePanel] = useState(false);

  const [popUp, setPopUp] = useState(false);

  const [postData, setPostData] = useState({
    title: "",
    desc: "",
    tags: [],
  });

  const handleInputChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  const callApi = async (prompt) => {
    const url =
      "https://us-central1-aiplatform.googleapis.com/v1/projects/bitwizards-niv-hackathon/locations/us-central1/publishers/google/models/text-bison:predict";
    const data = {
      instances: [{ prompt }],
      parameters: {
        temperature: 0.2,
        maxOutputTokens: 256,
        topK: 40,
        topP: 0.95,
      },
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization:
            "Bearer ya29.a0AfB_byDYMZxS3kqBOvx7gLZHCBrXGQKoXqR_faJnNU6t7QigoeI_U9ZoC5fSwfr6-owqbVtcMN-_YWGLg1sebvLhYH1DQjQOIs19nnaFTnTglZktc3tDEf0y_B90DHoVdPmvsEFTJLI9IKC8gGdiejV50zTImLo0b-WSNNPIaCgYKATUSARESFQHsvYlsxbac1DNYsHj7JQ8o9xbugA0175",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (response.ok) {
        const content = responseData.predictions[0].content;
        return content;
      } else {
        console.log(response);
        return response;
      }
    } catch (error) {
      return "An error occurred";
    }
  };

  const handleSpecialization = (data) => {
    let specialization = [];
    data.forEach((element) => {
      specialization = [...specialization, element.value];
    });
    setPostData({ ...postData, specialization: specialization });
  };

  const handleMagicButtonClick = async (magicType) => {
    var prompt = "No Response";
    if (magicType == "invitation")
      prompt =
        "I want you to generate a template for invitation to a medical event considering venue, timings and location etc while you can autofill some of the text using - " +
        postData.desc;
    else if (magicType == "requests")
      prompt =
        "I want you to generate a template for requesting to a medical professional considering specialization, topic and urgency etc while you can autofill some of the text using - " +
        postData.desc;
    else if (magicType == "facts")
      prompt =
        "I want detailed description and content for a topic. while you can autofill some of the text and context using - " +
        postData.desc +
        " Make it medically relevant.";
    var newContent = await callApi(prompt);
    setPostData({ ...postData, desc: newContent }); // Update postData with new content

    prompt =
      "Given the list of medical specializations: Cardiologist, Dermatologist, Urologist, Immunologist, Neurologist, Gastroenterologist, Endocrinologist, Pulmonologist, Pediatrician, Hepatologist, Hproctologist, Vascular Surgeon, Rheumatologists, ENT. Please analyze the medical post and choose the most relevant specialization from the list above. Only return words from the list and nothing else for who may find the most relevant specializations for who it is targeted for. Post : " +
      postData.desc;
    suggestedSpecialization = await callApi(prompt);
    setPopUp("The specialization suggested is/are :" + suggestedSpecialization);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    var prompt =
      "Answer strictly in 'yes' and 'no' if the following data is somewhat relevant as a medical post or message and has no other spam or noise in it : " +
      postData.desc;
    var newContent = await callApi(prompt);
    if (newContent == "no") {
      //ERROR. tell we found it irrelevant and reset desc and title and specialization to null and return this function
      setPopUp(
        "The data is not relevant to medical field so kindly fill it back!"
      );
    } else {
      prompt =
        "Answer strictly in 'yes' and 'no' if the following data is highly relevant as a medical post or message and has no other spam. " +
        postData.desc;
      newContent = await callApi(prompt);
      if (newContent == "yes") {
        setPopUp(
          "The data is medically relevant and has been successfully submitted!"
        );
      } else {
        setPopUp("The data is not very much relevant hence will be reviewed");
      }
      const db = getFirestore(app);

      const docRef = await addDoc(collection(db, "posts"), {
        ...postData,
      });
      console.log(docRef);
      setPostModal(false);
    }
  };

  if (postModal) {
    return (
      <div className={classes.overlay}>
        <div className={classes.container}>
          <header>
            <AiOutlineClose
              className={classes.close}
              onClick={() => setPostModal(false)}
            />
            <h1>Post on wall</h1>
          </header>
          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              name="title"
              value={postData.title}
              onChange={handleInputChange}
              placeholder="Title"
            />
            <textarea
              type="text"
              name="desc"
              placeholder="Description"
              value={postData.desc}
              onChange={handleInputChange}
            />
            <div className={classes.magicSection}>
              <BiSolidMagicWand
                className={classes.wand}
                onClick={() => openSidePanel(!sidePanel)}
              />
              {sidePanel && (
                <div className={classes.magicWand}>
                  <div onClick={() => handleMagicButtonClick("invitation")}>
                    Invitation
                  </div>
                  <div onClick={() => handleMagicButtonClick("facts")}>
                    Get Facts
                  </div>
                  <div onClick={() => handleMagicButtonClick("requests")}>
                    Request
                  </div>
                </div>
              )}
            </div>
            <Select
              className={classes.selector}
              options={optionList}
              placeholder="Select Specialization"
              onChange={handleSpecialization}
              isSearchable={true}
              isMulti
            />
            <button type="submit">Submit</button>
          </form>
        </div>
        {popUp && (
          <div className={classes.main}>
            <div className={classes.popUp}>
              {popUp}
              <button
                className={classes.button}
                onClick={() => setPopUp(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return null;
  }
};

export default PostModal;
