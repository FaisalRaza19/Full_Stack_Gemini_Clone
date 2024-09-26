import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";

export const ContextApi = createContext();

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [chatQuiresData,setChatQuiresData] = useState([]);

    // Register user
    const registerUser = async ({ setIsLoggedIn, credentials, navigate }) => {
        // Ensure all fields are filled
        if (!credentials.fullName || !credentials.email || !credentials.userName || !credentials.password) {
            alert("All fields are required.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/user/register", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            // Check if registration is successful
            if (response.status !== 200 || !response.ok) {
                alert(data.message || "Please enter correct credentials.");
                return;
            }

            // If registration is successful, store token and update state
            localStorage.setItem('token', data.access_token);
            setIsLoggedIn(true);
            alert("New User Created Successfully");
            await fetchUser();
            navigate("/");
            return data;

        } catch (error) {
            console.error("Registration error:", error);
            alert("Registration failed. Please try again later.");
        }
    };

    // Login user
    const loginUser = async ({ e, setIsLoggedIn, credentials, navigate }) => {
        e.preventDefault();

        if (!credentials.email || !credentials.userName || !credentials.password) {
            alert("All fields are required.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/user/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (response.status !== 200 || !response.ok) {
                alert(data.message || "Login failed. Please try again.");
                return;
            }

            localStorage.setItem("token", data.access_token);
            setIsLoggedIn(true);
            await fetchUser();
            navigate("/");
            return data;

        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Please check your credentials or try again later.");
        }
    };

    // Fetch user data
    const fetchUser = async (setIsLoggedIn, navigate) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.warn("No token found. User is not logged in.");
                return;
            }
            if (token == undefined) {
                setIsLoggedIn(false);
                navigate("/login")
            }

            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                localStorage.removeItem("token");
                setIsLoggedIn(false);
                alert("Session expired, please log in again.");
                navigate("/login");
                return;
            }

            const response = await fetch("http://localhost:5000/user/getUser", {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` },
            });

            const data = await response.json();
            setUser(data.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // Logout user
    const handleLogout = async ({ setIsLoggedIn, navigate }) => {
        try {
            const response = await fetch("http://localhost:5000/user/logOut", {
                method: "POST",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
            });

            const data = await response.json();

            localStorage.removeItem("token");
            setIsLoggedIn(false);
            navigate("/login");
            return data;
        } catch (error) {
            console.error("Logout error:", error);
            alert("An error occurred. Please try again.");
        }
    };

    // Change avatar
    const changeAvatar = async (file) => {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const response = await fetch("http://localhost:5000/user/avatar", {
                method: "POST",
                headers: { "Authorization": `Bearer ${localStorage.getItem('token')}` },
                body: formData,
            });

            const data = await response.json();

            setUser((prevUser) => ({ ...prevUser, avatar: data.data }));
            alert("Avatar updated successfully.");
        } catch (error) {
            console.error("Error updating avatar:", error);
            alert("An error occurred while updating the avatar. Please try again.");
        }
    };

    // New Chat 
    const NewChat = async ({ query, file, chatId = null}) => {
        try {
            const fromData = new FormData();
            fromData.append("query", query)
            if (file) {
                fromData.append("file", file)
            };
            if (chatId ) {
                fromData.append("chatId", chatId)
            }

            const response = await fetch("http://localhost:5000/chat/newChat", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: fromData,
            })

            const data = await response.json();
            if (data.statusCode === 200 || data.ok) {
                return data;
            }
        } catch (error) {
            console.log("Somethin went wrong to fetch new chat responce", error)
        }
    }

    const fetchQuiresWithResult = async({chatId})=>{
        try {
            const formData = new FormData();
            formData.append("chatId",chatId)
            const responce = await fetch("http://localhost:5000/chat/getAllQueriesResult",{
                method : "POST",
                headers : {
                    "Authorization" : `Bearer ${localStorage.getItem('token')}`,
                },
                body : formData,
            })
            const data = await responce.json();
            if(data.statusCode == 200 || data.ok){
                setChatQuiresData(data);
                return data;
            }
        } catch (error) {
            console.log("Something went wrong to fetch chat quires data",error)
        }
    }

    // Edit chat 
    const editChat = async (id, newChat) => {
        try {
            const response = await fetch("http://localhost:5000/chat/reNameChat", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ chatId: id, newName: newChat }),
            });

            const data = await response.json();

            setUser((prevUser) => ({
                ...prevUser,
                chatHistory: prevUser.chatHistory.map((chat) =>
                    chat.id === id ? { ...chat, name: newChat } : chat
                ),
            }));
            // setChatEdit(data);
            return data;
            alert("Chat name updated successfully.");
        } catch (error) {
            console.error("Error editing chat name:", error);
        }
    };

    // Delete chat
    const deleteChat = async (id, navigate) => {
        try {
            const response = await fetch("http://localhost:5000/chat/delChat", {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ chatId: id }),
            });

            const data = await response.json();

            setUser((prevUser) => ({
                ...prevUser,
                chatHistory: prevUser.chatHistory.filter((chat) => chat.id !== id),
            }));

            alert("Chat deleted successfully.");
            return data;
        } catch (error) {
            console.error("Error deleting chat:", error);
            alert("An error occurred while deleting the chat. Please try again.");
        }
    };

    // Fetch user on mount
    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <ContextApi.Provider value={{
            registerUser,
            loginUser,
            handleLogout,
            fetchUser,
            user,
            changeAvatar,
            NewChat,
            fetchQuiresWithResult,
            chatQuiresData,
            editChat,
            deleteChat,
        }}>
            {children}
        </ContextApi.Provider>
    );
};
