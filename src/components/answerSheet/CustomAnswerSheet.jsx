import * as React from "react";
import { useState, useEffect, useContext, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./customAnswerSheet.scss";
import { Space, Card, Button } from "antd";
import { CloseOutlined, CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useToastError, useToastSuccess } from "../../utils/toastSettings";
import { publicRequest } from "../../requestMethods";

const CustomAnswerSheet = ({ typeSheet, data }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo'))
    const [userAnswer, setUserAnswer] = useState({});
    const testCode = useLocation().pathname.split("/")[4];
    const partName = useLocation().pathname.split("/")[3];
    const type = useLocation().pathname.split("/")[1];
    const updateSelectedAnswers = (questionNumber, answer) => {
        setUserAnswer((prevUserAnswers) => {
            if (prevUserAnswers[questionNumber] === answer) {
                const newSelectedAnswers = { ...prevUserAnswers };
                delete newSelectedAnswers[questionNumber];
                return newSelectedAnswers;
            } else {
                return {
                    ...prevUserAnswers,
                    [questionNumber]: answer,
                };
            }
        });
    };
    const handleAnswerSubmit = async () => {
        console.log("Da submit", userAnswer);
        console.log(data);
        const submitData = {
            testData: data,
            userAnswer: userAnswer
        }
        navigate(`/${type}/${testCode}/${partName}`, {
            state: {
                submitData: submitData,
            }
        });
    };
    const getQuestionCountsAndStartNumbers = (partName) => {
        switch (partName) {
            case "part1":
                return { questionCount: 6, startedQuestionNumber: 1 };
            case "part2":
                return { questionCount: 25, startedQuestionNumber: 1 };
            case "part3":
                return { questionCount: 39, startedQuestionNumber: 1 };
            case "part4":
                return { questionCount: 30, startedQuestionNumber: 1 };
            case "part5":
                return { questionCount: 30, startedQuestionNumber: 1 };
            case "part6":
                return { questionCount: 16, startedQuestionNumber: 1 };
            case "part71":
                return { questionCount: 29, startedQuestionNumber: 1 };
            case "part72":
                return { questionCount: 10, startedQuestionNumber: 1 };
            case "part73":
                return { questionCount: 15, startedQuestionNumber: 1 };
            default:
                return { questionCount: 200, startedQuestionNumber: 1 };
        }
    };
    const handleAnswerSelect = useCallback((questionNumber, answer) => {
        updateSelectedAnswers(questionNumber, answer);
    });
    const renderAnswers = useCallback(() => {
        const answers = ["A", "B", "C", "D"];
        const partName = useLocation().pathname.split("/")[3];
        const { questionCount, startedQuestionNumber } = getQuestionCountsAndStartNumbers(partName);;


        return Array.from({ length: questionCount }, (_, index) => {
            const questionNumber = startedQuestionNumber + index;
            const answerCount = partName === 'part2' ? 3 : answers.length;

            return (
                <div className="question" key={questionNumber}>
                    <div className="questNumber">
                        <Button style={{ fontWeight: 'bold' }} type="text" shape="circle">
                            {questionNumber}
                        </Button>
                    </div>
                    {Array.from({ length: answerCount }, (_, answerIndex) => {
                        const answer = answers[answerIndex];
                        const isSelected = userAnswer[questionNumber] === answer;

                        return (
                            <div className="questAns" key={answer}>
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
    });

    return (
        <div>
            <div className="customAnswerSheetContainer" style={typeSheet === "exam" ? { marginTop: 70 } : { marginTop: 40 }}>
                <Scrollbar style={{ maxHeight: 610 }} options={{ suppressScrollX: true }}>
                    <Card title={<> <div>
                        <Button
                            type="primary"
                            style={{
                                width: '100%'
                            }}
                            onClick={handleAnswerSubmit}
                            icon={<CheckOutlined />}>Nộp bài</Button>
                    </div></>}>
                        {renderAnswers()}


                    </Card>

                </Scrollbar>
            </div>

        </div>
    );
};

export default CustomAnswerSheet; 