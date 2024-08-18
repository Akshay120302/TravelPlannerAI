import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import MenuModal from "./MenuModal";

const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const maxScroll = 300; // Adjust this value as needed
  const opacity = Math.max(0, Math.min(1, 1 - scrollY / maxScroll));

  const { currentUser } = useSelector((state) => state.user);

  const [openModalMenu, setOpenModal] = useState(false);

  const openModalMenuHandler = () => {
    setOpenModal(true);
  };

  const closeModalMenuHandler = () => {
    setOpenModal(false);
  };

  return (
    <>
      <nav className="navbar">
        <div
          className="navbar fixed top-0 left-0 flex w-full items-center justify-center z-50 transition-opacity duration-300"
          style={{ opacity }}
        >
          <div className="mx-5 flex h-14 w-full max-w-screen-xl items-center justify-between md:h-16">
            <div className="flex gap-10">
              <a className="font-display flex items-center text-2xl" href="/">
                <img
                  src="https://tripplanner.ai/_next/image?url=%2Flogo%2Flogo.webp&w=32&q=75"
                  alt="Trip Planner AI"
                  width={29}
                  height={29}
                />
                <div className="text-base/7 font-medium md:text-xl/8">
                  Travel Assistant AI
                </div>
              </a>
              <div className="flex">
                <a
                  href=""
                  className="hidden items-center gap-2 rounded-lg px-3 text-[#b077fc] transition-colors hover:bg-primary-purple/20 md:flex"
                >
                  <span>B2B Integration</span>
                </a>
                <a
                  href=""
                  className="cursor-pointer rounded-lg px-3 py-1.5 text-gray-700 transition-colors hover:bg-gray-100 hidden"
                >
                  Community Trips
                </a>
              </div>
            </div>
            <ul className="ml-5 flex gap-2">
              <li className="cursor-pointer rounded-full px-4 py-1.5 hover:bg-gray-100 hidden md:block">
                <a href="">Community Trips</a>
              </li>
              <li>
                <div>
                  {currentUser ? (
                    <>
                      <img
                        className="rounded-full h-9 w-9 object-cover"
                        src={currentUser.avatar}
                        alt="profile"
                        onMouseEnter={openModalMenuHandler}
                      />
                      <MenuModal
                        isOpenModal={openModalMenu}
                        closeModalMenu={closeModalMenuHandler}
                      />
                    </>
                  ) : (
                    <Link
                      className="h-fit cursor-pointer rounded-full bg-black px-5 py-1.5 !text-white ml-[-6px]"
                      to="./signin"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;