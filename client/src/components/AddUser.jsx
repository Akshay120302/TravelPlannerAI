import React, { useState } from "react";
import axios from "axios";
// import { FaSearch } from 'react-icons/fa'

const AddUser = ({ setAddUser, handleAddUser, error, tripId }) => {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  // const [formData, setFormData] = useState({
  //   email: "",
  // });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  const closeAddUser = () => {
    setAddUser(false);
  };

  const handleInvite = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/trip/send", { tripId, email });
      closeAddUser();
      alert("Invitation sent");
    } catch (err) {
      setErr(err.response.data.message);
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={closeAddUser}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={closeAddUser}>
            &times;
          </button>
          <h2 className="H2">Add User</h2>
          <br />
          <form onSubmit={handleInvite}>
            <div className="form-group">
              <label htmlFor="email">Search :</label>
              <p className="textSpecial">For example : example@gmail.com</p>
              <input
                type="email"
                placeholder="Enter user email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-button">
              {/* <FaSearch style={{backgroundColor:"#007bff"}}/> */}
              Invite
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          {err && <p>{err}</p>}
        </div>
      </div>
    </>
  );
};

export default AddUser;
