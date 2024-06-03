import React from 'react';
import { useState, useEffect } from 'react'
import { Card, Input, Button, Spin, Collapse } from "antd";
import { BulbTwoTone, EditTwoTone } from "@ant-design/icons";


const { TextArea } = Input;
const API_KEY = 'sk-proj-li3zwOiKdgefJQx8Yzt2T3BlbkFJx2ys5uWS2EhC2WtM3QJJ';
const systemMessage = {
    "role": "system", "content": "Suggested fixes and examples for each criterion as a Toeic Teacher"
}

const WrittingGrader = () => {
    const [items, setItems] = useState([

    ])
    const [messages, setMessages] = useState([
        {
            message: "Hello, I'm ChatGPT! Ask me anything!",
            sentTime: "just now",
            sender: "ChatGPT"
        }
    ]);
    const [textareaValue, setTextareaValue] = useState('');
    const [isSubmit, setIsSubmit] = useState(false);
    const handleTextareaChange = (event) => {
        setTextareaValue(event.target.value);
    };

    const string = `cho yêu cầu sau : Directions:
    Read the e-mail.
    From: George Pinkney
    To: Social Committee members
    Subject: Meeting
    Sent: April 12, 20 -
    It is time for a meeting of the Social Committee. We need to start planning the annual year-end party. I would like all members of the committee to meet next Friday morning from 9 to 11 in Conference Room A. Please let me know as soon as possible if you are available to attend this meeting.
    Thank you.
    George Pinkney
    Social Committee Chair
    Respond to the e-mail as if you are a member of the Social Committee. In your e-mail, explain ONE problem and make TWO suggestions.`;

    const handleSubmit = async () => {
        setIsSubmit(true);
        let newString = `Câu trả lời của người dùng : ${textareaValue}"
    
        Nhận xét câu trả lời đó với với các tiêu chí dưới dạng các div (dưới 20 từ) :
        ngữ pháp (grammar)
        từ vựng (vocabulary)
        cách tổ chức (organization)
        (Điểm: 0-5)`
        const result = string + "\n" + newString;
        await handleSend(result);
    }

    const handleNewPara = async () => {
        let newString = `Answer in 300 words. You dont have to confirm the question. Start with the answer right-away`
        let result = string + "\n" + newString;
        await handleSend(result);
    }

    useEffect(() => {
        if (messages.length === 3) {
            handleNewPara();
        }
    }, [messages]);

    const handleTryAgain = () => {
        setIsSubmit(false);
        setMessages(prevArray => prevArray.slice(0, -4));
    }

    const handleSend = async (message) => {
        const newMessage = {
            message,
            direction: 'outgoing',
            sender: "user"
        };

        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        console.log(newMessages);
        // Initial system message to determine ChatGPT functionality
        // How it responds, how it talks, etc.
        await processMessageToChatGPT(newMessages);
    };

    async function processMessageToChatGPT(chatMessages) { // messages is an array of messages

        let apiMessages = chatMessages.map((messageObject) => {
            let role = "";
            if (messageObject.sender === "ChatGPT") {
                role = "assistant";
            } else {
                role = "user";
            }
            return { role: role, content: messageObject.message }
        });
        console.log(apiMessages);

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,
                ...apiMessages
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiRequestBody)
            }).then((data) => {
                return data.json();
            }).then((data) => {
                console.log(data);
                setMessages([...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "ChatGPT"
                }]);
            });
    }
    return (
        <div>
            <div style={{ fontSize: 18, marginBottom: 20 }}>
                <div style={{ fontWeight: 700, marginBottom: 20 }}>Your answer: </div>
                <TextArea showCount style={{ fontSize: 18 }} onChange={handleTextareaChange} rows={4} autoComplete="off" spellCheck={false} placeholder="type your response here and click submit" />
            </div>
            {
                !isSubmit &&
                <Button type='primary' onClick={() => handleSubmit()}>Submit</Button>
            }
            {
                isSubmit &&
                <Button onClick={() => handleTryAgain()}>Try again</Button>
            }


            {
                messages[2] && messages[2].message &&
                <div style={{ marginTop: 20, fontSize: 18 }}>
                    <b style={{ color: '#1677ff' }}><EditTwoTone twoToneColor="#1677ff" /> Feedback: </b>
                    <div style={{ marginTop: 20, fontSize: 16 }} dangerouslySetInnerHTML={{ __html: `${messages[2].message}` }}></div>
                </div>

            }
            {
                messages[4] && messages[4].message &&
                <div style={{ marginTop: 20, fontSize: 18 }}>
                    <b style={{ color: '#FADB14' }}><BulbTwoTone twoToneColor="#FADB14" /> Suggested answer: </b>
                    <div style={{ marginTop: 20 }} dangerouslySetInnerHTML={{ __html: `"${messages[4].message}"` }}></div>
                </div>

            }

            {
                isSubmit && !messages[4] &&
                <div>
                    <Spin tip="Đang đánh giá bài viết...">
                        <div> </div>
                    </Spin>
                </div>

            }

        </div>
    );
};
export default WrittingGrader;