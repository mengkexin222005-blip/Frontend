import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronRight,
  ChevronDown,
  Folder,
  Settings,
} from "lucide-react";

import logo from "../../assets/intellicrm_logo.svg";
import logoOnly from "../../assets/i7logo.svg";

import { useAuth } from "../../context/AuthContext";
import { getNavLinks, filterNavItems } from "../../utils/navigation";

import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [moduleOpen, setModuleOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const roleRoutes = {
    "Super Admin": "/admin",
    Admin: "/admin",
    "Sales Manager": "/sales-manager",
    "Sales Agent": "/sales-agent",
    "Support Staff": "/support-staff",
  };

  const baseRoute = roleRoutes[user?.role] || "";

  // Settings now opens User Management
  const settingsPath = `${baseRoute}/users`;

  const navItems = filterNavItems(getNavLinks(user?.role), user);

  const modulePages = [
    "prospects",
    "leads",
    "clients",
    "quotations",
    "tasks",
    "meetings",
    "calls",
  ];

  const isUsersItem = (item) => {
    if (!item.to) return false;

    return item.to.includes("/users");
  };

  const isSettingsItem = (item) => {
    if (!item.to) return false;

    return item.to.includes("/settings");
  };

  const isModuleItem = (item) => {
    if (!item.to) return false;

    return modulePages.some((page) =>
      item.to.includes(page)
    );
  };

  /*
    Main navigation
    Remove:
    - Settings
    - Users

    because Users will now live inside Settings
  */
  const topItems = navItems.filter((item) => {
    if (!item.to) return false;

    return (
      !isModuleItem(item) &&
      !isSettingsItem(item) &&
      !isUsersItem(item)
    );
  });


  const moduleItems = navItems.filter((item) => {
    if (!item.to) return false;

    return isModuleItem(item);
  });


  const usersItem = navItems.find((item) =>
    isUsersItem(item)
  );


  const shouldShowSettings =
    user?.role !== "Support Staff";


  /*
    Automatically open Settings menu
    when inside Users page
  */
  useEffect(() => {
    if (location.pathname.includes("/users")) {
      setSettingsOpen(true);
    }
  }, [location.pathname]);


  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-60"
      } bg-white text-gray-900 flex flex-col transition-all duration-300 border-r border-gray-200`}
    >

      {/* HEADER */}
      <div className="border-b-2 border-gray-200 h-23 relative flex items-center px-4">

        <img
          src={isCollapsed ? logoOnly : logo}
          alt="CRM Logo"
          className={`transition-all duration-300 ${
            isCollapsed ? "h-8" : "h-10"
          }`}
        />


        <div
          onClick={() =>
            setIsCollapsed((prev) => !prev)
          }
          className={`absolute -right-4.5 -bottom-4.5 cursor-pointer bg-[#E7000B] border-4 border-gray-100 rounded-full p-1 flex items-center justify-center transition-transform duration-300 z-10 ${
            isCollapsed ? "" : "rotate-180"
          }`}
        >
          <ChevronRight
            size={23}
            color="white"
            strokeWidth={2.5}
          />
        </div>

      </div>



      {/* NAVIGATION */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">


        {/* TOP NAV */}
        {topItems.map((item) => (
          <SidebarItem
            key={item.to}
            item={item}
            isCollapsed={isCollapsed}
          />
        ))}



        {/* MODULE */}
          <button
            type="button"
            onClick={() => {
              if (isCollapsed) {
                setIsCollapsed(false);
                setModuleOpen(true);
              } else {
                setModuleOpen((prev) => !prev);
              }
            }}
            className={`w-full py-3 rounded-md hover:bg-gray-100 transition flex items-center ${
              isCollapsed
                ? "justify-center px-0"
                : "justify-between px-4"
            }`}
          >
            <div className="flex items-center gap-4">
              <Folder size={20} />
              {!isCollapsed && <span>Module</span>}
            </div>

          {!isCollapsed &&
            (
              moduleOpen
                ? <ChevronDown size={18}/>
                : <ChevronRight size={18}/>
            )
          }


        </button>



        {/* MODULE CHILDREN */}
        {moduleOpen &&
          moduleItems.map((item)=>(
            <div
              key={item.to}
              className={
                isCollapsed
                  ? ""
                  : "ml-6"
              }
            >

              <SidebarItem
                item={item}
                isCollapsed={isCollapsed}
              />

            </div>
          ))
        }




        {/* SETTINGS */}
        {shouldShowSettings && (

          <>

            <div className="relative">

              <NavLink
                to={settingsPath}

                onClick={()=>{
                  setSettingsOpen(true);

                  if(isCollapsed){
                    setIsCollapsed(false);
                  }
                }}

                className={({isActive})=>
                  `w-full py-3 rounded-md transition flex items-center ${
                    isCollapsed
                      ? "justify-center px-0"
                      : "justify-between px-4"
                  }
                  ${
                    isActive
                      ? "bg-gray-100 text-red-600"
                      : "text-gray-900 hover:bg-gray-100"
                  }`
                }
              >


                <div className="flex items-center gap-4">

                  <Settings size={20}/>

                  {!isCollapsed && (
                    <span>
                      Settings
                    </span>
                  )}

                </div>


                {!isCollapsed &&
                  usersItem &&
                  (
                    settingsOpen
                      ? <ChevronDown size={18}/>
                      : <ChevronRight size={18}/>
                  )
                }


              </NavLink>


            </div>




            {/* USERS INSIDE SETTINGS */}
            {settingsOpen &&
              usersItem &&
              (
                <div
                  className={
                    isCollapsed
                      ? ""
                      : "ml-6"
                  }
                >

                  <SidebarItem
                    item={usersItem}
                    isCollapsed={isCollapsed}
                  />

                </div>
              )
            }


          </>
        )}


      </nav>

    </div>
  );
}