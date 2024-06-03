import * as React from "react";
import { useState, useEffect, useRef, forwardRef, useContext, useMemo } from "react";
import { Topbar } from "../../../components/topbar/Topbar";
import { TopMenu } from "../../../components/topMenu/TopMenu";
import { Card, Steps } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { publicRequest } from "../../../requestMethods";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LevelSelector from "../../../components/levelSelector/LevelSelector";
import EntrancePage from "./EntrancePage";
const description = 'This is a description.';
const NewRoadMap = () => {
    const [listening, setListening] = useState([]);
    const [reading, setReading] = useState([]);
    const [next, setNext] = useState(false);
    const [selected, setSelected] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const navigate = useNavigate();
    const answers = useLocation().state?.submitData || [];
    useEffect(() => {
        if (answers.length !== 0 && answers.userScore !== null) {
            setCurrentStep(1);
        }
    }, [answers]);
    const handleNextClick = (value) => {
        setSelected(value);
        setNext(!next);
    }
    const handleEntranceClick = (value) => {
        setCurrentStep(value);
    }

    return (
        <div>
            <Topbar></Topbar>
            <TopMenu active={" "}></TopMenu>
            <div className="newRoadMapContainer">
                <div className="newRoadMapContent">
                    <Card style={{ width: '70%', marginLeft: 'auto', marginRight: 'auto', marginTop: '50px' }} title={null}>
                        <Steps
                            current={currentStep}
                            items={[
                                {
                                    //title: 'Finished',

                                },
                                {
                                    //title: 'In Progress',


                                },
                                {
                                    //title: 'Waiting',

                                },
                            ]}
                        />
                    </Card>
                    {currentStep === 0 &&
                        <EntrancePage handleEntranceClick={handleEntranceClick} />
                    }
                    {
                        currentStep === 1 &&
                        <LevelSelector userScore={answers.userScore} handleEntranceClick={handleEntranceClick} roadmapSelected={selected} next={next} handleNextClick={handleNextClick} />
                    }

                </div>

            </div>
        </div>
    );
};

export default NewRoadMap; 