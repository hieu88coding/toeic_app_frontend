import { useEffect, useState, useRef, forwardRef } from "react";
import { useAuthUser } from "react-auth-kit";
import {
    MessageOutlined, MailOutlined, PhoneOutlined, DownOutlined, UserOutlined, HeartOutlined,
    LogoutOutlined

} from "@ant-design/icons";
import { Divider, Card } from 'antd';





export const Part7Custom = (props) => {
    const exel = props.exel;
    const chunks = [];
    let paragraph = [];
    if (exel !== undefined) {
        if (props.partSelector === 'part71') {
            for (let i = 0; i < 7; i += 2) {
                chunks.push(exel.slice(i, i + 2));
            }
            for (let i = 7; i < 17; i += 3) {
                chunks.push(exel.slice(i, i + 3));
            }
            for (let i = 17; i < 30; i += 4) {
                chunks.push(exel.slice(i, i + 4));
            }
        }
        else if (props.partSelector === 'entrance') {
            for (let i = 0; i < 5; i += 2) {
                chunks.push(exel.slice(i, i + 2));
            }
            for (let i = 5; i < 19; i += 3) {
                chunks.push(exel.slice(i, i + 3));
            }
            for (let i = 19; i < 25; i += 4) {
                chunks.push(exel.slice(i, i + 4));
            }
            for (let i = 25; i < 30; i += 2) {
                chunks.push(exel.slice(i, i + 2));
            }
            for (let i = 30; i < 44; i += 3) {
                chunks.push(exel.slice(i, i + 3));
            }
            for (let i = 42; i < 43; i += 4) {
                chunks.push(exel.slice(i, i + 4));
            }
        } else {
            for (let i = 0; i < exel.length; i += 5) {
                chunks.push(exel.slice(i, i + 5));
            }
        }
        paragraph = exel.map((item) => {
            if (item.para.length !== 0) {
                return item.para;
            }
            return null;
        }).filter((item) => item !== null);
    }
    console.log(chunks);
    console.log(paragraph);
    return (
        <div>
            <Card title={null} style={{ width: '100%', fontSize: 16, marginBottom: 60, backgroundColor: 'rgba(0, 0, 0, .03)' }}>
                <div style={{ fontSize: 16 }} className="part7-instruction">
                    <b>Part 7.</b> In this part you will read a selection of texts, such as magazine and newspaper articles, letters, and advertisements. Each text is followed by several questions. Select the best answer for each question and mark the letter (A), (B), (C), or (D) on your answer sheet.
                </div>
            </Card>
            <Divider />

            <div className="part7-container" style={{ marginBottom: 50, fontSize: 16 }}>
                {
                    paragraph.length !== 0 && paragraph.map((paragraph, index) => (
                        <div className="part7-content">
                            <Card title={null} style={{ width: '98%', fontSize: 16, marginBottom: 60, backgroundColor: 'rgba(0, 0, 0, .03)' }}>
                                <div dangerouslySetInnerHTML={{ __html: `${paragraph}` }}></div>
                            </Card>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridAutoRows: 'minmax(0, 1fr)', padding: 20, marginTop: 30 }}>
                                {chunks.length !== 0 && chunks[index].map((exel, chunkIndex) => (
                                    <div className="Part7-question" key={`question${exel.number}`} style={{
                                        //gridColumn: chunkIndex % 2 !== 0 ? '2 / 3' : '1',
                                        marginBottom: 20
                                    }}>
                                        <div className="part7-title" style={{ maxWidth: '80%', fontWeight: 'bold', marginBottom: 10 }}>Question {exel.number}. <span dangerouslySetInnerHTML={{ __html: `${exel.question}` }}></span></div>
                                        <div className="part7-answer" style={{ marginBottom: 10 }}>
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