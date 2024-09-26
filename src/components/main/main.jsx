import React from 'react';
import SideBar from "../SideBar/SideBar.jsx";
import { Routes, Route } from 'react-router-dom';
import ChatPage from '../chatPage/ChatPage';
import "./Main.css";

const Main = ({ setIsLoggedIn }) => {
  return (
    <div className="App">
      <SideBar setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route path='/' element={<ChatPage />} />
        <Route path='/c/:chatId' element={<ChatPage />} />
      </Routes>
    </div>
  );
};

export default Main;
