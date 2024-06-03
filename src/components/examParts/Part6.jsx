import { useEffect, useState, useRef, forwardRef } from "react";
import { useAuthUser } from "react-auth-kit";
import {
    MessageOutlined, MailOutlined, PhoneOutlined, DownOutlined, UserOutlined, HeartOutlined,
    LogoutOutlined

} from "@ant-design/icons";
import { Divider, Card } from 'antd';
import "plyr-react/plyr.css";




export const Part6 = (props) => {
    const exel = props.exel;
    const chunks = [];
    let paragraph = []
    if (exel !== undefined) {
        for (let i = 0; i < exel.length; i += 4) {
            chunks.push(exel.slice(i, i + 4));
        }
        paragraph = exel.map((item) => {
            if (item.question.length !== 0) {
                return item.question;
            }
            return null;
        }).filter((item) => item !== null);
    }


    return (
        <div>
            <Card title={null} style={{ width: '100%', fontSize: 16, marginBottom: 60, backgroundColor: 'rgba(0, 0, 0, .03)' }}>
                <div style={{ fontSize: 16 }} class="part6-instruction">
                    <b>Part 6.</b> A word or phrase is missing in each of the sentences below. Four answer choices are given below each sentence. Select the best answer to complete the sentence. Then mark the letter (A), (B), (C), or (D) on your answer sheet. Read the texts that follow. A word or phrase is missing in some of the sentences. Four answer choices are given below each of the sentences. Select the best answer to complete the text. Then mark the letter (A), (B), (C), or (D) on your answer sheet.
                </div>
            </Card>
            <Divider />

            <div className="part6-container" style={{ marginBottom: 50, fontSize: 16 }}>
                {
                    paragraph.length !== 0 && paragraph.map((paragraph, index) => (
                        <div className="part6-content" key={index}>
                            <Card title={null} style={{ width: '98%', fontSize: 16, marginBottom: 60, backgroundColor: 'rgba(0, 0, 0, .03)' }}>
                                <div dangerouslySetInnerHTML={{ __html: `${paragraph}` }}></div>
                            </Card>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', padding: 20, marginTop: 30 }}>
                                {chunks.length !== 0 && chunks[index].map((exel, chunkIndex) => (
                                    <div className="part6-question" key={`question${exel.number}`} style={{
                                        //gridColumn: chunkIndex % 2 !== 0 ? '2 / 3' : '1',
                                        marginBottom: 20
                                    }}>
                                        <div className="part6-title" style={{ maxWidth: '80%', fontWeight: 'bold', marginBottom: 10 }}>Question {exel.number}.</div>
                                        <div className="part6-answer" style={{ marginBottom: 10 }}>
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
                    ))}
            </div>

        </div>


    );
};