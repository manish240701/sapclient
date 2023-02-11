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

const NavComponent2 = () => {
  const categoryHeader = "Project Presentation";
  const [fileNames, setFileNames] = useState([]);

  //states
  const studentId = localStorage.getItem("studentId");
  const studentDept = localStorage.getItem("studentDept");
  const studentSection = localStorage.getItem("studentSection");
  const studentYear = localStorage.getItem("studentYear");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [file, setFile] = useState("");
  const [uploadData, setUploadData] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState("");
  const [uploadStatus, setUploadStatus] = useState("newticket");
  const [allFilled, setAllFilled] = useState(false);
  const [isUploadClicked, setIsUploadClicked] = useState(false);
  const [categoryPoints, setCategoryPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [data, setData] = useState({});
  const [categoryData, setCategoryData] = useState();
  const [totalCategoryRecords, setTotalCategoryRecords] = useState(0);
  const [userMessage, setUserMessage] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState(true);

  const weightageCalculator = () => {
    if (category === "participation" && level === "inside") {
      return 2;
    }
    if (category === "participation" && level === "outside") {
      return 5;
    }
    if (category === "participation" && level === "state") {
      return 10;
    }
    if (category === "participation" && level === "national/international") {
      return 20;
    }
    if (category === "prize" && level === "inside") {
      return 10;
    }
    if (category === "prize" && level === "outside") {
      return 20;
    }
    if (category === "prize" && level === "state") {
      return 30;
    }
    if (category === "prize" && level === "national/international") {
      return 50;
    }
  };

  useEffect(() => {
    if (category !== "empty" && category === "submitted" && file) {
      setAllFilled(true);
    } else if (
      category !== "empty" &&
      category !== "submitted" &&
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

  const dataEmptifier = () => {
    setCategory("");
    setFile("");
    setFile("");
    setUploadData("");
    setUploadPercentage("");
    setUploadData({});
    document.querySelector("form").reset();
    setUploadStatus("newticket");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (categoryPoints + weightageCalculator() > 75) {
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
          await setDoc(doc(db, `alldept/${studentDept}/years/${studentYear}/sections/${studentSection}/allStudents/${studentId}/all`, id), {
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
        dataEmptifier();
        setIsUploadClicked(false);
      }
    } else {
      alert("fill all data");
    }
  };

  const handleDelete = async (id, fileName) => {
    try {
      await deleteDoc(doc(db, `alldept/${studentDept}/years/${studentYear}/sections/${studentSection}/allStudents/${studentId}/all`, id));
      setStatus(true);
      const desertRef = ref(storage, `${studentDept}/${studentYear}/${studentSection}/${studentId}/${fileName}`);
      deleteObject(desertRef).then(() => {
        console.log("fully deleted");
      });
      alert("success");
    } catch (err) {
      console.log(err);
    }
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
        const storageRef = ref(storage, `${studentDept}/${studentYear}/${studentSection}/${studentId}/${file.name}`);
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

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, `alldept/${studentDept}/years/${studentYear}/sections/${studentSection}/allStudents/${studentId}/all`),
      (snapShot) => {
        let categoryList = [];
        let list = [];
        let count = 0;
        let fileNames = [];
        setCategoryPoints(0);
        setTotalPoints(0);
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
          setTotalPoints((prev) => prev + doc.data().weightage);
          if (doc.data().activityCategory === categoryHeader) {
            categoryList.push({ id: doc.id, ...doc.data() });
            setCategoryPoints((prev) => prev + doc.data().weightage);
            count += 1;
          }
          fileNames.push(doc.data().fileName);
        });

        if (categoryList.length === 0) {
          setUserMessage("No data found");
        }
        setFileNames(fileNames);
        setTotalCategoryRecords(count);
        setData(list);
        setCategoryData(categoryList);
        setIsLoading(false);
        setStatus(false);
      },
      (error) => {
        alert("error fetching data");
      }
    );

    return () => {
      unsub();
    };
  }, [status === true]);

  return (
    <div className="nav-body-container">
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
                setCategory(e.target.value);
                handleInput(e);
              }}
            >
              <option value="empty" className="disabled-select">
                Select a value
              </option>
              <option value="participation">Participation</option>
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
                  setLevel(e.target.value);
                  handleInput(e);
                }}
              >
                <option value="empty" className="disabled-select">
                  Select a value
                </option>
                <option value="inside">Inside</option>
                <option value="outside">Outside</option>
                <option value="state">State</option>
                <option value="national/international">
                  National/International
                </option>
              </select>
            </section>
          )}

          <section className="form-group">
            <label htmlFor="category" className="form-label">
              Upload Proof(pdf only)
            </label>
            <input
              type="file"
              className="form-control"
              id="pdf"
              name="pdf"
              accept="application/pdf"
              onChange={(e) => {
                setFile(e.target.files[0]);
                handleInput(e);
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

      <div className="display-data-container">
        <div className="category-header">
          <h4>
            {categoryHeader}
            <span style={{ fontSize: "15px" }}> (MAX - 100 points)</span>
          </h4>
          <div className="category-values-container">
            <section className="category-values-section">
              <h6>
                Category Count :{isLoading ? "__" : " " + totalCategoryRecords}
              </h6>
            </section>
            <section className="category-values-section">
              <h6>Category points:{isLoading ? "__" : " " + categoryPoints}</h6>
            </section>
            <section className="category-values-section">
              <h6>Total points: {isLoading ? "__" : " " + totalPoints}</h6>
            </section>
          </div>
        </div>
        <div className="data-container mt-4">
          {isLoading ? (
            <p>{userMessage}</p>
          ) : categoryData.length === 0 ? (
            <p>{userMessage}</p>
          ) : (
            categoryData.map((d, index) => {
              return (
                <div className="individual-data-body" key={d.id}>
                  <div className="activity-header-bar">
                    <span className="h1">0{index + 1}</span>
                    <span>Verification: {d.approval}</span>
                  </div>
                  <div className="activity-data">
                    <div className="data text-overflow-hide">
                      <div>
                        Weightage:
                        <span>{d.weightage}</span>
                      </div>
                      <div>
                        Category:
                        <span>{d.category}</span>
                      </div>
                      {d.level && (
                        <div>
                          Level:
                          <span>{d.level}</span>
                        </div>
                      )}
                    </div>
                    <div className="action-button-group">
                      <a href={d.pdf} target="_blank" rel="noreferrer noopener">
                        <button className="button view-proof-button zoom">
                          Preview PDF
                        </button>
                      </a>
                      <button
                        className="button delete-record-button zoom"
                        onClick={() => {
                          if (
                            // confirming before download
                            window.confirm(
                              "Are you sure you want to delete this?"
                            ) === true
                          ) {
                            //passing the id and the filename fore deletion
                            handleDelete(d.id, d.fileName);
                          }
                        }}
                      >
                        delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NavComponent2;
