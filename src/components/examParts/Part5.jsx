import { useEffect, useState, useRef, forwardRef } from "react";
import { useAuthUser } from "react-auth-kit";
import {
    MessageOutlined, MailOutlined, PhoneOutlined, DownOutlined, UserOutlined, HeartOutlined,
    LogoutOutlined

} from "@ant-design/icons";
import { Divider, Card } from 'antd';
import "plyr-react/plyr.css";




export const Part5 = (props) => {
    const exel = props.exel;
    return (
        <div>
            <Card title={null} style={{ width: '98%', fontSize: 16, marginBottom: 60, backgroundColor: 'rgba(0, 0, 0, .03)' }}>
                <div className="part5-instruction">
                    <b>Part 5.</b> A word or phrase is missing in each of the sentences below. Four answer choices are given below each sentence. Select the best answer to complete the sentence. Then mark the letter (A), (B), (C), or (D) on your answer sheet.
                </div>
            </Card>
            <div className="part5-container" style={{ marginBottom: 50, fontSize: 16 }}>
                <div className="part5-content">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', padding: 20, marginTop: 30 }}>
                        {exel && exel.map((exel, chunkIndex) => (
                            <div className="part5-question" key={`question${exel.number}`} style={{
                                //gridColumn: chunkIndex % 2 !== 0 ? '2 / 3' : '1',
                                marginBottom: 20
                            }}>
                                <div className="part5-title" style={{ maxWidth: '80%', fontWeight: 'bold', marginBottom: 10 }}>Question {exel.number}. <span dangerouslySetInnerHTML={{ __html: `${exel.question}` }}></span></div>
                                <div className="part5-answer" style={{ marginBottom: 10 }}>
                                    <div>{exel.answerA}</div>
                                    <div>{exel.answerB}</div>
                                    <div>{exel.answerC}</div>
                                    <div>{exel.answerD}</div>
                                </div>

                            </div>
                        ))}

                    </div>
                    <Divider />
                </div>
            </div>
        </div>


    );
};