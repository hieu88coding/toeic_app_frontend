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

function SpeakingsDetailAdmin(props) {
    const data = props.data;
    console.log(data);
    const [audioFileUpload, setAudioFileUpload] = useState({ url: data.audio, file: '' });
    const testCode = useLocation().pathname.split("/")[3];
    const testName = useLocation().pathname.split("/")[4];
    const [editorContents, setEditorContents] = useState({
        editor1: '',
        editor2: '',
        editor3: '',
        editor4: '',
        editCorrectAnswer: '',
        editAudio: '',
    });

    const getAudioMp3 = (file) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            setAudioFileUpload({
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

    const refAudio = useRef(null);

    const uploadAudio = async () => {
        const fileName = data.audio.substring(data.audio.lastIndexOf("%2F") + 3, data.audio.lastIndexOf("?"));
        let audioRefs = await listAll(ref(storage, `Speakings/mp3/${props.partEnglishName}/${testName}/${fileName}`));
        await Promise.all(audioRefs.items.map(async (exelRef) => {
            await deleteObject(exelRef);
            console.log('Đã xóa ảnh cũ cũ');
        }));
        await uploadBytes(ref(storage, `Speakings/mp3/${props.partEnglishName}/${testName}/${fileName}`), audioFileUpload.file, { contentType: 'audio/mpeg' });
        console.log('Upload thành công');
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
            let res = await userRequest.put(`/speakings/${data.id}`, {
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
        uploadAudio();
        createAnswer();
        useToastSuccess("Cập nhật câu hỏi thành công !");
    };

    useEffect(() => {
        setEditorContents({
            editAudio: data.audio,
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
                        {data?.audio.length !== 0 && <div className="part3-audio" style={{ width: '100%', display: 'flex', flexDirection: `column` }}>
                            <div style={{ marginBottom: 20 }}><strong>Chọn audio</strong> </div>
                            <input
                                type="file"
                                onChange={(event) => {
                                    getAudioMp3(event.target.files[0]);
                                }}
                            />
                            <CustomPlyrInstance ref={refAudio} type="audio" source={{
                                type: "audio",
                                sources: [
                                    {
                                        type: "audio/mp3",
                                        src: audioFileUpload.url,
                                    },
                                ],
                            }} options={audioOptions} />
                        </div>}
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

export default SpeakingsDetailAdmin;