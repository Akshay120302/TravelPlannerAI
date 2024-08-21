import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";
import "./styles/Home.css";
import PartTwo from "./PartTwo";
import PartThree from "./PartThree";
import Marquee from "react-fast-marquee";
import Partthree from "./PartThree";
import Pic from './styles/images/vector_art.jpg'
import Footer from "./Footer";
import { useSelector } from "react-redux";

const Home = () => {

// Akshay's Changes:
  const [scrollY, setScrollY] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const openModal = (user) => {
    if(user === false){
      setIsModalOpen(true);
    }
    if(user === true){
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isModalOpen]);

  // till here

  const images = [
    // "https://tripplanner.ai/landing/images/affiliates/holafly.svg",
    // "https://tripplanner.ai/landing/images/affiliates/tiqets.svg",
    // "https://tripplanner.ai/landing/images/affiliates/safety_wing.svg",
    // "https://tripplanner.ai/landing/images/affiliates/getyourguide.svg",
    // "https://tripplanner.ai/_next/image?url=%2Fshared%2Fplatforms%2Fbooking-logo.webp&w=256&q=75",
    // "https://tripplanner.ai/landing/images/affiliates/freetour.svg",
    // "https://tripplanner.ai/landing/images/affiliates/viator.svg",
    // "https://tripplanner.ai/_next/image?url=%2Fshared%2Fplatforms%2Fhostelworld-logo.webp&w=256&q=75",
    // "https://tripplanner.ai/landing/images/affiliates/airalo.svg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <>
      <div className="nav-section">
        {/* <Navbar scrollY={scrollY} openModal={openModal}/> */}
        <Navbar/>
        {/* <SignIn isOpen={isModalOpen} closeModal={closeModal} /> */}
        {/* <TripCreate isOpen={isModalOpen} closeModal={closeModal}/> */}
      </div>
      <br />
      <div className="hero-section">
        <h1>Your Next Journey, Optimized</h1>
      </div>
      <div className="para">
        <p style={{padding : "10px", textAlign : "justify"}}>
          Build, personalize, and optimize your itineraries with our free AI
          trip planner. Designed for vacations, workations, and everyday
          adventures.
        </p>
      </div>

      {/* new trip button */}
      {currentUser ? 
      <Link to="/new-trip">
          
      <button className="trip-btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          // xmlns:xlink="http://www.w3.org/1999/xlink"
          aria-hidden="true"
          role="img"
          className="mb-1 text-xl iconify iconify--bx"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M14.844 20H6.5C5.121 20 4 18.879 4 17.5S5.121 15 6.5 15h7c1.93 0 3.5-1.57 3.5-3.5S15.43 8 13.5 8H8.639a9.812 9.812 0 0 1-1.354 2H13.5c.827 0 1.5.673 1.5 1.5s-.673 1.5-1.5 1.5h-7C4.019 13 2 15.019 2 17.5S4.019 22 6.5 22h9.593a10.415 10.415 0 0 1-1.249-2M5 2C3.346 2 2 3.346 2 5c0 3.188 3 5 3 5s3-1.813 3-5c0-1.654-1.346-3-3-3m0 4.5a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 5 6.5"
          ></path>
          <path
            fill="currentColor"
            d="M19 14c-1.654 0-3 1.346-3 3c0 3.188 3 5 3 5s3-1.813 3-5c0-1.654-1.346-3-3-3m0 4.5a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 19 18.5"
          ></path>
        </svg>
        Create a new trip
      </button>
      </Link>
      :
      <Link to="/signin">
      <button className="trip-btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        // xmlns:xlink="http://www.w3.org/1999/xlink"
        aria-hidden="true"
        role="img"
        className="mb-1 text-xl iconify iconify--bx"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M14.844 20H6.5C5.121 20 4 18.879 4 17.5S5.121 15 6.5 15h7c1.93 0 3.5-1.57 3.5-3.5S15.43 8 13.5 8H8.639a9.812 9.812 0 0 1-1.354 2H13.5c.827 0 1.5.673 1.5 1.5s-.673 1.5-1.5 1.5h-7C4.019 13 2 15.019 2 17.5S4.019 22 6.5 22h9.593a10.415 10.415 0 0 1-1.249-2M5 2C3.346 2 2 3.346 2 5c0 3.188 3 5 3 5s3-1.813 3-5c0-1.654-1.346-3-3-3m0 4.5a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 5 6.5"
        ></path>
        <path
          fill="currentColor"
          d="M19 14c-1.654 0-3 1.346-3 3c0 3.188 3 5 3 5s3-1.813 3-5c0-1.654-1.346-3-3-3m0 4.5a1.5 1.5 0 1 1 .001-3.001A1.5 1.5 0 0 1 19 18.5"
        ></path>
      </svg>
      Create a new trip
    </button>
    </Link>
    }
      
      <div className="enclose">

      <div className="hawaii-illustration"> <img src={Pic} className='IMG' alt="Image" /></div>

      </div>

      {/* <div className="mid-section">
      <h1>Your <span>AI-Powered</span> Trip</h1>
    </div> */}

    <br />

      <PartTwo />
      <Partthree />
      {/* Part four */}
      <div className="bg-background">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base tracking-wide font-light text-purple-300 mt-2">
              TRIP PLANNER AI
            </h2>
            <br />
            <h3 className="px-6 text-center text-3xl font-bold md:text-4xl lg:px-12 xl:text-5xl">
              The <span>only tool</span> you'll ever need!
            </h3>
            <p className="mx-auto mb-5 mt-10 max-w-2xl text-lg text-gray-500">
              <h3>
              Say goodbye to the stress of planning and hello to personalized
              recommendations, efficient itineraries, and seamless dining
              experiences.
              </h3>
            </p>
          </div>

          <div className="mx-auto mt-10 grid h-full max-w-6xl grid-cols-1 flex-wrap items-start gap-5 md:mt-20 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
            <div className="undefined w-full flex-1 rounded-xl border border-solid border-gray-200 p-6 last:md:col-span-2 last:lg:col-span-1">
              <div className="flex items-center gap-3">
                <img
                  src="https://tripplanner.ai/_next/image?url=%2Fillustrations%2Fmap.webp&w=384&q=75"
                  className="h-[3rem] w-auto md:h-[5rem]"
                  alt="logo"
                />
                <p className="leading-2 max-w-[12rem] text-lg font-bold text-gray-900 md:text-xl lg:text-2xl">
                  Optimal Route Planning
                </p>
              </div>
              <p className="mt-2 text-base text-gray-500 md:text-lg">
                Our AI algorithms analyze your preferences to craft the most
                efficient route, saving you time and effort.
              </p>
            </div>

            <div className="undefined w-full flex-1 rounded-xl border border-solid border-gray-200 p-6 last:md:col-span-2 last:lg:col-span-1">
              <div className="flex items-center gap-3">
                <img
                  src="https://tripplanner.ai/_next/image?url=%2Fillustrations%2Fstory.webp&w=384&q=75"
                  className="h-[3rem] w-auto md:h-[5rem]"
                  alt="logo"
                />
                <p className="leading-2 max-w-[12rem] text-lg font-bold text-gray-900 md:text-xl lg:text-2xl">
                Personalize Your Adventure
                </p>
              </div>
              <p className="mt-2 text-base text-gray-500 md:text-lg">
              Shape your journey by freely adding, editing, or deleting activities from your itinerary.
              </p>
            </div>
            <div className="undefined w-full flex-1 rounded-xl border border-solid border-gray-200 p-6 last:md:col-span-2 last:lg:col-span-1">
              <div className="flex items-center gap-3">
                <img
                  src="https://tripplanner.ai/_next/image?url=%2Fillustrations%2Ffood.webp&w=384&q=75"
                  className="h-[3rem] w-auto md:h-[5rem]"
                  alt="logo"
                />
                <p className="leading-2 max-w-[12rem] text-lg font-bold text-gray-900 md:text-xl lg:text-2xl">
                Local Cuisine Recommendations
                </p>
              </div>
              <p className="mt-2 text-base text-gray-500 md:text-lg">
              Discover local cuisines and hidden gems recommended by our AI, tailored to your taste buds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Part five */}

      {/* Part six */}
      <br />
      <div className="flex flex-col items-center">
        <div className="mb-3">
          <h3 className="px-6 text-center text-3xl font-bold md:text-4xl lg:px-12 xl:text-5xl">
            Our Trusted Partners
          </h3>
        </div>

        {/* CAROUSEL PART */}
        <div>
          <div className="absolute z-[20] h-full w-full max-w-[1rem] bg-gradient-to-r from-white md:max-w-[5rem]"></div>
          <div className="absolute right-0 z-[20] h-full w-full max-w-[1rem] bg-gradient-to-l from-white md:max-w-[5rem]"></div>
          <Marquee direction="right" speed={100}>
            <div className="image-wrapper">
              <img
                src="https://tripplanner.ai/landing/images/affiliates/holafly.svg"
                alt=""
              />
            </div>
            <div className="image-wrapper">
              <img
                src="https://tripplanner.ai/landing/images/affiliates/tiqets.svg"
                alt=""
              />
            </div>
            <div className="image-wrapper">
              <img
                src="https://tripplanner.ai/landing/images/affiliates/safety_wing.svg"
                alt=""
              />
            </div>
            <div className="image-wrapper">
              <img
                src="https://tripplanner.ai/landing/images/affiliates/getyourguide.svg"
                alt=""
              />
            </div>
            <div className="image-wrapper">
              <img
                src="https://tripplanner.ai/_next/image?url=%2Fshared%2Fplatforms%2Fbooking-logo.webp&w=256&q=75"
                alt=""
              />
            </div>
            <div className="image-wrapper">
              <img
                src="https://tripplanner.ai/landing/images/affiliates/freetour.svg"
                alt=""
              />
            </div>
            <div className="image-wrapper">
              <img
                src="https://tripplanner.ai/landing/images/affiliates/viator.svg"
                alt=""
              />
            </div>
            <div className="image-wrapper">
              <img
                src="https://tripplanner.ai/_next/image?url=%2Fshared%2Fplatforms%2Fhostelworld-logo.webp&w=256&q=75"
                alt=""
              />
            </div>
            <div className="image-wrapper">
              <img
                src="https://tripplanner.ai/landing/images/affiliates/airalo.svg"
                alt=""
              />
            </div>
          </Marquee>
        </div>
      </div>

      {/* part seventh */}
      <div className="mx-auto mt-3 w-full max-w-screen-2xl md:mt-14">
        <h2 className="px-6 text-center text-3xl font-bold md:text-4xl lg:px-12 xl:text-5xl">
          Journey Inspirations Fom Travellers
        </h2>
        <p className="mx-auto mt-10 max-w-3xl px-6 text-center text-base lg:px-12 lg:text-lg">
          <h4>
          Dive into unique{" "}
          <a
            className="trip-itn text-accent-red-2 underline"
            href="/public_trips"
          >
            trip itineraries
          </a>{" "}
          crafted by our global travelers. Find your next adventure and share
          your own journey with fellow explorers.
          </h4>
        </p>
      </div>

      {/* the last part, customized itinerary */}
      <div className="mt-20 border-t border-solid border-gray-300">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="flex w-full flex-col justify-center gap-2">
            <h1 className="text-center text-3xl font-medium">
              Customized <span className="font-semibold">Itineraries</span> for
              Every Travel Dream
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-center">
              <h4>
              Trip Planner AI is your ultimate companion for any travel
              scenario. Whether it's a solo adventure, a family vacation, or a
              group expedition, our app tailors every aspect of your journey.
              Experience the convenience of:
              </h4>
            </p>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* div1 */}
            <div className="flex flex-col gap-5 text-center">
              <h2 className="text-center text-xl font-medium">
                <span className="font-semibold text-purple-400">
                  AI-Powered
                </span>{" "}
                Route Optimization
              </h2>
              <p className="text-gray-600">
                <h4>
                Utilize AI for{" "}
                <strong className="font-medium text-gray-900">
                  optimal travel routes.
                </strong>{" "}
                Our app ensures a seamless journey, calculating the best paths,
                travel times, and distances for city tours or cross-country road
                trips.
                </h4>
              </p>
            </div>

            {/* div 2 */}
            <div className="flex flex-col gap-5 text-center">
              <h2 className="text-center text-xl font-medium">
                All-in-one{" "}
                <span className="font-semibold text-purple-400">
                  Travel Organizer
                </span>
              </h2>
              <p className="text-gray-600">
                <h4>
                Simplify travel planning with our all-in-one platform. Trip
                Planner AI consolidates hotel and flight details, manages
                bookings, and imports tips and guides. Organize{" "}
                <strong className="font-medium text-gray-900">
                  all trip details in one place.
                </strong>
                </h4>
              </p>
            </div>

            {/* div 3 */}
            <div className="flex flex-col gap-5 text-center md:col-span-2 lg:col-span-1">
              <h3 className="text-center text-xl font-medium">
                Collaborative{" "}
                <span className="font-semibold text-purple-400">
                  Group Planning
                </span>{" "}
                Made Easy
              </h3>

              <p className="text-gray-600">
                <h4>
                Collaborate on itineraries with companions. Our real-time
                feature makes group travel planning effortless, ensuring
                everyone stays informed and involved in the process.
                </h4>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* footer section */}
      <Footer/>
    </>
  );
};

export default Home;
