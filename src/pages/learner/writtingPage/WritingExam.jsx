import * as React from "react";
import { useState, useEffect, useRef, forwardRef } from "react";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import { Card, Steps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { publicRequest } from "../../../requestMethods";
import { Link, useNavigate, useLocation } from "react-router-dom";
import WrittingGrader from "../../../components/chatGPT/WrittingGrader";

const WrittingExam = () => {
    const refAudio = useRef(null);
    const [paragraph, setParagraph] = useState('Hi. This is Myra Peters calling about my appointment with Dr. Jones. I have a three o’clock appointment scheduled for this afternoon. Unfortunately, I won’t be able to keep it because of an important meeting at work. So, I’ll need to reschedule. I was hoping to come in sometime next week. Any time Monday, Tuesday, or Wednesday afternoon would work for me. I hope the doctor has some time available on one of those days. Please call me back and let me know.')
    const navigate = useNavigate();


    return (
        <div>
            <Topbar></Topbar>
            <TopMenu active={" "}></TopMenu>
            <div className="writtingExamContainer">
                <div style={{
                    width: '70%',
                    display: 'flex', flexDirection: 'column',
                    marginLeft: 'auto', marginRight: 'auto', marginTop: '50px',
                    marginBottom: 200, fontSize: 18
                }} className="WrittingExamContent">
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', marginTop: '50px' }}>
                        <Card style={{ width: '100%', fontSize: 18 }}>
                            <div style={{ fontWeight: 700 }}>Directions:</div>
                            <div dangerouslySetInnerHTML={{
                                __html: `<p><em>Read the e-mail.</em><br>
From: George Pinkney<br>
To: Social Committee members<br>
Subject: Meeting<br>
Sent: April 12, 20 -<br>
It is time for a meeting of the Social Committee. We need to start planning the annual year-end party. I would like all members of the committee to meet next Friday morning from 9 to 11 in Conference Room A. Please let me know as soon as possible if you are available to attend this meeting.<br>
Thank you.<br>
George Pinkney<br>
Social Committee Chair<br><em>Respond to the e-mail as if you are a member of the Social Committee. In your e-mail, explain ONE problem and make TWO suggestions.</em></p>` }}></div>                        </Card>

                    </div>
                    <Card style={{ width: '100%', marginTop: '50px', height: 900 }}>
                        <WrittingGrader />
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default WrittingExam; 