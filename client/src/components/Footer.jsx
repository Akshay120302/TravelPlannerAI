import React from "react";
import "./styles/Footer.css";

const Footer = () => {
  return (
    <footer className="absolute w-full border-t border-solid border-gray-300 px-4 pt-10 text-center md:pt-8 lg:pt-14">
        {/* 1st div */}
        <div className="mx-auto flex max-w-screen-xl flex-wrap justify-center gap-12 md:justify-between">
          {/* a div */}
          <div>
            {/* i div */}
            <div className="flex justify-center gap-3 md:justify-start">
              <img
                src="https://tripplanner.ai/_next/image?url=%2Flogo%2Flogo.webp&w=32&q=75"
                alt="logo"
                width={20}
                height={20}
                className="h-9 w-9 items-center"
              />
              <h1 className="text-2xl/10 font-medium">Travel Assistant AI</h1>
            </div>
            {/* ii div */}
            <div className="mt-4 flex flex-col gap-5">
              <p className="max-w-[23rem] text-center text-gray-600 md:text-start">
                Turn your next trip into a hassle-free experience with Travel Assistant AI.
              </p>
            </div>
          </div>
          {/* b div */}
          <div className="grid grid-cols-2 gap-12 xl:grid-cols-3">
            <ul className="flex flex-col gap-3">
              <li className="font-bold">Legal</li>
              <li>
                <a className="hover:underline" href="/terms">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/privacy">
                  Privacy Policy
                </a>
              </li>
            </ul>
            <ul className="flex flex-col gap-3">
              <li className="font-bold">Support</li>
              <li>
                <a className="hover:underline" href="/terms">
                  Contact Us
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/privacy">
                  B2B Integrations
                </a>
              </li>
            </ul>
            <ul className="flex flex-col gap-3">
              <li className="font-bold">Itineraries</li>
              <li>
                <a className="hover:underline" href="/terms">
                  Community Trips
                </a>
              </li>
              <li>
                <a className="hover:underline" href="/privacy">
                  Find Destinations
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* 2nd div */}
        <div className="mx-auto mt-12 max-w-screen-xl border-t border-solid border-gray-300 py-7 text-center text-gray-600 md:text-start">
          <p>
            © 2023 Travel Assistant AI. All rights reserved
          </p>
        </div>
      </footer>
  );
};

export default Footer;
