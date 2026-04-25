import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import LeftNavbar from "../../../components/LeftNavbar/LeftNavbar";
import { saveDashboardPath } from "../../../utils/adminSession";


const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/dashboard") {
      saveDashboardPath(`${location.pathname}${location.search || ""}`);
    }
  }, [location.pathname, location.search]);

  return (
    <div className="  pt-16 min-h-screen bg-gray-100 ">
      <div className="flex max-w-[1440px] 2xl:max-w-[1600px] mx-auto items-start  flex-col md:flex-row">
        <LeftNavbar />

        <main className="flex-1 w-full lg:w-[70rem] lg:pl-6 pt-2 pb-24">
         

         <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default Home;
