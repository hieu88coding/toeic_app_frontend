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



function WrittingsDetailAdmin(props) {
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
            editAudio: '',
        });
        props.handleOpenModalChange(false);
    }

    const createAnswer = async () => {
        try {
            let res = await userRequest.put(`/writtings/${data.id}`, {
                pdf: editorContents.editor1
            });
            if (res.status === 200) {
                useToastSuccess("Chỉnh sửa thành công")
            } else return useToastError("Cập nhật thất bại");
        } catch (error) {
            console.log(error);
        }
    }

    const saveContent = async () => {
        createAnswer();
        useToastSuccess("Cập nhật câu hỏi thành công !");
    };


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
                                <div className="part3-title" style={{ fontWeight: 'bold', marginBottom: 10 }}><Editor
                                    apiKey='gih8fhms5j8pyrjdkiizbeya8ckgjdhfj6fn335ajfk342kk'
                                    onInit={(_evt, editor) => editorRefs.current.editor1 = editor}
                                    initialValue={`${data.exel}`}
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
                            </div>
                        </div>}
                        <Button type="primary" style={{ marginTop: 20 }} size="large" onClick={saveContent}>Lưu</Button>
                    </div>
                </div>}

        </Modal >
    );
}

export default WrittingsDetailAdmin;