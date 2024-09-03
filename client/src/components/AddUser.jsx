import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

const AddUser = ({setAddUser,handleAddUser, error}) => {

    const [formData, setFormData] = useState({
        email: ''
      });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      };
    

    const closeAddUser = () => {
        setAddUser(false);
    }
  return (
    <>
    
    <div className="modal-overlay" onClick={closeAddUser}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={closeAddUser}>
            &times;
          </button>
          <h2 className="H2">Add User</h2>
          <br />
          <form onSubmit={handleAddUser}>

            <div className="form-group">
              <label htmlFor="email">Search :</label>
              <p className="textSpecial">
                For example : example@gmail.com
              </p>
              <input
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="submit-button"
            >
              <FaSearch style={{backgroundColor:"#007bff"}}/>
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </>
  )
}

export default AddUser
