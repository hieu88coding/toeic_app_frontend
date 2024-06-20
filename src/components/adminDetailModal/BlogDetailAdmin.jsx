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

function BlogDetailAdmin(props) {
    const data = props.data;
    console.log(data);
    console.log(props.oldExel);
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
        let imageRefs = await listAll(ref(storage, `Blogs/jpg/${props.oldExel.contentMarkdown}/${props.oldExel.title}`));
        await Promise.all(imageRefs.items.map(async (exelRef) => {
            await deleteObject(exelRef);
            console.log('Đã xóa ảnh cũ cũ');
        }));
        await uploadBytes(ref(storage, `Blogs/jpg/${props.oldExel.contentMarkdown}/${props.oldExel.title}`), imageFileUpload.file, { contentType: 'image/jpeg' });
        console.log('Upload thành công');
    };
    const uploadHTMLString = (htmlString) => {
        return new Promise((resolve, reject) => {
            if (!htmlString) {
                resolve(null);
                return;
            }

            const fileRef = ref(
                storage,
                `Blogs/html/${props.oldExel.contentMarkdown}/${props.oldExel.title}/index.html`
            );

            const htmlBlob = new Blob([htmlString], { type: 'text/html' });

            uploadBytes(fileRef, htmlBlob);
        });
    };
    const uploadHtml = async () => {
        const fileName = data.images.substring(data.images.lastIndexOf("%2F") + 3, data.images.lastIndexOf("?"));
        let imageRefs = await listAll(ref(storage, `Blogs/html/${props.oldExel.contentMarkdown}/${props.oldExel.title}`));
        await Promise.all(imageRefs.items.map(async (exelRef) => {
            await deleteObject(exelRef);
            console.log('Đã xóa html cũ cũ');
        }));
        uploadHTMLString(editorContents.editor1);
        console.log('Upload thành công');
    };

    const saveContent = async () => {
        console.log('Nội dung all:', editorContents);
        if (data !== undefined && data.length !== 0) {
            uploadHtml();
            if (data.images !== imageFileUpload.url) {
                uploadImages();
            }
            useToastSuccess("Cập nhật bài viết thành công !");
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
            title="Chi tiết bài viết"
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
                                <div className="part3-title" style={{ fontWeight: 'bold', marginBottom: 10 }}>
                                    Nội dung <Editor
                                        apiKey='gih8fhms5j8pyrjdkiizbeya8ckgjdhfj6fn335ajfk342kk'
                                        onInit={(_evt, editor) => editorRefs.current.editor2 = editor}
                                        initialValue={`${data.exel}`}
                                        onEditorChange={(content) => handleEditorChange('editor2', content)}
                                        init={{
                                            height: 600,
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
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                                            language: 'vi'
                                        }}
                                    />
                                </div>
                                <div className="part3-answer" style={{ marginBottom: 10 }}>
                                    <div style={{ marginBottom: 20 }}>Chuyên mục: <Input onChange={(event) => handleEditorChange('editAnswerA', event.target.value)} placeholder="Chuyên mục" defaultValue={props.oldExel.contentMarkdown}></Input></div>
                                    <div style={{ marginBottom: 20 }}>Tiêu đề: <Input onChange={(event) => handleEditorChange('editAnswerB', event.target.value)} placeholder="Tiêu đề" defaultValue={props.oldExel.title}></Input></div>
                                    <div style={{ marginBottom: 20 }}>Mô tả: <Input onChange={(event) => handleEditorChange('editAnswerC', event.target.value)} placeholder="Mô tả" defaultValue={props.oldExel.description}></Input></div>
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

export default BlogDetailAdmin;