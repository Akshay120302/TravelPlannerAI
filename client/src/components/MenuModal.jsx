import React, { useRef, useEffect } from "react";
import "./styles/MenuOver.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFailure,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
} from "../redux/user/userSlice.js";

const MenuModal = ({ isOpenModal, closeModalMenu }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const modalRef = useRef(null);

  const { currentUser } = useSelector((state) => state.user);

  const handleSignout = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    } finally {
      navigate("/");
    }
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModalMenu();
    }
  };

  useEffect(() => {
    if (isOpenModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpenModal]);

  const handleMouseLeave = (e) => {
    if (!modalRef.current.contains(e.relatedTarget)) {
      closeModalMenu();
    }
  };

  if (!isOpenModal) return null;

  return (
    <div className="m-overlay" onMouseLeave={handleMouseLeave}>
      <div className="md" ref={modalRef}>
        <div className="bodyModal">
          <ul className="UL" />
          <Link to="/profile">
            <li className="LI">Profile</li>
          </Link>
          <div className="mt-1 max-w-screen-xl border-t border-solid border-gray-300 py-3 text-center text-gray-700 md:text-start"></div>
          {currentUser ? (
            <Link to={`/notifications/${currentUser._id}`}>
              <li className="LI">Notifications</li>
            </Link>
          ) : (
            <li className="LI">Notifications</li>
          )}
          <div className="mt-1 max-w-screen-xl border-t border-solid border-gray-300 py-3 text-center text-gray-700 md:text-start"></div>
          <Link to="/create-trip" className="LI">
            Create Trip
          </Link>
          <div className="mt-1 max-w-screen-xl border-t border-solid border-gray-300 py-3 text-center text-gray-700 md:text-start"></div>
          <Link to="/settings" className="LI">
            Settings
          </Link>
          <div className="mt-1 max-w-screen-xl border-t border-solid border-gray-300 py-3 text-center text-gray-700 md:text-start"></div>
          <li className="LI" onClick={handleSignout}>
            LogOut
          </li>
          <ul />
        </div>
      </div>
    </div>
  );
};

export default MenuModal;
