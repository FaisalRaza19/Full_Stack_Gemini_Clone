import React, { useEffect, useContext, useState } from 'react';
import { assets } from "../../assets/assets.js";
import './ChatPage.css';
import { ContextApi } from "../../Context/context.jsx";
import { useNavigate, useParams } from 'react-router-dom';

const ChatPage = () => {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [file, setFile] = useState(null); 
    const [result, setResult] = useState([]); 
    const [loadingStates, setLoadingStates] = useState(false); 
    const [getUser, setGetUser] = useState({});
    const { user, NewChat, chatQuiresData, fetchQuiresWithResult } = useContext(ContextApi); 

    useEffect(() => {
        if (user) {
            setGetUser(user);
        }
    }, [user]);

    useEffect(()=>{
        const currentPath = window.location.pathname;
        if(currentPath == "/"){
            setResult([]);
            navigate("/")
        }
        else if(currentPath == "/" && result == true){
            setResult([]);
            navigate("/")
            console.log("Id 2 is not present")
        }
        else{
            console.log("Id is present")
        }
    },[chatId])

    // fetch chat data if id is not present create new chat 
    useEffect(() => {
        if (chatQuiresData.data) {
            setResult(chatQuiresData.data);
        }
        else{
            setResult(chatQuiresData.message)
        }
    }, [chatQuiresData]);

    // fetch chat quires if id is present in url but we did not click any chat present in sidebar
    useEffect(() => {
        if (chatId) {
            const fetchChatData = async () => {
                try {
                    setLoadingStates(true); 
                    await fetchQuiresWithResult({ chatId });
                } catch (error) {
                    console.error("Error fetching chat data:", error);
                } finally {
                    setLoadingStates(false); 
                }
            };
            fetchChatData();
        }
    }, [chatId]);


    // query responce if chat id is available or not 
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!query && !file) return; 

        const queryId = new Date().getTime(); 

        setLoadingStates(true)

        try {
            let newResponse;
            if (chatId) {
                newResponse = await NewChat({ query, file, chatId });
                const newQuery = {
                    query,
                    result: newResponse.result || "No result found",
                    id: queryId
                };

                setResult(prevResult => [...prevResult, newQuery]);

            } else {
                newResponse = await NewChat({ query, file });
                const newQuery = {
                    query,
                    result: newResponse.data.result || "No result found",
                    id: queryId
                };

                setResult([newQuery]);
                navigate(`/c/${newResponse.data.id}`)
            }
        } catch (error) {
            console.error("Something went wrong when fetching chat data", error);
        } finally {
            setQuery(""); 
            setFile(null); 
            setLoadingStates(false)
        }
    };

    // handle file 
    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        console.log(selectedFile)
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    // remove file 
    const removeFile = () => {
        setFile(null);
    };

    //  style fetched data 
    const escapeHtml = (html) => {
        return html
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    };

    const formatResponse = (text) => {
        if (typeof text !== 'string') {
            console.log("No result found");
            return "";
        }

        let parts = [];
        let boldCounter = 1;
        let isCodeBlock = false;

        const segments = text.split(/(```[\s\S]*?```)/g);
        segments.forEach(segment => {
            if (segment.startsWith("```") && segment.endsWith("```")) {
                const codeContent = escapeHtml(segment.slice(3, -3).trim()); 
                parts.push(`<pre style="background-color: #2d2d2d; color: #f8f8f2; padding: 15px; border-radius: 10px; overflow: auto;"><code>${codeContent}</code></pre>`);
                isCodeBlock = true;
            } else {
                if (!isCodeBlock) {
                    segment = segment.replace(/`([^`]*)`/g, `<code style="background-color: #f4f4f4; padding: 2px 5px; border-radius: 3px;">$1</code>`);
                    segment = segment.replace(/\*\*\s*(.*?)\s*\*\*/g, "<strong>$1</strong>");
                    segment = segment.replace(/\*\s*(.*?)\s*\*/g, "<em>$1</em>");

                    segment = segment.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #007bff; text-decoration: none;">$1</a>');
                    segment = segment.replace(/\[(.*?)\]/g, '<a href="#" style="color: #007bff; text-decoration: none;">$1</a>');
                    segment = segment.replace(/\((.*?)\)/g, '<code style="color: #000;">$1</code>');

                    const subSegments = segment.split(/<strong>(.*?)<\/strong>/);
                    subSegments.forEach((subSegment, index) => {
                        if (index % 2 === 1) {
                            parts.push(`<br><strong>${boldCounter++}. ${subSegment.trim()}</strong><br>`);
                        } else {
                            if (subSegment.trim()) {
                                parts.push(subSegment.trim());
                            }
                        }
                    });
                }
                isCodeBlock = false;
            }
        });

        const formattedResponse = `<div class="html-response" style="font-family: sans-serif; color: #333; max-width: 900px; 
        margin: 20px auto; padding: 20px; border-radius: 10px; line-height: 1.6;">${parts.join(" ")}</div>`;

        return formattedResponse;
    };

    return (
        <div className='main'>
            {!result || result.length === 0 ? (
                <div className='main-container'>
                    <div className='greet'>
                        <p><span>Hello, {getUser.fullName || "User"}.</span></p>
                        <p className='help'>How can I help you today?</p>
                    </div>
                    <div className='cards'>
                        <div className='card'>
                            <p>Suggest beautiful places to see on an upcoming road trip</p>
                            <i className="fa-regular fa-compass"></i>
                        </div>
                        <div className='card'>
                            <p>Briefly summarize this concept: Urban planning</p>
                            <i className="fa-regular fa-lightbulb"></i>
                        </div>
                        <div className='card'>
                            <p>Brainstorm team bonding activities for our work retreat</p>
                            <i className="fa-regular fa-message"></i>
                        </div>
                        <div className='card'>
                            <p>Improve the readability of the following code</p>
                            <i className="fa-solid fa-code"></i>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='result'>
                    <div className='result-data'>
                        {result.map((queryData, index) => (
                            <div key={index} className='query-item'>
                                <div className='result-title'>
                                    <p className='query-text'>{queryData.query}</p>
                                </div>
                                <div className="query-result">
                                    <img src={assets.gemini_icon} alt="Gemini Icon" />
                                    {loadingStates[queryData.id] ? ( 
                                        <div className='loader'>
                                            <img src={assets.gemini_icon} alt="Gemini Icon" />
                                            <hr /><hr /><hr />
                                        </div>
                                    ) : (
                                        <p dangerouslySetInnerHTML={{ __html: formatResponse(queryData.result) }}></p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            <div className='main-bottom'>
                <form className='search-box' onSubmit={handleSubmit}>
                    <div className='search'>
                        <input
                            type='text'
                            placeholder='Enter a prompt here'
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <input
                            type='file'
                            id="file-upload"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleFile}
                        />
                        <label htmlFor="file-upload" className="pencil-icon">
                            <i className="fa-regular fa-image"></i>
                        </label>
                        <button className='arrow' type='submit'>
                            {loadingStates ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-arrow-right"></i>}
                        </button>
                    </div>
                    {file && (
                        <div className="file-preview">
                            <p>{file.name}</p>
                            <button className='btn btn-danger' type="button" onClick={removeFile}>Remove</button>
                        </div>
                    )}
                </form>
                <p className='bottom-info'>
                    Gemini may assist with queries and help you brainstorm new ideas or provide summaries of your input.
                </p>
            </div>
        </div>
    );

};

export default ChatPage;
