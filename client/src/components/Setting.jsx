import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../Firebase.js";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice.js";
import Navbar from "./Navbar.jsx";

const Settings = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(
    () => window.localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    const htmlElement = document.documentElement;
    if (isDarkMode) {
      htmlElement.classList.add("dark");
      window.localStorage.setItem("theme", "dark");
    } else {
      htmlElement.classList.remove("dark");
      window.localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-3 mx-auto gap-y-4 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold text-center my-14">Settings</h1>
        <div className="flex items-center justify-center w-[90%] border p-3 rounded-lg">
          <form onSubmit={handleSubmit} className="flex flex-row gap-4">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              ref={fileRef}
              hidden
              accept="image/*"
            />
            <img
              onClick={() => fileRef.current.click()}
              src={formData.avatar || currentUser.avatar}
              alt="profile"
              className="rounded-full h-16 w-16 object-cover cursor-pointer self-center mt-2"
            />
            <p className="text-sm self-center">
              {fileUploadError ? (
                <span className="text-red-700">
                  Error Image Upload (image must be less than 2MB)
                </span>
              ) : filePercentage > 0 && filePercentage < 100 ? (
                <span className="text-slate-700">
                  {`Uploading${filePercentage}%`}
                </span>
              ) : filePercentage === 100 ? (
                <span className="text-green-700">Image Successfully Uploaded!</span>
              ) : (
                ""
              )}
            </p>
            <input
              type="text"
              placeholder="username"
              defaultValue={currentUser.username}
              className="border p-3 rounded-lg h-[40px] mt-6"
              onChange={handleChange}
              id="username"
            />
            <input
              type="email"
              placeholder="email"
              defaultValue={currentUser.email}
              className="border p-3 rounded-lg h-[40px] mt-6"
              onChange={handleChange}
              id="email"
            />
            <input
              type="text"
              placeholder="password"
              className="border p-3 rounded-lg h-[40px] mt-6"
              onChange={handleChange}
              id="password"
            />
            <div className="flex flex-col gap-y-2 items-center justify-center">
              <button
                disabled={loading}
                className="flex items-center justify-center bg-slate-700 !text-white text-sm rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 h-[25px]"
              >
                {loading ? "Loading..." : "Update"}
              </button>
              <button
                onClick={handleDeleteUser}
                className="flex items-center justify-center bg-red-700 !text-white text-sm rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 h-[25px]"
              >
                Delete
              </button>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-center w-[90%] border p-3 rounded-lg">
          <label className="flex items-center space-x-3">
            <span className="text-w-400">Enable Dark Mode for the page :</span>
            <span>Dark Mode</span>
            <input
              type="checkbox"
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
              className="toggle-checkbox"
            />
          </label>
        </div>
      </div>
    </>
  );
};

export default Settings;
