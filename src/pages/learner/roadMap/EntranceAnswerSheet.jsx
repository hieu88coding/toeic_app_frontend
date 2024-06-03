import * as React from "react";
import { useState, useEffect, useContext, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../../components/answerSheet/answerSheet.scss";
import { Space, Card, Button } from "antd";
import { CloseOutlined, CheckOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { useToastError, useToastSuccess } from "../../../utils/toastSettings";
import { publicRequest } from "../../../requestMethods";

const EntranceAnswerSheet = ({ typeSheet, data }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('userInfo'))
    const [userAnswer, setUserAnswer] = useState({});
    const testCode = useLocation().pathname.split("/")[2];
    const partName = useLocation().pathname.split("/")[3];
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
        const submitData = {
            testData: data,
            userAnswer: userAnswer
        }
        navigate(`/result/EntranceTest`, {
            state: {
                submitData: submitData,
            }
        });
    };
    const getQuestionCountsAndStartNumbers = (partName) => {
        if (typeSheet === "exam") {
            switch (partName) {
                case "1":
                    return { questionCount: 6, startedQuestionNumber: 1 };
                case "2":
                    return { questionCount: 25, startedQuestionNumber: 7 };
                case "3":
                    return { questionCount: 39, startedQuestionNumber: 32 };
                case "4":
                    return { questionCount: 30, startedQuestionNumber: 71 };
                case "5":
                    return { questionCount: 30, startedQuestionNumber: 101 };
                case "6":
                    return { questionCount: 16, startedQuestionNumber: 131 };
                case "7":
                    return { questionCount: 54, startedQuestionNumber: 147 };
                default:
                    return { questionCount: 200, startedQuestionNumber: 1 };
            }
        } else if (typeSheet === "listening") {
            return { questionCount: 100, startedQuestionNumber: 1 };
        } else {
            return { questionCount: 200, startedQuestionNumber: 101 };
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
            const answerCount = questionNumber >= 7 && questionNumber <= 31 ? 3 : answers.length;

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
            <div className="answerSheetContainer" style={typeSheet === "exam" ? { marginTop: 70 } : { marginTop: 40 }}>
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

export default EntranceAnswerSheet; 