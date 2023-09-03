import { AuthContext } from "../../Context/AuthLogin";
import { useContext } from "react";
import ChatRoomMentor from "./ChatRoomMentor";
import ChatRoomStudent from "./ChatRoomStudent";
function ChatRoomComponent() {
  const { role } = useContext(AuthContext);
  console.log(role);
  return (
    <div> {role === "STUDENT" ? <ChatRoomStudent /> : <ChatRoomMentor />}</div>
  );
}

export default ChatRoomComponent;
