import { useState, useEffect, useRef, forwardRef } from "react";
import { v4 } from "uuid";
import { message, Modal, Input, Upload, Button, Divider, Image } from "antd";
import { SearchOutlined, LoadingOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { publicRequest } from "../../requestMethods";
import { toast } from "react-toastify";
import { useToastSuccess, useToastError } from "../../utils/toastSettings";
import "plyr-react/plyr.css";
import { usePlyr } from "plyr-react";
import { Editor } from '@tinymce/tinymce-react';
import {
    ref,
    getDownloadURL,
    listAll,
    uploadBytes,
} from "firebase/storage";
import { storage } from '../../firebase';
import axios from "axios";
import * as XLSX from "xlsx";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ExcelJS from 'exceljs'

function ReadingsDetailAdmin(props) {
    const data = props.data;
    console.log(data);
    const testCode = useLocation().pathname.split("/")[3];
    const testName = useLocation().pathname.split("/")[4];
    const [editorContents, setEditorContents] = useState({
        editor1: '',
        editor2: '',
        editor3: '',
        editor4: '',
        editCorrectAnswer: '',
        editAnswerA: '',
        editAnswerB: '',
        editAnswerC: '',
        editAnswerD: '',
    });



    const editorRefs = useRef({
        editor1: null,
        editor2: null,
        editor3: null,
        editor4: null,
    });

    const handleEditorChange = (editorName, content) => {
        console.log(content);
        setEditorContents((prevContents) => ({
            ...prevContents,
            [editorName]: content
        }));
    };

    function closeModal() {
        setEditorContents({
            editor1: '',
            editor2: '',
            editor3: '',
            editor4: '',
            editCorrectAnswer: '',
            editAnswerA: '',
            editAnswerB: '',
            editAnswerC: '',
            editAnswerD: '',
        });
        props.handleOpenModalChange(false);
    }

    const handleEditOldExel = () => {
        let updatedItems = [];
        switch (testCode) {
            case 'part5':
                updatedItems = [...props.oldExel[0]]
                updatedItems[data.exel.number] = {
                    key: `${data.exel.number + 1}`,
                    number: data.exel.number,
                    question: editorContents.editor2 === undefined ? props.oldExel[0][data.exel.number].question : editorContents.editor2,
                    answerA: editorContents.editAnswerA,
                    answerB: editorContents.editAnswerB,
                    answerC: editorContents.editAnswerC,
                    answerD: editorContents.editAnswerD
                };
                return updatedItems;
            case 'part6':
                updatedItems = [...props.oldExel[0]]
                updatedItems[data.exel.number] = {
                    key: `${data.exel.number + 1}`,
                    number: data.exel.number,
                    question: editorContents.editor2 === undefined ? props.oldExel[0][data.exel.number].question : editorContents.editor2,
                    answerA: editorContents.editAnswerA,
                    answerB: editorContents.editAnswerB,
                    answerC: editorContents.editAnswerC,
                    answerD: editorContents.editAnswerD
                };
                return updatedItems;

            default:
                updatedItems = [...props.oldExel[0]]
                updatedItems[data.exel.number] = {
                    key: `${data.exel.number + 1}`,
                    para: editorContents.editor1 === '' ? props.oldExel[data.exel.number].para : editorContents.editor1,
                    number: data.exel.number,
                    question: editorContents.editor2 === '' ? props.oldExel[data.exel.number].question : editorContents.editor2,
                    answerA: editorContents.editAnswerA,
                    answerB: editorContents.editAnswerB,
                    answerC: editorContents.editAnswerC,
                    answerD: editorContents.editAnswerD
                };
                return updatedItems;
        }
    }

    const createExel = async (preExel, partName) => {
        console.log(preExel);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data1');
        if (partName.charAt(4) === '7') {
            worksheet.columns = [
                { header: 'Số thứ tự', key: 'index', width: 10 },
                { header: 'Đề bài', key: 'para', width: 70 },
                { header: 'Câu hỏi', key: 'question', width: 70 },
                { header: 'Đáp án A', key: 'answerA', width: 30 },
                { header: 'Đáp án B', key: 'answerB', width: 30 },
                { header: 'Đáp án C', key: 'answerC', width: 30 },
                { header: 'Đáp án D', key: 'answerD', width: 30 },
            ];
            for (let i = 0; i < preExel.length; i++) {
                worksheet.addRow({
                    index: preExel[i].key,
                    question: preExel[i].question,
                    para: preExel[i].para || '',
                    answerA: preExel[i].answerA || '',
                    answerB: preExel[i].answerB || '',
                    answerC: preExel[i].answerC || '',
                    answerD: preExel[i].answerD || '',
                });
            }
        } else if (partName === 'part6') {
            worksheet.columns = [
                { header: 'Số thứ tự', key: 'index', width: 10 },
                { header: 'Đề bài', key: 'para', width: 70 },
                { header: 'Đáp án A', key: 'answerA', width: 30 },
                { header: 'Đáp án B', key: 'answerB', width: 30 },
                { header: 'Đáp án C', key: 'answerC', width: 30 },
                { header: 'Đáp án D', key: 'answerD', width: 30 },

            ];
            for (let i = 0; i < preExel.length; i++) {
                worksheet.addRow({
                    index: preExel[i].key,
                    para: preExel[i].question || '',
                    answerA: preExel[i].answerA || '',
                    answerB: preExel[i].answerB || '',
                    answerC: preExel[i].answerC || '',
                    answerD: preExel[i].answerD || '',
                });
            }
        } else {
            worksheet.columns = [
                { header: 'Số thứ tự', key: 'index', width: 10 },
                { header: 'Câu hỏi', key: 'question', width: 70 },
                { header: 'Đáp án A', key: 'answerA', width: 30 },
                { header: 'Đáp án B', key: 'answerB', width: 30 },
                { header: 'Đáp án C', key: 'answerC', width: 30 },
                { header: 'Đáp án D', key: 'answerD', width: 30 },
            ];
            for (let i = 0; i < preExel.length; i++) {
                worksheet.addRow({
                    index: preExel[i].key,
                    question: preExel[i].question,
                    answerA: preExel[i].answerA || '',
                    answerB: preExel[i].answerB || '',
                    answerC: preExel[i].answerC || '',
                    answerD: preExel[i].answerD || '',
                });
            }
        }
        const excelBuffer = await workbook.xlsx.writeBuffer();
        try {
            let exelRefs = await listAll(ref(storage, `Readings/exel/${props.partEnglishName}/${testName}/${testCode.charAt(0).toUpperCase()}${testCode.slice(1)}_${testName}.xlsx`));
            await Promise.all(exelRefs.items.map(async (exelRef) => {
                await deleteObject(exelRef);
                console.log('Đã xóa file Excel cũ');
            }));
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            await uploadBytes(ref(storage, `Readings/exel/${props.partEnglishName}/${testName}/${testCode.charAt(0).toUpperCase()}${testCode.slice(1)}_${testName}.xlsx`), blob);
            console.log('Upload thành công');
        } catch (error) {
            console.log(error);
        }

    }

    const createAnswer = async () => {
        console.log(props.oldAnswer);
        console.log(data);
        let updatedItems = [];
        updatedItems = [...props.oldAnswer]
        updatedItems[data.correctAnswer.number - 1] = {
            key: `${data.correctAnswer.number}`,
            number: data.correctAnswer.number,
            correctAnswer: editorContents.editCorrectAnswer === undefined ? props.oldAnswer[data.correctAnswer.number - 1].correctAnswer : editorContents.editCorrectAnswer,
            explanation: editorContents.editor3 === undefined ? props.oldAnswer[data.correctAnswer.number - 1].explanation : editorContents.editor3,
            transcript: editorContents.editor4 === undefined ? props.oldAnswer[data.correctAnswer.number - 1].transcript : editorContents.editor4,
        };
        console.log(updatedItems);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data2');

        worksheet.columns = [
            { header: 'Số thứ tự', key: 'index', width: 10 },
            { header: 'Đáp án đúng', key: 'rightAnswer', width: 70 },
            { header: 'Giải thích', key: 'explanation', width: 70 },
            { header: 'Transcript', key: 'transcript', width: 70 },
        ];

        for (let i = 0; i < props.oldAnswer.length; i++) {
            worksheet.addRow({
                index: i,
                rightAnswer: updatedItems[i - 1].correctAnswer || '',
                explanation: updatedItems[i - 1].explanation || '',
                transcript: ''
            });
        }

        const excelBuffer = await workbook.xlsx.writeBuffer();
        try {
            let exelRefs = await listAll(ref(storage, `Readings/json/${props.partEnglishName}/${testName}/${testCode.charAt(0).toUpperCase()}${testCode.slice(1)}_${testName}_answer.xlsx`));
            await Promise.all(exelRefs.items.map(async (exelRef) => {
                await deleteObject(exelRef);
                console.log('Đã xóa file Excel cũ');
            }));
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            await uploadBytes(ref(storage, `Readings/json/${props.partEnglishName}/${testName}/${testCode.charAt(0).toUpperCase()}${testCode.slice(1)}_${testName}_answer.xlsx`), blob);
            console.log('Upload thành công');
        } catch (error) {
            console.log(error);
        }
    }

    const saveContent = async () => {
        console.log('Nội dung all:', editorContents);
        if (data !== undefined && data.length !== 0) {
            let newExel = handleEditOldExel(data.partName);
            createExel(newExel, data.partName);
            createAnswer();
            useToastSuccess("Cập nhật câu hỏi thành công !");
        }
    };

    useEffect(() => {
        setEditorContents({
            editCorrectAnswer: data.correctAnswer.correctAnswer,
            editAnswerA: data.exel.answerA,
            editAnswerB: data.exel.answerB,
            editAnswerC: data.exel.answerC,
            editAnswerD: data.exel.answerD,
            editAudio: data.images,
            editImage: data.audio
        })
    }, [data]);

    return (
        <Modal
            title="Chi tiết câu hỏi"
            open={props.isOpenModal}
            onCancel={closeModal}
            footer={null}
            width={900}
        >
            {data !== undefined && data.length !== 0 &&
                <div div className="part3-container" style={{ marginBottom: 50, fontSize: 16 }}>
                    <div className="part3-content">
                        {data?.exel && data?.exel !== undefined && <div style={{ marginTop: 30 }}>
                            <div className="part3-question" key={`question${data?.exel?.number}`} style={{
                                marginBottom: 20
                            }}>
                                {data?.exel.para !== undefined && data?.exel.para !== '' &&
                                    <div className="part3-title" style={{ fontWeight: 'bold', marginBottom: 10 }}><Editor
                                        apiKey='gih8fhms5j8pyrjdkiizbeya8ckgjdhfj6fn335ajfk342kk'
                                        onInit={(_evt, editor) => editorRefs.current.editor1 = editor}
                                        initialValue={`${data.exel.para}`}
                                        onEditorChange={(content) => handleEditorChange('editor1', content)}
                                        init={{
                                            height: 300,
                                            menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                                'bold italic forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
                                        }}
                                    /></div>

                                }
                                <div className="part3-title" style={{ fontWeight: 'bold', marginBottom: 10 }}>
                                    Question {data?.exel?.number}. <Editor
                                        apiKey='gih8fhms5j8pyrjdkiizbeya8ckgjdhfj6fn335ajfk342kk'
                                        onInit={(_evt, editor) => editorRefs.current.editor2 = editor}
                                        initialValue={`${data.exel.question}`}
                                        onEditorChange={(content) => handleEditorChange('editor2', content)}
                                        init={{
                                            height: 300,
                                            menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                                'bold italic forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
                                        }}
                                    />
                                </div>
                                <div className="part3-answer" style={{ marginBottom: 10 }}>
                                    <div>Đáp án A: <Input onChange={(event) => handleEditorChange('editAnswerA', event.target.value)} placeholder="Đáp án A" defaultValue={data?.exel?.answerA}></Input></div>
                                    <div>Đáp án B: <Input onChange={(event) => handleEditorChange('editAnswerB', event.target.value)} placeholder="Đáp án B" defaultValue={data?.exel?.answerB}></Input></div>
                                    <div>Đáp án C: <Input onChange={(event) => handleEditorChange('editAnswerC', event.target.value)} placeholder="Đáp án C" defaultValue={data?.exel?.answerC}></Input></div>
                                    <div>Đáp án D: <Input onChange={(event) => handleEditorChange('editAnswerD', event.target.value)} placeholder="Đáp án D" defaultValue={data?.exel?.answerD}></Input></div>
                                </div>
                            </div>
                            <Divider />
                        </div>}
                        {data?.correctAnswer.length !== 0 &&
                            <div style={{ marginTop: 20 }}>
                                <div style={{ marginBottom: 20 }}>Đáp án đúng: <Input placeholder="Đáp án đúng" onChange={(event) => handleEditorChange('editCorrectAnswer', event.target.value)} defaultValue={data.correctAnswer.correctAnswer}></Input></div>
                                {data.correctAnswer.explanation.length !== 0 &&
                                    <strong>Giải thích:  <Editor
                                        apiKey='gih8fhms5j8pyrjdkiizbeya8ckgjdhfj6fn335ajfk342kk'
                                        onInit={(_evt, editor) => editorRefs.current.editor3 = editor}
                                        initialValue={`${data.correctAnswer.explanation}`}
                                        onEditorChange={(content) => handleEditorChange('editor3', content)}
                                        init={{
                                            height: 300,
                                            menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                                'bold italic forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
                                        }}
                                    />
                                    </strong>
                                }
                                {data.correctAnswer.transcript.length !== 0 &&
                                    <strong>Giải thích:  <Editor
                                        apiKey='gih8fhms5j8pyrjdkiizbeya8ckgjdhfj6fn335ajfk342kk'
                                        onInit={(_evt, editor) => editorRefs.current.editor4 = editor}
                                        initialValue={`${data.correctAnswer.transcript}`}
                                        onEditorChange={(content) => handleEditorChange('editor4', content)}
                                        init={{
                                            height: 300,
                                            menubar: false,
                                            plugins: [
                                                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                                'bold italic forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'removeformat | help',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
                                        }}
                                    />
                                    </strong>
                                }
                                <Button type="primary" style={{ marginTop: 20 }} size="large" onClick={saveContent}>Lưu</Button>
                            </div>

                        }
                    </div>
                </div>}

        </Modal >
    );
}

export default ReadingsDetailAdmin;