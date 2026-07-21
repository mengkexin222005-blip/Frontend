import { Outlet } from "react-router-dom";
import { useState } from "react";
import { DotLoader } from "react-spinners";
import mainLogo from "../assets/intellicrm_logo.svg";
import loginBanner from "../assets/loginbanner.svg";

export default function AuthLayout() {
  const [bannerLoading, setBannerLoading] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Left: Banner  */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          {bannerLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <DotLoader color="#b42318" size={40} />
            </div>
          )}
          <img
            src={loginBanner}
            alt="Auth Banner"
            draggable={false}
            onLoad={() => setBannerLoading(false)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              bannerLoading ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>
      </div>

      {/* Right: Form card */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-[#f9f9f9]">
        <div className="w-full max-w-sm bg-[#f9f9f9] rounded-2xl shadow-md px-10 py-10">
          <div className="flex justify-center mb-6">
            <img src={mainLogo} alt="IntelliCRM Logo" className="h-12" />
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
