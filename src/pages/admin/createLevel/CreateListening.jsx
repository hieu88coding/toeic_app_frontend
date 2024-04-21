import { useState, useEffect } from "react";
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
function CreateListening({
    dataTest,
    testName,
    isOpenModal,
    handleOpenChange,
}) {
    const [pdfFileUpload, setPdfFileUpload] = useState({ file: null, fileType: 'pdf' });
    const [audioFileUpload, setAudioFileUpload] = useState({ file: null, fileType: 'audio' });
    const [jsonFileUpload, setJsonFileUpload] = useState({ file: null, fileType: 'json' });
    const data = [];
    const [testTilte, setTestTilte] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(450);

    const handleLevelChange = (value) => {
        setSelectedLevel(value);
    };
    const uploadFile = (fileData) => {
        return new Promise((resolve, reject) => {
            if (fileData.file == null) {
                resolve(null);
                return;
            }

            const fileRef = ref(storage, `${fileData.fileType}/${fileData.file.name + v4()}`);
            uploadBytes(fileRef, fileData.file)
                .then((snapshot) => {
                    getDownloadURL(snapshot.ref)
                        .then((url) => {
                            const fileDataWithUrl = {
                                dataType: fileData.fileType,
                                fileUrl: url,
                            };

                            data.push(fileDataWithUrl);
                            resolve(fileDataWithUrl);
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };
    function closeModal() {
        handleOpenChange(false);
    }

    const handleCreateListening = async () => {
        const foundTest = dataTest.find(dataTest => dataTest.testName === testTilte);
        if (foundTest === undefined && testTilte !== '') {
            console.log(foundTest);
            console.log(testTilte);
            useToastSuccess("Tên test không bị trùng")
            try {
                if (pdfFileUpload.file !== null && audioFileUpload.file !== null && jsonFileUpload !== null) {
                    const pdfUploadPromise = uploadFile(pdfFileUpload);
                    const audioUploadPromise = uploadFile(audioFileUpload);
                    const jsonUploadPromise = uploadFile(jsonFileUpload);

                    await Promise.all([pdfUploadPromise, audioUploadPromise, jsonUploadPromise]);
                    message.success("Upload đề thành công !");
                    console.log(data);
                    try {
                        const res = await publicRequest.post(
                            `/listenings`, {
                            level: selectedLevel,
                            testName: testTilte,
                            data: data
                        });
                        if (res && res.status === 200) {
                            console.log("Gét gô");
                            message.success(res.message);
                        } else {
                            console.log("Not so good");
                        }
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    message.error("Chưa upload đủ file");
                    return;
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <Modal
            title={`Thêm mới bài ${testName} `}
            open={isOpenModal}
            onCancel={closeModal}
            onOk={handleCreateListening}
            confirmLoading={isLoading}
            cancelText="Hủy"
            okText="Xác nhận"
            width={570}
        >
            <div className="App">
                <div style={{ marginBottom: 20 }}>
                    <span>Tên bài test </span>
                    <Input
                        placeholder=" Cú pháp: Listening + number, ví dụ: Listening1"
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

                <div style={{ marginBottom: 20 }}>
                    <div>Level của bài test</div>
                    <Select
                        defaultValue={450}
                        style={{
                            width: 120,
                        }}
                        onChange={handleLevelChange}
                        options={[
                            {
                                value: 450,
                                label: 'Level 450',
                            },
                            {
                                value: 500,
                                label: 'Level 500',
                            },
                            {
                                value: 550,
                                label: 'Level 550',
                            },
                            {
                                value: 600,
                                label: 'Level 600',
                            },
                            {
                                value: 650,
                                label: 'Level 650',
                            },
                            {
                                value: 700,
                                label: 'Level 700',
                            },
                            {
                                value: 750,
                                label: 'Level 750',
                            },
                            {
                                value: 800,
                                label: 'Level 800',
                            },
                            {
                                value: 850,
                                label: 'Level 850',
                            },
                            {
                                value: 900,
                                label: 'Level 900',
                            },
                            {
                                value: 950,
                                label: 'Level 950',
                            },
                            {
                                value: 990,
                                label: 'Level 990',
                            },
                        ]}
                    />
                </div>

                <div className="input" style={{ marginBottom: 10 }}>
                    <div>Chọn file pdf </div>
                    <input
                        type="file"
                        onChange={(event) => {
                            setPdfFileUpload({
                                file: event.target.files[0],
                                fileType: 'pdf',
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

export default CreateListening;