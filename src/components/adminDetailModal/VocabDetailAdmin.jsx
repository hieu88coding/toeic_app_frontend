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

function VocabDetailAdmin(props) {
    const data = props.data;
    console.log(data);
    const [imageFileUpload, setImageFileUpload] = useState({ url: data.images, file: '' });
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
    const getBase64 = (file) => {
        console.log(file);
        const reader = new FileReader();

        reader.onloadend = () => {
            setImageFileUpload({
                url: reader.result,
                file: file
            });
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

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
    const uploadImages = async () => {
        const fileName = data.images.substring(data.images.lastIndexOf("%2F") + 3, data.images.lastIndexOf("?"));
        let imageRefs = await listAll(ref(storage, `Vocabularys/jpg/Ảnh/${testCode}/extractedFile/${fileName}`));
        await Promise.all(imageRefs.items.map(async (exelRef) => {
            await deleteObject(exelRef);
            console.log('Đã xóa ảnh cũ cũ');
        }));
        await uploadBytes(ref(storage, `Vocabularys/jpg/Ảnh/${testCode}/extractedFile/${fileName}`), imageFileUpload.file, { contentType: 'image/jpeg' });
        console.log('Upload thành công');
    };
    const handleEditOldExel = () => {
        let updatedItems = [];
        updatedItems = [...props.oldExel[0]]
        updatedItems[data.exel.number] = {
            key: `${data.exel.number + 1}`,
            number: data.exel.number,
            word: editorContents.editAnswerA,
            transcribe: editorContents.editAnswerB,
            meaning: editorContents.editAnswerC,
        };
        return updatedItems;
    }

    const createExel = async (preExel, partName) => {
        console.log(preExel);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Data1');
        worksheet.columns = [
            { header: 'Số thứ tự', key: 'index', width: 10 },
            { header: 'Từ vựng', key: 'question', width: 70 },
            { header: 'Phiên âm', key: 'answerA', width: 30 },
            { header: 'Ý nghĩa', key: 'answerB', width: 30 },
        ];
        for (let i = 0; i < preExel.length; i++) {
            worksheet.addRow({
                index: preExel[i].key,
                word: preExel[i].word,
                transcribe: preExel[i].transcribe || '',
                meaning: preExel[i].meaning || '',
            });
        }
        const excelBuffer = await workbook.xlsx.writeBuffer();
        try {
            let exelRefs = await listAll(ref(storage, `Vocabularys/exel/${testName}/${testName}.xlsx`));
            await Promise.all(exelRefs.items.map(async (exelRef) => {
                await deleteObject(exelRef);
                console.log('Đã xóa file Excel cũ');
            }));
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            await uploadBytes(ref(storage, `Vocabularys/exel/${testName}/${testName}.xlsx`), blob);
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
            if (data.images !== imageFileUpload.url) {
                uploadImages();
            }
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
            title="Chi tiết từ vựng"
            open={props.isOpenModal}
            onCancel={closeModal}
            footer={null}
            width={900}
        >
            {data !== undefined && data.length !== 0 &&
                <div div className="part3-container" style={{ marginBottom: 50, fontSize: 16 }}>
                    <div className="part3-content">
                        {data?.images.length !== 0 &&
                            <div>
                                <div style={{ marginBottom: 20 }}><strong>Chọn hình ảnh</strong> </div>
                                <div className="part3-images" style={{ width: '40%', maxHeight: '321px', margin: '0 auto' }}>
                                    <input
                                        type="file"
                                        onChange={(event) => {
                                            getBase64(event.target.files[0]);
                                        }}
                                    />
                                    <Image style={{ width: '100%', height: 'auto', maxHeight: '100%', margin: '0 auto' }} src={imageFileUpload.url} />
                                </div>
                            </div>
                        }
                        {data?.exel && data?.exel !== undefined && <div style={{ marginTop: 30 }}>
                            <div className="part3-question" key={`question${data?.exel?.number}`} style={{
                                marginBottom: 20
                            }}>
                                <div className="part3-answer" style={{ marginBottom: 10 }}>
                                    <div style={{ marginBottom: 20 }}>Từ vựng: <Input onChange={(event) => handleEditorChange('editAnswerA', event.target.value)} placeholder="Từ vựng" defaultValue={data?.exel?.word}></Input></div>
                                    <div style={{ marginBottom: 20 }}>Phiên âm: <Input onChange={(event) => handleEditorChange('editAnswerB', event.target.value)} placeholder="Phiên âm" defaultValue={data?.exel?.transcribe}></Input></div>
                                    <div style={{ marginBottom: 20 }}>Ý nghĩa: <Input onChange={(event) => handleEditorChange('editAnswerC', event.target.value)} placeholder="Ý nghĩa" defaultValue={data?.exel?.meaning}></Input></div>
                                </div>
                            </div>
                            <Divider />
                        </div>}
                        <Button type="primary" style={{ marginTop: 20 }} size="large" onClick={saveContent}>Lưu</Button>
                    </div>
                </div>}

        </Modal >
    );
}

export default VocabDetailAdmin;