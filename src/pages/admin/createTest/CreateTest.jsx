import { useState, useEffect } from "react";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";
import { storage } from '../../../firebase';
import { v4 } from "uuid";
import { message, Modal, Input, Upload, Button } from "antd";
import { UploadFileOutlined } from "@mui/icons-material";
import { publicRequest } from "../../../requestMethods";
import { toast } from "react-toastify";
import { useToastSuccess, useToastError } from "../../../utils/toastSettings";
import JSZip, { file } from "jszip";
import axios from "axios";
import mime from 'mime';

function CreateTest({
    dataTest,
    testName,
    isOpenModal,
    handleOpenChange,
}) {
    const [imageFileUpload, setImageFileUpload] = useState({ file: null, fileType: 'jpg' });
    const [exelFileUpload, setExelFileUpload] = useState({ file: null, fileType: 'exel' });
    const [audioFileUpload, setAudioFileUpload] = useState({ file: null, fileType: 'audio' });
    const [jsonFileUpload, setJsonFileUpload] = useState({ file: null, fileType: 'json' });
    const [testTilte, setTestTilte] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const data = [];
    const uploadFile = (fileData) => {
        return new Promise((resolve, reject) => {
            if (fileData.file == null) {
                resolve(null);
                return;
            }

            const fileRef = ref(storage, `${fileData.fileType}/${fileData.file.name + v4()}`);
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
    const uploadAnswer = (fileData) => {
        return new Promise((resolve, reject) => {
            if (fileData.file == null) {
                resolve(null);
                return;
            }

            const fileRef = ref(storage, `json/${testTilte}/${fileData.file.name}`);
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

    const handleCreateTest = async () => {
        const foundTest = dataTest.find(dataTest => dataTest.testName === testTilte);
        if (foundTest === undefined && testTilte !== '') {
            console.log(foundTest);
            console.log(testTilte);
            useToastSuccess("Tên test không bị trùng")
            try {
                if (exelFileUpload.file !== null && audioFileUpload.file !== null && jsonFileUpload !== null && imageFileUpload !== null) {
                    const exelUploadPromise = await uploadFile(exelFileUpload);
                    const imageUploadPromise = await uploadFile(imageFileUpload);
                    const audioUploadPromise = await uploadFile(audioFileUpload);
                    const jsonUploadPromise = await uploadAnswer(jsonFileUpload);
                    useToastSuccess("Upload đề thành công !");
                    useToastSuccess("Hệ thống đang xử lý file");
                    console.log(data);
                    try {
                        const res = await publicRequest.post(
                            `/mockTests`, {
                            testName: testTilte,
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
        } else {
            if (testTilte === '') {
                useToastError("Chưa điền tên !")
            } else {
                useToastError("Tên đã bị trùng")

            }
        }

    };

    return (
        <Modal
            title={`Thêm mới bài ${testName} `}
            open={isOpenModal}
            onCancel={closeModal}
            onOk={handleCreateTest}
            confirmLoading={isLoading}
            cancelText="Hủy"
            okText="Xác nhận"
            width={570}
        >
            <div className="App">
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
                    <div>Chọn file đề bài </div>
                    <input
                        type="file"
                        onChange={(event) => {
                            setExelFileUpload({
                                file: event.target.files[0],
                                fileType: 'exel',
                            });
                        }}
                    />

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
                <div className="input" style={{ marginBottom: 10 }}>
                    <div>Chọn file đáp án </div>
                    <input
                        type="file"
                        onChange={(event) => {
                            setJsonFileUpload({
                                file: event.target.files[0],
                                fileType: 'json',
                            });
                        }}
                    />
                </div>

            </div>
        </Modal>
    );
}

export default CreateTest;