import * as React from "react";
import { useState, useEffect, useRef, forwardRef, createRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./answerSheet.scss";
import { Space, Card, Button } from "antd";
import { CloseOutlined, CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

const AnswerSheet = (props) => {
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const handleAnswerSelect = (questionNumber, answer) => {
        setSelectedAnswers((prevSelectedAnswers) => {
            // Kiểm tra xem đáp án đã được chọn hay chưa
            if (prevSelectedAnswers[questionNumber] === answer) {
                // Nếu đã được chọn, bỏ chọn nó
                const newSelectedAnswers = { ...prevSelectedAnswers };
                delete newSelectedAnswers[questionNumber];
                return newSelectedAnswers;
            } else {
                // Nếu chưa được chọn, thêm nó vào selectedAnswers
                return {
                    ...prevSelectedAnswers,
                    [questionNumber]: answer,
                };
            }
        });
    };
    const renderAnswers = () => {
        const answers = ["A", "B", "C", "D"];
        const questionCount = props.questionCount;
        const questionWithThreeAnswers = [
            11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
            21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
            31, 32, 33, 34, 35, 36, 37, 38, 39, 40
        ];

        return Array.from({ length: questionCount }, (_, index) => {
            const questionNumber = props.startedQuestionNumber + index;
            const hasThreeAnswers = questionWithThreeAnswers.includes(questionNumber);
            const answerCount = hasThreeAnswers ? 3 : answers.length;

            return (
                <div className="question" key={questionNumber} >
                    <div className="questNumber">
                        <Button style={{ fontWeight: 'bold' }} type="text" shape="circle">
                            {questionNumber}
                        </Button>
                    </div>
                    {Array.from({ length: answerCount }, (_, answerIndex) => {
                        const answer = answers[answerIndex];
                        const isSelected = selectedAnswers[questionNumber] === answer;

                        return (
                            <div className="questAns" key={answerIndex}>
                                <Button
                                    style={{ fontWeight: 'bold' }}
                                    type={isSelected ? "primary" : "dashed"}
                                    shape="circle"
                                    onClick={() => handleAnswerSelect(questionNumber, answer)}
                                >
                                    {answer}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            );
        });
    };
    const handleSubmit = () => {
        console.log(selectedAnswers);
    };

    return (
        <div>

            <div className="answerSheetContainer">
                <Scrollbar style={{ maxHeight: 620 }} options={{ suppressScrollX: true }}>
                    <Card title={"ANSWER SHEET"}>
                        {renderAnswers()}
                        <div className="submitBtn" style={{ marginTop: 30 }}>
                            <Button
                                onClick={handleSubmit}
                                style={{
                                    height: '30px',
                                    backgroundColor: '#28a745', color: 'white',
                                    textAlign: 'center',
                                    width: '106%'
                                }}>
                                <CheckOutlined />
                                Nộp bài
                            </Button>
                        </div>
                    </Card>
                </Scrollbar>

            </div>

        </div>
    );
};

export default AnswerSheet; 