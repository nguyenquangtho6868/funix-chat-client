import { Routes, Route } from 'react-router-dom';
import AuthLoginProvider from './Context/AuthLogin';
import LoginComponent from './Components/login/LoginComponent';
import { ToastContainer } from 'react-toastify';
import LayoutComponent from './Components/layout/Layout';
import LayoutChildrenComponent from './Components/layout/LayoutChildren';
import HistoryComponent from './Components/history/History';
import ChatRoomComponent from './Components/chatRoom/ChatRoom';
import LayoutMentorChildComponent from './Components/layout/LayoutMentorChild';
import ProfileComponent from './Components/Profile/Profile';
import DatePickerProvider from './Context/DatePickerProvider';
import ViewChatHistoryComponent from './Components/history/ViewChatHistory';
import 'react-toastify/dist/ReactToastify.css';
import '@fontsource/roboto/300.css';
import './App.css';

function App() {

  return (
    <div className="App">
      <AuthLoginProvider>
        <DatePickerProvider>
          <Routes>
            <Route path="/" element={<LoginComponent />} />
            <Route path="/home" element={<LayoutComponent />}>
              <Route path="" element={<LayoutChildrenComponent />}>
                <Route path="group-chat-mentor/:id" element={<LayoutMentorChildComponent />} />
              </Route>
              <Route path="history" element={<HistoryComponent />} />
              <Route path="profile" element={<ProfileComponent />} />
            </Route>
            <Route path="view-chat-history/:roomId" element={<ViewChatHistoryComponent />} />
            <Route path="group-chat-mentor/:id" element={<LayoutMentorChildComponent />} />
            <Route path="chat-room/:roomId" element={<ChatRoomComponent />} />
          </Routes>
          <ToastContainer />
        </DatePickerProvider>
      </AuthLoginProvider>
    </div>
  );
}

export default App;
