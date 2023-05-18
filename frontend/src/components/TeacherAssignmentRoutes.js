//import { message } from "antd";
import React, { useEffect, useState } from "react";
import { tgetUserInfo } from "../apicalls/teachers";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice.js";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import { GrNotes } from 'react-icons/gr'
import { GrDocumentPdf } from 'react-icons/gr'
import { GrDocumentVideo } from 'react-icons/gr'
import { GiArchiveResearch } from 'react-icons/gi'
import { MdDashboardCustomize } from 'react-icons/md'
import '../stylesheets/layout.css'
import '../stylesheets/theme.css'
import '../stylesheets/alignments.css'
import '../stylesheets/textelements.css'
import '../stylesheets/custom-component.css'
import '../stylesheets/form-elements.css'
import {
  updateUser,
  getProfileTeacher,
  deleteUser,
  updateTeacher,
} from "../apicalls/helper";
import { useAuthStore } from "../redux/store1";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function TprotectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiData, setApiData] = useState({});
  const [apiData1, setApiData1] = useState({});
  const [file, setFile] = useState();
  const { username } = useAuthStore((state) => state.auth);

  const userMenu = [
    // {
    //   title: "HOME",
    //   paths: ["/sms"],
    //   icon: <i className="ri-home-line"></i>,
    //   onClick: () => navigate("/sms"),
    // },
    // {
    //   title: "FEEDBACK",
    //   paths: ["/fbs"],
    //   icon: <i className="ri-bar-chart-line"></i>,
    //   onClick: () => navigate("/fbs"),
    // },
    // {
    //   title: "PROFILE",
    //   paths: ["/profile"],
    //   icon: <i className="ri-user-line"></i>,
    //   onClick: () => navigate("/profile"),
    // },
    // {
    //   title: "LOGOUT",
    //   paths: ["/logout"],
    //   icon: <i className="ri-logout-box-line"></i>,
    //   onClick: () => {
    //     localStorage.removeItem("token");
    //     navigate("/plogin");
    //   },
    // },
  ];

  const adminMenu = [
    {
      title: "Assignments",
      paths: ["/a2", "/a1"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/a2"),
    },
    {
      title: "Feedbacks",
      paths: ["/viewFeed", "/emailAss"],
      icon: <i className="ri-file-list-line"></i>,
      onClick: () => navigate("/viewFeed", "/emailAss"),
    },
    {
      title: "Evaluations",
      paths: ["/test"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/test"),
    },
    {
      title: "Profile",
      paths: ["/profile"],
      icon: <i className="ri-user-line"></i>,
      onClick: () => navigate("/profile"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/plogin");
      },
    },
  ];


  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await tgetUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));
        if (response.data.isAdmin) {
          setMenu(adminMenu);
        } else {
          setMenu(userMenu);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      navigate("/login"); //if there is problem with token user navigate login
      dispatch(HideLoading());
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token1")) {
      getUserData();
    } else {
      navigate("/"); //if there is problem with token user navigate login
    }
  }, []);

  const activeRoute = window.location.pathname;

  const getIsActiveOrNot = (paths) => {
    if (paths.includes(activeRoute)) {
      return true;
    } else {
      if (
        activeRoute.includes("/smt") &&
        paths.includes("/smt")
      ) {
        return true;
      }
      if (
        activeRoute.includes("/sms") &&
        paths.includes("/sms")
      ) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    console.log(username);
    let usernameFrom = localStorage.getItem("userName");
    if (usernameFrom == 'undefined' || usernameFrom == null || usernameFrom == '') {
      navigate("/pteacherLogin");
    }
    if (localStorage.getItem("token1")) {
      console.log(username);
    } else {
      navigate("/"); //if there is problem with token user navigate login
    }
    // username = ;
    console.log(usernameFrom);
    if (username === "") {
      let userNameReload = localStorage.getItem("userName");
      getProfileTeacher(userNameReload).then((results) => {
        let apiData = results.data;
        setApiData1(results.data);

        console.log(results.data.isAdmin);
        if (results.data.isAdmin) {
          setMenu(adminMenu);
        } else {
          setMenu(userMenu);
        }
        console.log(results);
        setFile(apiData?.profile || "");
        setApiData({
          firstName: apiData?.firstName || "",
          lastName: apiData?.lastName || "",
          email: apiData?.email || "",
          teaId: apiData?.teaId || "",
          address: apiData?.address || "",
          profile: apiData?.profile || "",
          id: apiData._id,
          teacherId: apiData?.teacherId,
          isAdmin: apiData?.isAdmin || "",

        });
      });
    } else {
      getProfileTeacher(username).then((results) => {
        let apiData = results.data;
        setApiData1(results.data);

        console.log(results.data.isAdmin);
        if (results.data.isAdmin) {
          setMenu(adminMenu);
        } else {
          setMenu(userMenu);
        }
        console.log(results);
        setFile(apiData?.profile || "");
        setApiData({
          firstName: apiData?.firstName || "",
          lastName: apiData?.lastName || "",
          email: apiData?.email || "",
          teaId: apiData?.teaId || "",
          address: apiData?.address || "",
          profile: apiData?.profile || "",
          id: apiData._id,
          teacherId: apiData?.teacherId,
          isAdmin: apiData?.isAdmin || "",

        });
      });
    }
  }, []);


  return (

    <div className="layout !fixed top-0 left-0 h-screen w-1/4 ">
      <div className="!flex gap-6 w-full h-full ">
        <div className="sidebar !h-screen z-auto transition-transform -translate-x-full sm:translate-x-0">
          <div className="menu ">
            {menu.map((item, index) => {
              return (
                <div
                  className={`menu-item ${getIsActiveOrNot(item.paths) && "active-menu-item"
                    }`}
                  key={index}
                  onClick={item.onClick}
                >
                  {item.icon}
                  {!collapsed && <span>{item.title}</span>}
                </div>
              );
            })}
          </div>
        </div>
        <div className="body">
          <div className="header flex justify-between">
            {!collapsed && (
              <i
                className="ri-close-line"
                onClick={() => setCollapsed(true)}
              ></i>
            )}
            {collapsed && (
              <i
                className="ri-menu-line"
                onClick={() => setCollapsed(false)}
              ></i>
            )}
            <h1 className="text-2xl text-white">STUDY MATERIAL SECTION</h1>
            <div>
              <div className="flex gap-1 items-center">
                <i class="ri-user-line"></i>
                <h1 className="text-md text-white underline">{apiData1.teacherId}</h1>
              </div>
              <span className="text-md text-white">Role : {apiData1.isAdmin ? "Teacher" : "User"}</span>
            </div>
          </div>
          <div className="content">{children}</div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default TprotectedRoute;























// import { message } from "antd";
// import React, { useEffect, useState } from "react";
// import { tgetUserInfo } from "../apicalls/teachers";
// import { useDispatch, useSelector } from "react-redux";
// import { SetUser } from "../redux/usersSlice.js";
// import { useNavigate } from "react-router-dom";
// import { HideLoading, ShowLoading } from "../redux/loaderSlice";
// import '../stylesheets/layout.css'
// import '../stylesheets/theme.css'
// import '../stylesheets/alignments.css'
// import '../stylesheets/textelements.css'
// import '../stylesheets/custom-component.css'
// import '../stylesheets/form-elements.css'
// import {
//   updateUser,
//   getProfileTeacher,
//   deleteUser,
//   updateTeacher,
// } from "../apicalls/helper";
// import { useAuthStore } from "../redux/store1";

// function TprotectedRoute({ children }) {
//   const { user } = useSelector((state) => state.users);
//   const [menu, setMenu] = useState([]);
//   const [collapsed, setCollapsed] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [apiData, setApiData] = useState({});
//   const [apiData1, setApiData1] = useState({});
//   const [file, setFile] = useState();
//   const { username } = useAuthStore((state) => state.auth);

//   const userMenu = [
//     {
//       title: "Home",
//       paths: ["/exams", "/user/write-exam"],
//       icon: <i className="ri-home-line"></i>,
//       onClick: () => navigate("/exams"),
//     },
//     {
//       title: "Reports",
//       paths: ["/user/reports"],
//       icon: <i className="ri-bar-chart-line"></i>,
//       onClick: () => navigate("/user/reports"),
//     },
//     {
//       title: "Profile",
//       paths: ["/profile"],
//       icon: <i className="ri-user-line"></i>,
//       onClick: () => navigate("/profile"),
//     },
//     {
//       title: "Logout",
//       paths: ["/logout"],
//       icon: <i className="ri-logout-box-line"></i>,
//       onClick: () => {
//         localStorage.removeItem("token");
//         navigate("/plogin");
//       },
//     },
//   ];

//   const adminMenu = [
//     // {
//     //   title: "Assignments",
//     //   paths: ["/a2","/a1"],
//     //   icon: <i className="ri-home-line"></i>,
//     //   onClick: () => navigate("/a2"),
//     // },
//     // {
//     //   title: "Feedbacks",
//     //   paths: ["/viewFeed","/emailAss"],
//     //   icon: <i className="ri-file-list-line"></i>,
//     //   onClick: () => navigate("/viewFeed","/emailAss"),
//     // },
//     // {
//     //   title: "Evaluations",
//     //   paths: ["/test"],
//     //   icon: <i className="ri-bar-chart-line"></i>,
//     //   onClick: () => navigate("/test"),
//     // },
//     // {
//     //   title: "Profile",
//     //   paths: ["/profile"],
//     //   icon: <i className="ri-user-line"></i>,
//     //   onClick: () => navigate("/profile"),
//     // },
//     // {
//     //   title: "Logout",
//     //   paths: ["/logout"],
//     //   icon: <i className="ri-logout-box-line"></i>,
//     //   onClick: () => {
//     //     localStorage.removeItem("token");
//     //     navigate("/plogin");
//     //   },
//     // },
//   ];


//   const getUserData = async () => {
//     try {
//       dispatch(ShowLoading());
//       const response = await tgetUserInfo();
//       dispatch(HideLoading());
//       if (response.success) {
//         dispatch(SetUser(response.data));
//         if (response.data.isAdmin) {
//           setMenu(adminMenu);
//         } else {
//           setMenu(userMenu);
//         }
//       } else {
//         message.error(response.message);
//       }
//     } catch (error) {
//       navigate("/login"); //if there is problem with token user navigate login
//       dispatch(HideLoading());
//       message.error(error.message);
//     }
//   };

//   useEffect(() => {
//     if (localStorage.getItem("token")) {
//       getUserData();
//     } else {
//       navigate("/login"); //if there is problem with token user navigate login
//     }
//   }, []);

//   const activeRoute = window.location.pathname;

//   const getIsActiveOrNot = (paths) => {
//     if (paths.includes(activeRoute)) {
//       return true;
//     } else {
//       if (
//         activeRoute.includes("/admin/exams/edit") &&
//         paths.includes("/admin/exams")
//       ) {
//         return true;
//       }
//       if (
//         activeRoute.includes("/tuser/write-exam") &&
//         paths.includes("/tuser/write-exam")
//       ) {
//         return true;
//       }
//     }
//     return false;
//   };

//   useEffect(() => {
//     console.log(username);
//     let usernameFrom = localStorage.getItem("userName");
//     // username = ;
//     console.log(usernameFrom);
//     if (username === "") {
//       let userNameReload = localStorage.getItem("userName");
//       getProfileTeacher(userNameReload).then((results) => {
//         let apiData = results.data;
//         setApiData1(results.data);

//       console.log(results.data.isAdmin);
//       if (results.data.isAdmin) {
//         setMenu(adminMenu);
//       } else {
//         setMenu(userMenu);
//       }
//         console.log(results);
//         setFile(apiData?.profile || "");
//         setApiData({
//           firstName: apiData?.firstName || "",
//           lastName: apiData?.lastName || "",
//           email: apiData?.email || "",
//           teaId: apiData?.teaId || "",
//           address: apiData?.address || "",
//           profile: apiData?.profile || "",
//           id: apiData._id,
//           teacherId: apiData?.teacherId,
//           isAdmin: apiData?.isAdmin || "",

//         });
//       });
//     } else {
//       getProfileTeacher(username).then((results) => {
//         let apiData = results.data;
//         setApiData1(results.data);

//       console.log(results.data.isAdmin);
//       if (results.data.isAdmin) {
//         setMenu(adminMenu);
//       } else {
//         setMenu(userMenu);
//       }
//         console.log(results);
//         setFile(apiData?.profile || "");
//         setApiData({
//           firstName: apiData?.firstName || "",
//           lastName: apiData?.lastName || "",
//           email: apiData?.email || "",
//           teaId: apiData?.teaId || "",
//           address: apiData?.address || "",
//           profile: apiData?.profile || "",
//           id: apiData._id,
//           teacherId: apiData?.teacherId,
//           isAdmin: apiData?.isAdmin || "",

//         });
//       });
//     }
//   }, []);


//   return (
//     <div className="layout">
//       <div className="flex gap-2 w-full h-full h-100">
//         <div className="sidebar">
//           <div className="menu ">
//             {menu.map((item, index) => {
//                return (
//                 <div
//                   className={`menu-item ${
//                     getIsActiveOrNot(item.paths) && "active-menu-item"
//                   }`}
//                   key={index}
//                   onClick={item.onClick}
//                 >
//                   {item.icon}
//                   {!collapsed && <span>{item.title}</span>}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//         <div className="body">
//           <div className="header flex justify-between">
//             {!collapsed && (
//               <i
//                 className="ri-close-line"
//                 onClick={() => setCollapsed(true)}
//               ></i>
//             )}
//             {collapsed && (
//               <i
//                 className="ri-menu-line"
//                 onClick={() => setCollapsed(false)}
//               ></i>
//             )}
//             <h1 className="text-2xl text-white">Thilina Institute Assignment Management</h1>
//             <div>
//               <div className="flex gap-1 items-center">
//                 <i class="ri-user-line"></i>
//                 <h1 className="text-md text-white underline">{apiData1.teacherId}</h1>
//               </div>
//               <span>Role : {apiData1.isAdmin ? "Teacher" : "User"}</span>
//             </div>
//           </div>
//           <div className="content">{children}</div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TprotectedRoute;

