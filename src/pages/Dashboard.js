//import dependencies
import React, { useContext, useEffect, useState } from "react";
import {
  doc,
  serverTimestamp,
  setDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import "../css/Dashboard.css";
import "../css/App.css";
// import components
import Navbar from "../components/Navbar";
import Body from "../components/Body";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavComponent1 from "../components/NavComponent1";
import Data from "../components/Data";
//code
const Dashboard = () => {
  const [navId, setNavId] = useState(<NavComponent1 />);
  const [studentData, setStudentData] = useState({});
  const [studentId, setStudentId] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [isStudentIdFound, setIsStudentIdFound] = useState(true);
  const [error, setError] = useState(false);
  const pattern = /^\d{2}cs[lrt]\d{3}$/i;
  const [studentDept, setStudentDept] = useState("");
  const [studentYear, setStudentYear] = useState("");
  const [studentSection, setStudentSection] = useState("");

  const match = studentId.match(pattern);
  //this function pops up a custom success message
  const toastifySuccessHandler = (message, position, timing, theme) => {
    toast.success(message, {
      position: position,
      autoClose: timing,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: theme,
    });
  };

  //this function pops up a custom error message
  const toastifyErrorHandler = (message, position, timing, theme) => {
    toast.error(message, {
      position: position,
      autoClose: timing,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: theme,
    });
  };

  const handleUserName = async (e) => {
    e.preventDefault();
    if (!currentUser && studentData) {
      return;
    }
    try {
      if (match) {
        await setDoc(doc(db, `allUsers/${studentDept}/allYears/${studentYear}/allSections/${studentSection}/allUsers/`, currentUser.uid), {
          ...studentData,
          email: currentUser.email,
          uid: currentUser.uid,
          name: currentUser.displayName,
          timeStamp: serverTimestamp(),
        });
        toastifySuccessHandler(
          "🚀Roll Number added successfully",
          "bottom-right",
          "300",
          "colored"
        );
        localStorage.setItem("studentDept",studentDept)
        localStorage.setItem("studentSection",studentSection)
        localStorage.setItem("studentYear",studentYear)
        setError(false);
        setIsStudentIdFound(true);
      } else {
        setError("Please check your roll number");
      }
    } catch (err) {
      alert(err)
      toastifyErrorHandler(
        "Error Storing your roll number!",
        "top-right",
        "300",
        "colored"
      );
    }
  };

  useEffect(() => {
    alert(`allUsers/${localStorage.getItem("studentDept")}/allYears/${localStorage.getItem("studentYear")}/allSections/${localStorage.getItem("studentSection")}/allUsers`)
    const unsub = onSnapshot(
      collection(db, `allUsers/${localStorage.getItem("studentDept")}/allYears/${localStorage.getItem("studentYear")}/allSections/${localStorage.getItem("studentSection")}/allUsers`),
      (snapShot) => {
        setIsStudentIdFound(false);
        snapShot.docs.forEach((doc) => {
          if (doc.id === currentUser.uid) {
            console.log("found");
            console.log(doc.data());
            localStorage.setItem("studentId", doc.data().studentId);
            localStorage.setItem("studentSection", doc.data().studentSection);
            localStorage.setItem("studentYear", doc.data().studentYear);
            localStorage.setItem("studentDept", doc.data().studentDept);
            setIsStudentIdFound(true);
          }
        });
      },
      (error) => {
        toastifyErrorHandler(
          "Error fetching student data",
          "top-right",
          500,
          "colored"
        );
      }
    );

    return () => {
      unsub();
    };
  }, []);

  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value.toUpperCase();
    setStudentData({ ...studentData, [id]: value });
  };


  return (
    <div className={isStudentIdFound ? "App" : "App app-blur"}>
      {/* {navId} */}
      {!isStudentIdFound ? (
        <div className="studentId-input-container">
          <div className="studentId-input-header mb-3">
            <h3>Hey, New user!</h3>
            <p>Enter your college rollnumber and you are set to go 🚀</p>
          </div>
          <form onSubmit={handleUserName} className="studentId-input-form">
            <select
              name="studentDept"
              id="studentDept"
              required
              onChange={(e) => {
                setStudentDept(e.target.value);
                handleInput(e);
              }}
            >
              <option value="" style={{ display: "none" }}></option>
              <option value="CSE">CSE</option>
              <option value="MECH">MECH</option>
              <option value="CHEM">CHEM</option>
              <option value="ECE">ECE</option>
            </select>
            <select
              name="studentYear"
              id="studentYear"
              required
              onChange={(e) => {
                setStudentYear(e.target.value);
                handleInput(e);
              }}
            >
              <option value="" style={{ display: "none" }}></option>
              <option value="1">I</option>
              <option value="2">II</option>
              <option value="3">III</option>
              <option value="4">IV</option>
            </select>
            <select
              name="studentSection"
              id="studentSection"
              required
              onChange={(e) => {
                setStudentSection(e.target.value);
                handleInput(e);
              }}
            >
              <option value="" style={{ display: "none" }}></option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
            <input
              type="text"
              id="studentId"
              name="studentId"
              className="studentId-input"
              placeholder="Enter roll number"
              required
              onChange={(e) => {
                setStudentId(e.target.value);
                handleInput(e);
              }}
            />
            <input
              type="submit"
              value="Save"
              className="save-rollno-button button zoom"
            />
          </form>
          {error && <p className="rollno-error text-danger">{error}</p>}
        </div>
      ) : (
        <>
          <Navbar setNavId={setNavId} />
          <Data/>
          <Body navId={navId} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
