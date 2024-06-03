import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Modal, Space } from 'antd';
import "plyr-react/plyr.css";
import { usePlyr } from "plyr-react";
const audioOptions = undefined;
const CustomPlyrInstance = forwardRef((props, ref) => {
    const { source, options = null } = props;
    const raptorRef = usePlyr(ref, { options, source });
    useEffect(() => {
        const { current } = ref;
        if (current.plyr.source === null) return;

        const api = current;
        api.plyr.on("ready", () => { });
        api.plyr.on("canplay", () => {
            // api.plyr.play();
        });
        api.plyr.on("ended", () => { });
    });

    const handleClick = () => {
        raptorRef.current.play();
    };

    return (
        <audio
            ref={raptorRef}
            className="plyr-react plyr"
            muted={true}
            onClick={handleClick}
        />
    );
});

const CustomDetailModal = (props) => {
    const [state, setState] = useState([]);
    const [exelPara, setExelPara] = useState([]);
    const [part7Slice, setPart7Slice] = useState(0);
    const refAudio = useRef(null);
    const data = props.data;
    console.log(data);
    const handlePart = () => {
        if (props.part && props.part === 'part6') {
            let paragraph = data.exel[3].map((item) => {
                console.log(item);
                if (item.question === undefined) {
                    return '';
                }
                if (item?.question.length !== 0) {
                    return `${item.question}`;
                }
                return null;
            }).filter((item) => item !== null);
            setExelPara(paragraph)
        }
        if (props.part && props.part === 'part7') {
            let paragraph = data.exel[4].map((item) => {
                console.log(item);
                if (item.question === undefined) {
                    return '';
                }
                if (item?.question.length !== 0) {
                    return `${item.question}`;
                }
                return null;
            }).filter((item) => item !== null);
            setExelPara(paragraph)
        }
    }

    const handlePart7 = () => {
        if (props.part && props.part === 'part7') {
            if (props.questionNumber >= 147 && props.questionNumber < 153) {
                setPart7Slice(2)
            } else if (props.questionNumber >= 153 && props.questionNumber < 156) {
                setPart7Slice(3)
            } else if (props.questionNumber >= 156 && props.questionNumber < 158) {
                setPart7Slice(2)
            } else if (props.questionNumber >= 158 && props.questionNumber < 161) {
                setPart7Slice(3)
            } else if (props.questionNumber >= 161 && props.questionNumber < 169) {
                setPart7Slice(4)
            } else if (props.questionNumber >= 169 && props.questionNumber < 172) {
                setPart7Slice(3)
            } else if (props.questionNumber >= 172 && props.questionNumber < 176) {
                setPart7Slice(4)
            } else {
                setPart7Slice(5)
            }
        }
    }

    const handleRender = () => {
        if (data && data.length !== 0 && props.part) {
            switch (props.part) {
                case 'part1':
                    setState({
                        exel: '',
                        audio: data.audio[props.questionNumber - 1],
                        images: data.images[props.questionNumber - 1],
                        correctAnswer: data.answer[0][props.questionNumber - 1],
                        userAnswer: props.userAnswer[props.questionNumber.toString()]
                    })
                    break;
                case 'part2':
                    setState({
                        exel: '',
                        audio: data.audio[props.questionNumber - 1],
                        images: '',
                        correctAnswer: data.answer[0][props.questionNumber - 1],
                        userAnswer: props.userAnswer[props.questionNumber.toString()]
                    })
                    break;
                case 'part3':
                    if (props.questionNumber >= 65 && props.questionNumber <= 70) {
                        setState({
                            images: (data.images[Math.floor((props.questionNumber - 65) / 3) + 6]),
                            exel: (data.exel[0][props.questionNumber - 32]),
                            audio: (data.audio[Math.floor((props.questionNumber - 31) / 3) + 31]),
                            correctAnswer: (data.answer[0][props.questionNumber - 1]),
                            userAnswer: (props.userAnswer[props.questionNumber - 1]),
                        })
                    } else {
                        setState({
                            images: '',
                            exel: (data.exel[0][props.questionNumber - 32]),
                            audio: (data.audio[Math.floor((props.questionNumber - 31) / 3) + 31]),
                            correctAnswer: (data.answer[0][props.questionNumber - 1]),
                            userAnswer: (props.userAnswer[props.questionNumber - 1]),
                        })
                    }

                    break;
                case 'part4':
                    if (props.questionNumber >= 95 && props.questionNumber <= 100) {
                        setState({
                            images: (data.images[Math.floor((props.questionNumber - 95) / 3) + 8]),
                            exel: (data.exel[1][props.questionNumber - 71]),
                            audio: (data.audio[Math.floor((props.questionNumber - 95) / 3) + 44]),
                            correctAnswer: (data.answer[0][props.questionNumber - 1]),
                            userAnswer: (props.userAnswer[props.questionNumber - 1]),
                        })

                    } else {
                        setState({
                            images: '',
                            exel: (data.exel[1][props.questionNumber - 71]),
                            audio: (data.audio[Math.floor((props.questionNumber - 95) / 3) + 44]),
                            correctAnswer: (data.answer[0][props.questionNumber - 1]),
                            userAnswer: (props.userAnswer[props.questionNumber - 1]),
                        })
                    }

                    break;
                case 'part5':
                    setState({
                        images: '',
                        exel: (data.exel[2][props.questionNumber - 101]),
                        audio: '',
                        correctAnswer: (data.answer[0][props.questionNumber - 1]),
                        userAnswer: (props.userAnswer[props.questionNumber - 1]),
                    })
                    break;
                case 'part6':
                    let temp = data.exel[3][props.questionNumber - 131];
                    if (temp && temp !== undefined && temp.length !== 0) {
                        temp.question = exelPara[Math.floor((props.questionNumber - 131) / 4)];
                        console.log(data.answer[0][props.questionNumber - 1]);
                        console.log(props.userAnswer[props.questionNumber - 1]);
                        setState({
                            exel: temp,
                            images: '',
                            audio: '',
                            correctAnswer: (data.answer[0][props.questionNumber - 1]),
                            userAnswer: (props.userAnswer[props.questionNumber - 1])
                        })
                    }

                    break;

                default:
                    let part7 = data.exel[4][props.questionNumber - 147];
                    if (part7 && part7 !== undefined && part7.length !== 0 && part7Slice !== 0) {
                        part7.question = exelPara[Math.floor((props.questionNumber - 147) / part7Slice)];
                        setState({
                            exel: part7,
                            images: '',
                            audio: '',
                            correctAnswer: (data.answer[0][props.questionNumber - 1]),
                            userAnswer: (props.userAnswer[props.questionNumber - 1])
                        })
                    }

                    break;
            }
        }
    }
    useEffect(() => {
        handlePart();
    }, []);
    useEffect(() => {
        handleRender();
        handlePart7();
    }, [props.questionNumber]);

    return (
        <>
            <Modal
                title="Đáp án chi tiết"
                open={props.open}
                onCancel={props.hideModal}
                footer={null}
            >
                {props.part && state.length !== 0 && state !== undefined &&
                    <div div className="part3-container" style={{ marginBottom: 50, fontSize: 16 }}>
                        <div className="part3-content">
                            {state?.audio.length !== 0 && <div className="part3-audio" style={{ width: '100%', display: 'flex', flexDirection: `column` }}>
                                <CustomPlyrInstance ref={refAudio} type="audio" source={{
                                    type: "audio",
                                    sources: [
                                        {
                                            type: "audio/mp3",
                                            src: state?.audio,
                                        },
                                    ],
                                }} options={audioOptions} />
                            </div>}
                            {state?.images.length !== 0 && <div className="part3-images" style={{ width: '80%', maxHeight: '321px', margin: '0 auto' }}>
                                <img style={{ width: '100%', height: 'auto', maxHeight: '100%' }} src={state?.images} />
                            </div>}
                            {state?.exel && state?.exel !== undefined && <div style={{ marginTop: 30 }}>
                                <div className="part3-question" key={`question${state?.exel?.number}`} style={{
                                    marginBottom: 20
                                }}>
                                    <div className="part3-title" style={{ fontWeight: 'bold', marginBottom: 10 }}>Question {state?.exel?.number}. <span dangerouslySetInnerHTML={{ __html: `${state?.exel?.question}` }}></span></div>
                                    <div className="part3-answer" style={{ marginBottom: 10 }}>
                                        <div>{state?.exel?.answerA}</div>
                                        <div>{state?.exel?.answerB}</div>
                                        <div>{state?.exel?.answerC}</div>
                                        <div>{state?.exel?.answerD}</div>
                                    </div>
                                </div>
                                <Divider />
                            </div>}
                            {state?.correctAnswer.length !== 0 && props.result &&
                                <div style={{ marginTop: 20 }}>
                                    <div>Đáp án của bạn: <span style={{ color: props.result[props.questionNumber - 1].color }}>{state?.userAnswer !== undefined ? `(${state?.userAnswer})` : '(chưa làm)'}</span></div>
                                    <div style={{ marginBottom: 20 }}>Đáp án đúng: <span style={{ color: '#52c41a' }}>{state?.correctAnswer.correctAnswer}</span></div>
                                    <strong>Giải thích: <div dangerouslySetInnerHTML={{ __html: `${state?.correctAnswer?.explanation}` }}></div></strong>
                                </div>

                            }
                        </div>
                    </div>}

            </Modal >
        </>
    );
};

export default CustomDetailModal