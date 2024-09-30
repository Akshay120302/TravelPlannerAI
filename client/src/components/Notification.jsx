import Navbar from "./Navbar.jsx";
import { useState, useEffect } from "react";
import axios from "axios";

const Notification = () => {
  const [invitations, setInvitations] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        // Step 1: Fetch pending invitations for the current user
        const { data: invitations } = await axios.get("/api/trip/pending");
  
        // Step 2: For each invitation, fetch sender's name and trip name using senderId and tripId
        const enrichedInvitations = await Promise.all(
          invitations.map(async (invitation) => {
            // Fetch trip details
            const { data: trip } = await axios.get(`/api/trip/get/${invitation.tripId}`);
  
            // Return the enriched invitation object with sender's name and trip name
            return {
              ...invitation,
              tripName: trip.trip_name,     // Assuming the trip's name is in the `name` field
            };
          })
        );
  
        setInvitations(enrichedInvitations);
        console.log(enrichedInvitations);
      } catch (err) {
        setError("Error fetching invitations");
      }
    };
  
    fetchInvitations();
  }, []);

  const handleResponse = async (invitationId, response) => {
    try {
      await axios.post(`/api/trip/respond/${invitationId}`, {
        status: response,
      });
      setInvitations(invitations.filter((inv) => inv._id !== invitationId)); // Remove the responded invitation
    } catch (err) {
      setError("Error responding to invitation");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-3 mx-auto gap-y-4 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-semibold text-center my-14">
          Notifications
        </h1>
        {invitations.length > 0 ? (
          invitations.map((inv) => (
            <div
              className="flex items-center justify-between w-[90%] border p-3 rounded-lg"
              key={inv._id}
            >
              <p>You have been invited to join "<b>{inv.tripName}</b>"</p>
              <div className="">
                <button
                  onClick={() => handleResponse(inv._id, "accepted")}
                  className="text-green-700 mx-5"
                >
                  Accept
                </button>

                <button
                  onClick={() => handleResponse(inv._id, "rejected")}
                  className="text-red-700 mx-5"
                >
                  Reject
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center w-[90%] border p-3 rounded-lg">
            No Notifications Yet !!
          </div>
        )}
        {error && <p>{error}</p>}
      </div>
    </>
  );
};

export default Notification;
