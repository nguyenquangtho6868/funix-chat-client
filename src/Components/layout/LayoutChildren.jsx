import { useEffect, useContext } from "react";
import LayoutOfMentorComponent from "./LayoutOfMentor";
import LayoutOfStudentComponent from "./layoutOfStudent";
import { AuthContext } from "../../Context/AuthLogin";
import { API_URL } from "../../Constants/ApiConstant";
import { ColorRing } from "react-loader-spinner";

import io from "socket.io-client";

const socket = io(API_URL);

function LayoutChildrenComponent() {
  const { role } = useContext(AuthContext);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    //console.log(role);
    socket.emit("addUser", userId);
  }, [userId]);
  return (
    <>
      {!role ? (
        <div className="loading-layout">
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
          />
        </div>
      ) : (
        <>
          {role === "STUDENT" ? (
            <LayoutOfStudentComponent />
          ) : (
            <LayoutOfMentorComponent />
          )}
        </>
      )}
    </>
  );
}

export default LayoutChildrenComponent;
