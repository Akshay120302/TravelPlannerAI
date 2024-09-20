import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaShare
} from "react-icons/fa";

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/trip/get/${params._id}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        console.log(data);
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params._id]);

 
  const deleteTrip = async () => {
    try {
      const res = await fetch(`/api/trip/delete/${params._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        navigate("/create-trip");
      } else {
        console.error("Failed to delete the trip.");
      }
    } catch (error) {
      console.error("Error deleting the trip:", error);
    }
  };

  const currentTrip = () => {
    if (listing && listing._id) {
      navigate(`/finaltrip/${listing._id}`);
    }
  }

  return (
    <main className="flex flex-col align-center container mx-auto p-6">
      {copied && <span className="text-sm text-green-500">Link copied!</span>}
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div className="flex flex-col gap-6 w-[100%] h-['max-content']">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-semibold">{listing.trip_name}</h2>
              <div
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => {
                    setCopied(false);
                  }, 2000);
                }}
              >
                <FaShare className="text-gray-500" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-medium">Trip Details</h3>
              <p>People Count: {listing.peopleCount}</p>
              <p>Travel Type: {listing.travelType}</p>
              <div className="mt-2">
                <h4 className="text-lg font-medium">Activities</h4>
                <ul className="list-disc pl-5">
                  {listing.activities.map((activity, index) => (
                    <li key={index}>{activity}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-2">
                <h4 className="text-lg font-medium">Destinations</h4>
                <ul className="list-disc pl-5">
                  {listing.destinations.map((destination, index) => (
                    <li key={index}>{destination.location}</li>
                  ))}
                </ul>
              </div>
            </div>
            {currentUser && listing.user_id !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-blue-500 text-white rounded-lg uppercase hover:opacity-95 p-3 mt-4"
              >
                Contact Trip Organizer
              </button>
            )}
          </div>
          <button
            className="rounded-full border-2 border-gray-500 bg-red-700 !text-white hover:bg-red-900"
            onClick={deleteTrip}
          >
            Delete Trip
          </button>
          {listing.status ? (<button
            className="rounded-full border-2 border-gray-500 bg-green-700 !text-white hover:bg-green-900"
            onClick={currentTrip}
          >
            Goto Trip
          </button>) : ("")}
          {/* <button
            className="rounded-full border-2 border-gray-500 bg-green-700 !text-white hover:bg-green-900"
            onClick={currentTrip}
          >
            Goto Trip
          </button> */}
        </div>
      )}
    </main>
  );
}
