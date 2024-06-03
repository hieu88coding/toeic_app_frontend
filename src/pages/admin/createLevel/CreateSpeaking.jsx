import { useState, useEffect, useRef } from "react";
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { storage } from '../../../firebase';
import { v4 } from "uuid";
import { publicRequest } from "../../../requestMethods";
import { Modal, Input, Select } from "antd";
import { useToastSuccess, useToastError } from "../../../utils/toastSettings";
import { Editor } from '@tinymce/tinymce-react';

function CreateSpeaking({
    dataTest,
    testName,
    isOpenModal,
    handleOpenChange,
}) {
    const [imageFileUpload, setImageFileUpload] = useState({ file: null, fileType: 'jpg' });
    const [exelFileUpload, setExelFileUpload] = useState({ file: null, fileType: 'exel' });
    const [audioFileUpload, setAudioFileUpload] = useState({ file: null, fileType: 'audio' });
    const [jsonFileUpload, setJsonFileUpload] = useState({ file: null, fileType: 'json' });
    const data = [];
    const [testTilte, setTestTilte] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPart, setSelectedPart] = useState('Part 1 - Đọc đoạn văn');

    const [editorContents, setEditorContents] = useState({
        editor1: '',
    });


    const editorRefs = useRef({
        editor1: null,
    });

    const handleEditorChange = (editorName, content) => {
        console.log(content);
        setEditorContents((prevContents) => ({
            ...prevContents,
            [editorName]: content
        }));
    };

    const handlePartChange = (value) => {
        setSelectedPart(value);
    };
    const uploadFile = (fileData) => {
        return new Promise((resolve, reject) => {
            if (fileData.file == null) {
                resolve(null);
                return;
            }

            const fileRef = ref(storage, `Speakings/${fileData.fileType}/${selectedPart}/${testTilte}/${fileData.file.name}`);
            uploadBytes(fileRef, fileData.file)
                .then(async (snapshot) => {
                    const fileUrl = await getDownloadURL(snapshot.ref);
                    let fileDataWithUrl = {
                        dataType: fileData.fileType,
                        fileUrl: fileUrl,
                    };
                    data.push(fileDataWithUrl)
                    resolve(data);
                });


        });
    };
    function closeModal() {
        handleOpenChange(false);
    }

    const handleCreateSpeaking = async () => {
        //const foundTest = dataTest.find(dataTest => dataTest.testName === testTilte);
        if (testTilte !== '') {
            //console.log(foundTest);
            console.log(testTilte);
            useToastSuccess("Tên test không bị trùng")
            try {
                if (audioFileUpload.file !== null && jsonFileUpload !== null) {
                    const exelUploadPromise = await uploadFile(exelFileUpload);
                    const imageUploadPromise = await uploadFile(imageFileUpload);
                    const audioUploadPromise = await uploadFile(audioFileUpload);
                    useToastSuccess("Upload đề thành công !");
                    useToastSuccess("Hệ thống đang xử lý file");
                    console.log(data);
                    try {
                        const res = await publicRequest.post(
                            `/speakings`, {
                            part: selectedPart,
                            testName: testTilte,
                            pdf: editorContents.editor1,
                            data: data
                        });
                        if (res && res.status === 200) {
                            console.log("Gét gô");
                            useToastSuccess(res.message);
                        } else {
                            console.log("Not so good");
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    useToastError("Chưa upload đủ file");
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <Modal
            title={`Thêm mới bài Speaking `}
            open={isOpenModal}
            onCancel={closeModal}
            onOk={handleCreateSpeaking}
            confirmLoading={isLoading}
            cancelText="Hủy"
            okText="Xác nhận"
            width={570}
        >
            <div className="App">


                <div style={{ marginBottom: 20 }}>
                    <div>Part</div>
                    <Select
                        defaultValue={'Part 1 - Đọc đoạn văn'}
                        style={{
                            width: 200,
                        }}
                        onChange={handlePartChange}
                        options={[
                            {
                                value: 'Part 1 - Đọc đoạn văn',
                                label: 'Part 1 - Đọc đoạn văn',
                            },
                            {
                                value: 'Part 2 - Miêu tả tranh',
                                label: 'Part 2 - Miêu tả tranh',
                            },
                            {
                                value: 'Part 3 - Trả lời câu hỏi',
                                label: 'Part 3 - Trả lời câu hỏi',
                            },
                            {
                                value: 'Part 4 - Trình bày quan điểm',
                                label: 'Part 4 - Trình bày quan điểm',
                            },
                        ]}
                    />
                </div>

                <div style={{ marginBottom: 20 }}>
                    <span>Tên bài test </span>
                    <Input
                        placeholder=" Cú pháp: Test + number, ví dụ: Test1"
                        autoComplete="off"
                        type="text"
                        onInput={(event) => {
                            const inputValue = event.target.value;
                            const capitalizedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                            event.target.value = capitalizedValue;
                        }}
                        onChange={(event) => {
                            setTestTilte(event.target.value);
                        }}
                    />
                </div>
                <div className="input" style={{ marginBottom: 10 }}>
                    <div>Đề bài: </div>
                    <div style={{ marginTop: 30 }}>
                        <div className="part3-question" key={`question${data?.exel?.number}`} style={{
                            marginBottom: 20
                        }}>

                            <div className="part3-title" style={{ fontWeight: 'bold', marginBottom: 10 }}><Editor
                                apiKey='gih8fhms5j8pyrjdkiizbeya8ckgjdhfj6fn335ajfk342kk'
                                onInit={(_evt, editor) => editorRefs.current.editor1 = editor}
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
                    </div>

                </div>


                <div className="input" style={{ marginBottom: 10 }}>
                    <div>Chọn file âm thanh </div>
                    <input
                        type="file"
                        onChange={(event) => {
                            setAudioFileUpload({
                                file: event.target.files[0],
                                fileType: 'mp3',
                            });
                        }}
                    />
                </div>
                <div className="input" style={{ marginBottom: 10 }}>
                    <div>Chọn file hình ảnh </div>
                    <input
                        type="file"
                        onChange={(event) => {
                            setImageFileUpload({
                                file: event.target.files[0],
                                fileType: 'jpg',
                            });
                        }}
                    />
                </div>
            </div>
        </Modal>
    );
}

export default CreateSpeaking;