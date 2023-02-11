import {
  collection,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import "../css/GlobalBody.css";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const Data = () => {
  const categoryHeader = "Paper Presentation";

  //states
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [file, setFile] = useState("");
  const [uploadData, setUploadData] = useState("");
  const studentId = localStorage.getItem("studentid");
  const [uploadPercentage, setUploadPercentage] = useState("");
  const [uploadStatus, setUploadStatus] = useState("newticket");
  const [allFilled, setAllFilled] = useState(false);
  const [isUploadClicked, setIsUploadClicked] = useState(false);
  const [status, setStatus] = useState(true);
  const [categoryPoints, setCategoryPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [totalCategoryRecords, setTotalCategoryRecords] = useState(0);
  const [userMessage, setUserMessage] = useState("Loading...");
  const [fileNames, setFileNames] = useState([]);

  const weightageCalculator = () => {
    if (category === "submitted") {
      return 2;
    }
    if (category === "presented" && level === "inside") {
      return 5;
    }
    if (category === "presented" && level === "outside") {
      return 10;
    }
    if (category === "presented" && level === "premier") {
      return 20;
    }
    if (category === "prize" && level === "inside") {
      return 20;
    }
    if (category === "prize" && level === "outside") {
      return 30;
    }
    if (category === "prize" && level === "premier") {
      return 50;
    }
  };

  const dataEmptifier = () => {
    setCategory("");
    setFile("");
    setFile("");
    setUploadData("");
    setUploadPercentage("");
    setUploadData({});
  };

  useEffect(() => {
    if (category !== "empty" && category === "submitted" && file) {
      setAllFilled(true);
    } else if (
      category !== "empty" &&
      level !== "empty" &&
      category &&
      file &&
      level
    ) {
      setAllFilled(true);
    }
  }, [category, level, file]);

  //handlers
  const handleInput = (e) => {
    if (category === "submitted" && e.target.value === "empty") {
      return;
    }
    const id = e.target.id;
    const value = e.target.value;
    setUploadData({ ...uploadData, [id]: value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (categoryData + weightageCalculator() > 75) {
      alert("Maximum 75 points allowed in this category");
      dataEmptifier();
      return;
    }
    weightageCalculator();
    setIsUploadClicked(true);
    if (allFilled) {
      if (uploadStatus === "success") {
        try {
          const id = "id" + new Date().getTime();
          await setDoc(doc(db, `all/${studentId}/all`, id), {
            ...uploadData,
            weightage: weightageCalculator(),
            approval: "pending",
            fileName: file.name,
            activityCategory: categoryHeader,
            timeStamp: serverTimestamp(),
          });
        } catch (error) {
          alert(error);
        }
        setIsUploadClicked(false);
        dataEmptifier();
      }
    } else {
      alert("fill all data");
    }
    setUploadStatus("newticket");
    document.querySelector("form").reset();
  };

  useEffect(() => {
    const uploadFile = () => {
      if (fileNames.includes(file.name)) {
        alert(
          "Database already has a file with the same name. Change the file name and try again"
        );
        return;
      }
      if (studentId !== null) {
        const storageRef = ref(storage, `${studentId}/` + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            setUploadPercentage(Math.round(progress));
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is " + progress + "% done");
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            console.error(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setUploadStatus("success");
              setUploadData((prev) => ({ ...prev, pdf: downloadURL }));
            });
          }
        );
      }
    };
    file && uploadFile();
  }, [file, studentId]);

  // useEffect(() => {
  //   const unsub = onSnapshot(
  //     collection(db, `all/${studentId}/all`),
  //     (snapShot) => {
  //       let categoryList = [];
  //       let list = [];
  //       let count = 0;
  //       let fileNames = [];
  //       setCategoryPoints(0);
  //       setTotalPoints(0);
  //       snapShot.docs.forEach((doc) => {
  //         list.push({ id: doc.id, ...doc.data() });
  //         setTotalPoints((prev) => prev + doc.data().weightage);
  //         if (doc.data().activityCategory === categoryHeader) {
  //           categoryList.push({ id: doc.id, ...doc.data() });
  //           setCategoryPoints((prev) => prev + doc.data().weightage);
  //           count += 1;
  //         }
  //         fileNames.push(doc.data().fileName);
  //       });

  //       if (categoryList.length === 0) {
  //         setUserMessage("No data found");
  //       }
  //       setFileNames(fileNames);

  //       setTotalCategoryRecords(count);
  //       setData(list);
  //       setCategoryData(categoryList);
  //       setIsLoading(false);
  //       setStatus(false);
  //     },
  //     (error) => {
  //       alert("error fetching data");
  //     }
  //   );

  //   return () => {
  //     unsub();
  //   };
  // }, [status === true]);

  // const handleDelete = async (id, fileName) => {
  //   try {
  //     await deleteDoc(doc(db, `alldept/${studentDept}/years/${studentYear}/sections/${studentSection}/allStudents/${studentId}/all`, id));
  //     setStatus(true);
  //     const desertRef = ref(storage, `${studentId}/${fileName}`);
  //     deleteObject(desertRef)
  //       .then(() => {
  //         console.log("fully deleted");
  //       })
  //       .catch((error) => {
  //         alert(error);
  //       });
  //     alert("success");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <div className="nav1-container nav-body-container">
      <div className="newdata-container mb-5">
        <form className="add-newdata-form" onSubmit={handleUpload}>
          <section className="form-group">
            <label htmlFor="category" className="form-label">
              Select a category
            </label>
            <select
              name="category"
              id="category"
              className="form-select"
              onChange={(e) => {
                handleInput(e);
                setCategory(e.target.value);
              }}
            >
              <option value="empty" className="disabled-select">
                Select a value
              </option>
              <option value="submitted">Submitted</option>
              <option value="presented">Presented</option>
              <option value="prize">Prize</option>
            </select>
          </section>
          {category && category !== "submitted" && (
            <section className="form-group">
              <label htmlFor="category" className="form-label">
                Select level
              </label>
              <select
                name="level"
                id="level"
                className="form-select"
                onChange={(e) => {
                  handleInput(e);
                  setLevel(e.target.value);
                }}
              >
                <option value="empty" className="disabled-select">
                  Select a value
                </option>
                <option value="inside">Inside</option>
                <option value="outside">Outside</option>
                <option value="premier">Premier</option>
              </select>
            </section>
          )}

          <section className="form-group">
            <label htmlFor="category" className="form-label">
              Upload Proof (pdf only)
            </label>
            <input
              type="file"
              className="form-control"
              id="pdf"
              name="pdf"
              accept="application/pdf"
              onChange={(e) => {
                handleInput(e);
                setFile(e.target.files[0]);
              }}
            />
          </section>

          <section className="form-group">
            <input
              type="submit"
              className="form-control mt-3 addnew-button zoom"
              disabled={
                uploadStatus !== "success" ||
                allFilled === false ||
                isUploadClicked
              }
              value={
                uploadPercentage === ""
                  ? "Upload New"
                  : uploadPercentage !== null && uploadPercentage < 100
                  ? `uploading ${uploadPercentage} %`
                  : uploadStatus !== "success"
                  ? "Proccessing..."
                  : "Upload"
              }
            />
          </section>
        </form>
      </div>
    </div>
  );
};

export default Data;
