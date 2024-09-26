import React, { useContext, useEffect, useState } from 'react';
import { ContextApi } from '../../Context/context';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "./SideBar.css";

const SideBar = ({ setIsLoggedIn }) => {
    const [getUser, setUser] = useState({});
    const [getAvatar, setGetAvatar] = useState("");
    const [isEditing, setIsEditing] = useState(null);
    const [newQuery, setNewQuery] = useState("");
    const [showAll, setShowAll] = useState(false);

    const { fetchUser, handleLogout, user, changeAvatar, editChat, deleteChat, fetchQuiresWithResult, chatQuiresData } = useContext(ContextApi);
    const navigate = useNavigate();

    // Update avatar after upload
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const uploadedAvatarUrl = await changeAvatar(file);
                setGetAvatar(uploadedAvatarUrl);
            } catch (error) {
                console.error("Error uploading avatar:", error);
            }
        }
    };
    // Logout user 
    const Logout = () => {
        handleLogout({ setIsLoggedIn, navigate });
    }
    // show more chat 
    const handleShowMore = () => {
        setShowAll((prevShowAll) => !prevShowAll);
    };
    // edit chat 
    const handleEdit = (id) => {
        setIsEditing(id);
    };
    // rename chat 
    const handleRename = async (id) => {
        if (newQuery.trim() === "") {
            alert("Query cannot be empty.");
            return;
        }
        await editChat(id, newQuery);
        setIsEditing(null);
        setNewQuery("");
    };

    const handleDelete = async (id) => {
        await deleteChat(id, navigate)
    }

    const handleChatQueries = async (chatId) => {
        try {
            await fetchQuiresWithResult({ chatId });
        } catch (error) {
            console.error("Error in handleChatQueries:", error);
        }
    };

    const handleNewChat = async () => {
        const currentUrl = window.location.pathname;

        if (currentUrl == "/") {
            alert("Chat already open. Please enter a query.");
        } else {
            navigate("/");
        }
    };

    useEffect(() => {
        setUser(user);
        setGetAvatar(user.avatar);
        fetchUser(setIsLoggedIn, navigate)
    }, [user]);


    return (
        <div className="nav-bar">
            <div id="nav-bar">
                <input id="nav-toggle" type="checkbox" />
                <div id="nav-header">
                    <a id="nav-title" href="https://codepen.io" target="_blank" rel="noopener noreferrer">
                        G<i className="fab fa-codepen"></i>emini
                    </a>
                    <label htmlFor="nav-toggle">
                        <span id="nav-toggle-burger"></span>
                    </label>
                    <hr />
                </div>
                <div id="nav-content">
                    <div className="nav-button" onClick={handleNewChat}>
                        <i className="fas fa-plus"></i>
                        <span>New Chat</span>
                    </div>
                    <hr />
                    <div className="chats">
                        {getUser.chatHistory && getUser.chatHistory.length > 0 ? (
                            getUser.chatHistory
                                .slice(0, showAll ? getUser.chatHistory.length : 5)
                                .map((chat, index) => {
                                    const chatName = chat.name ? chat.name.slice(0, 18) : "No Chat";
                                    const isNameTruncated = chat.name && chat.name.length >= 18;

                                    return (
                                        <p key={index}>
                                            {isEditing === chat.id ? (
                                                <div>
                                                    <input
                                                        className="form-control me-2"
                                                        type="text"
                                                        value={newQuery}
                                                        onChange={(e) => setNewQuery(e.target.value)}
                                                        placeholder="Enter new query"
                                                    />
                                                    <div className="buttons">
                                                        <button
                                                            onClick={() => handleRename(chat.id)}
                                                            type="button"
                                                            className="btn btn-success mt-2"
                                                        >
                                                            Rename
                                                        </button>
                                                        <button
                                                            onClick={() => setIsEditing(null)}
                                                            type="button"
                                                            className="btn btn-danger mt-2"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>

                                                    <div className="dropdown">
                                                        <i id="dot" className="fa-solid fa-ellipsis-vertical" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                                        <ul className="dropdown-menu">
                                                            <li>
                                                                <p
                                                                    className="dropdown-item"
                                                                    onClick={() => handleEdit(chat.id)}
                                                                >
                                                                    <i className="fas fa-pencil"></i> Rename
                                                                </p>
                                                            </li>
                                                            <li>
                                                                <p className="dropdown-item" onClick={() => handleDelete(chat.id)}>
                                                                    <i className="fas fa-trash"></i> Delete
                                                                </p>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                    <Link key={chat.id} to={`/c/${chat.id}`} onClick={() => handleChatQueries(chat.id)}>
                                                        {chatName} {isNameTruncated ? "...." : ""}
                                                    </Link>

                                                </>
                                            )
                                            }
                                        </p>
                                    );
                                })
                        ) : (
                            <p>No chat found</p>
                        )}
                    </div>

                    <div className="nav-button show" onClick={handleShowMore}>
                        <i className={`fas ${showAll ? 'fa-angle-up' : 'fa-angle-down'}`}></i>
                        <span>{showAll ? 'Show Less' : 'Show More'}</span>
                    </div>
                    <div id="nav-content-highlight"></div>
                </div>
                <input id="nav-footer-toggle" type="checkbox" />
                <div id="nav-footer">
                    <div id="nav-footer-heading">
                        <div id="nav-footer-avatar">
                            <div className="dropdown">
                                <img
                                    src={getAvatar || "https://gravatar.com/avatar/4474ca42d303761c2901fa819c4f2547"}
                                    alt="User Avatar"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                />
                                <ul className="dropdown-menu menu">
                                    <div className="img">
                                        <img
                                            src={getAvatar || "https://gravatar.com/avatar/4474ca42d303761c2901fa819c4f2547"}
                                            id="user-img"
                                            alt="User Avatar"
                                        />
                                        <input
                                            type="file"
                                            id="avatar-upload"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="avatar-upload" className="pencil-icon">
                                            <i className="fas fa-pencil"></i>
                                        </label>
                                    </div>
                                    <li className='dropdown-item'>
                                        <h6>{getUser.email || "user123@gmail.com"}</h6>
                                    </li>
                                    <li className='dropdown-item'>
                                        <h6>{getUser.userName || "user_123_user"}</h6>
                                    </li>
                                    <li className='dropdown-item'>
                                        <button type="button" className="btn btn-success" onClick={Logout}>
                                            Log Out
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div id="nav-footer-titlebox">
                            <p id="nav-footer-title">{getUser.fullName || "User"}</p>
                        </div>
                        <label htmlFor="nav-footer-toggle">
                            <i className="fas fa-caret-up"></i>
                        </label>
                    </div>
                    <div id="nav-footer-content">
                        <ul>
                            <li>
                                <i className="fa-regular fa-circle-question"></i>
                                <span>Help</span>
                            </li>
                            <li>
                                <i className="fa fa-clock"></i>
                                <span>Activity</span>
                            </li>
                            <li>
                                <i className="fa-solid fa-gear"></i>
                                <span>Settings</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default SideBar;