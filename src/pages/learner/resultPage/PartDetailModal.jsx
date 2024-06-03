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

const PartDetailModal = (props) => {
    console.log(props.questionNumber);
    const [state, setState] = useState([]);
    const [exelPara, setExelPara] = useState([]);
    const [part7Slice, setPart7Slice] = useState(0);
    const refAudio = useRef(null);
    const data = props.data;
    console.log(data);
    const handlePart = () => {
        console.log(data);
        if (data.length !== 0) {
            if (props.part === 'part6') {
                let paragraph = data.exel.map((item) => {
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
            if (props.part === 'part71' || props.part === 'part72' || props.part === 'part73') {
                let paragraph = data.exel.map((item) => {
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

    }

    const handlePart7 = () => {
        if (props.part === 'part71' || props.part === 'part72' || props.part === 'part73') {
            if (props.part === 'part71') {
                if (props.questionNumber >= 0 && props.questionNumber < 8) {
                    setPart7Slice(2)
                } else if (props.questionNumber >= 8 && props.questionNumber < 17) {
                    setPart7Slice(3)
                } else {
                    setPart7Slice(4)
                }
            } else {
                setPart7Slice(5)
            }
        }
    }

    const handleRender = () => {
        if (data.length !== 0) {
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
                    setState({
                        images: '',
                        exel: (data.exel[0][props.questionNumber - 1]),
                        audio: (data.audio[Math.floor((props.questionNumber) / 3)]),
                        correctAnswer: (data.answer[0][props.questionNumber - 1]),
                        userAnswer: (props.userAnswer[props.questionNumber - 1]),
                    })

                    break;
                case 'part4':
                    setState({
                        images: '',
                        exel: (data.exel[0][props.questionNumber - 1]),
                        audio: (data.audio[Math.floor((props.questionNumber) / 3)]),
                        correctAnswer: (data.answer[0][props.questionNumber - 1]),
                        userAnswer: (props.userAnswer[props.questionNumber - 1]),
                    })


                    break;
                case 'part5':
                    setState({
                        images: '',
                        exel: (data.exel[0][props.questionNumber - 1]),
                        audio: '',
                        correctAnswer: (data.answer[0][props.questionNumber - 1]),
                        userAnswer: (props.userAnswer[props.questionNumber - 1]),
                    })
                    break;
                case 'part6':
                    let temp = data.exel[0][props.questionNumber - 1];
                    if (temp && temp !== undefined && temp.length !== 0) {
                        temp.question = exelPara[Math.floor((props.questionNumber - 1) / 4)];
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

                    let part7 = data.exel[0][props.questionNumber - 1];
                    if (part7 && part7 !== undefined && part7.length !== 0 && part7Slice !== 0) {
                        part7.question = exelPara[Math.floor((props.questionNumber - 1) / part7Slice)];
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
                            {state?.exel && state?.exel.question !== undefined && <div style={{ marginTop: 30 }}>
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
                            {state?.exel && state?.exel.question === undefined && <div style={{ marginTop: 30 }}>
                                <div className="part3-question" key={`question${state?.exel?.number}`} style={{
                                    marginBottom: 20
                                }}>
                                    <div className="part3-title" style={{ fontWeight: 'bold', marginBottom: 10 }}>Question {state?.exel?.number}. <span dangerouslySetInnerHTML={{ __html: `${state?.exel?.para}` }}></span></div>
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

export default PartDetailModal