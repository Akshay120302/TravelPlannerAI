import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import PartTwo from "./components/PartTwo";
import PartThree from "./components/PartThree";
import PartFour from "./components/PartFour";
import SignUp from "./components/SignUp";
import CreateTrip from "./components/CreateTrip";
import SignIn from "./components/SignIn";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";
import NewTrip from "./components/NewTrip";
import Preferences from "./components/Preferences";
// import Chatbot from "./components/Chatbot";
import FinalPlannedTrip from "./components/FinalPlannedTrip";
import Settings from "./components/Setting";
import Listing from "./components/Listing";
import Notification from "./components/Notification.jsx";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Part2" element={<PartTwo />} />
          <Route path="/Part3" element={<PartThree />} />
          <Route path="/Part4" element={<PartFour />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          {/* <Route path="/new-trip" element={<NewTrip />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/finaltrip" element = {<FinalPlannedTrip/>}/>
          <Route path="/preferences" element={<Preferences/>}/>
          <Route path="/settings" element={<Settings/>}/>
          <Route path="/listing/:_id" element={<Listing/>}/>
          <Route path="/notifications/:_id" element={<Notification/>}/> */}
          {/* <Route path="/tripCreate" element={<TripCreate />} /> */}
          <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/new-trip" element={<NewTrip />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/finaltrip/:_id" element = {<FinalPlannedTrip/>}/>
          <Route path="/preferences" element={<Preferences/>}/>
          <Route path="/settings" element={<Settings/>}/>
          <Route path="/listing/:_id" element={<Listing/>}/>
          <Route path="/notifications/:_id" element={<Notification/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;


// Collaboration working fine with feature-akshay as branch