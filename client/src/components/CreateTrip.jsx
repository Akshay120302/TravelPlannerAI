import React from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const CreateTrip = () => {

  const navigate = useNavigate();

  const handleTrip = () => {
    navigate('/new-trip');
  }

  return (
    <>
    <div className="PageBody">
      <Navbar />
      <div className="CTbody">
      <div className="mt-12 flex min-h-[47px] w-full items-center justify-center ">
        <h2 className="min-w-fit items-center text-xl font-medium md:text-2xl mt-12 ml-10">
          Your Trips
        </h2>
        <div className="flex w-full flex-wrap justify-between">
          <button className="ml-auto flex items-center gap-2 whitespace-nowrap rounded-full bg-green-800 px-4 py-2 text-[14px] text-sm text-white hover:bg-green-900 md:py-2.5 md:text-base mt-12 mr-12">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="plus"
              className="svg-inline--fa fa-plus text-sm"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
              ></path>
            </svg>
            New Trip
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="mx-auto w-fit">
          {/* ********* */}
          <div className="mb-36 flex flex-col justify-center">
            <div className="mx-auto mt-12 flex w-fit flex-col justify-center">
              <div className="mb-5 flex items-center justify-center gap-2">
                <img
                  src="https://tripplanner.ai/_next/image?url=%2Ftrippy%2Ftrippy-glasses.webp&w=96&q=75"
                  alt="Trip Planner Logo"
                  loading="lazy"
                  width={80}
                  height={100}
                />
              </div>
              <h2 className="mx-auto text-center font-medium sm:text-xl lg:text-2xl">
                🎉Welcome to the best trip planning experience🎉
              </h2>
              <ul className=" my-7 flex flex-col gap-2 text-center text-sm md:text-base">
                <li>Find the best things to do and places to visit</li>
                <li>The best hotels to stay</li>
                <li>And the best flights to get you there.</li>
              </ul>
              {/* <a href=""></a> */}
            </div>
            <button
              onClick={handleTrip}
              className="mx-auto mt-6 flex w-fit items-center gap-2 whitespace-nowrap rounded-full bg-green-900 px-5 py-2.5 font-medium text-white shadow-md transition-colors hover:bg-accent-green-2 md:text-xl"
              href="/new-trip"
            >
              Create my first trip!
              <svg
                aria-hidden="true"
                focusable="false"
                data-prefix="fas"
                data-icon="plus"
                className="svg-inline--fa fa-plus "
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
              >
                <path
                  fill="currentColor"
                  d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer/>
    </>
  );
};

export default CreateTrip;
