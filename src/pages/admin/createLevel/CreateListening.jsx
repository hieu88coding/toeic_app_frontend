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
    const [imageFileUpload, setImageFileUpload] = useState({ file: null, fileType: 'jpg' });
    const [exelFileUpload, setExelFileUpload] = useState({ file: null, fileType: 'exel' });
    const [audioFileUpload, setAudioFileUpload] = useState({ file: null, fileType: 'audio' });
    const [jsonFileUpload, setJsonFileUpload] = useState({ file: null, fileType: 'json' });
    const data = [];
    const [testTilte, setTestTilte] = useState("");
    const [testCategory, setTestCategory] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState(450);
    const [selectedPart, setSelectedPart] = useState('Part 1 - Mô tả tranh');

    const handleLevelChange = (value) => {
        setSelectedLevel(value);
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

            const fileRef = ref(storage, `Listenings/${fileData.fileType}/${selectedPart}/${testTilte}/${fileData.file.name}`);
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

            const fileRef = ref(storage, `Listenings/json/${selectedPart}/${testTilte}/${fileData.file.name}`);
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

    const handleCreateListening = async () => {
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
                    const jsonUploadPromise = await uploadAnswer(jsonFileUpload);
                    useToastSuccess("Upload đề thành công !");
                    useToastSuccess("Hệ thống đang xử lý file");
                    console.log(data);
                    try {
                        const res = await publicRequest.post(
                            `/listenings`, {
                            level: selectedLevel,
                            part: selectedPart,
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
                    <div>Part</div>
                    <Select
                        defaultValue={'Part 1 - Mô tả tranh'}
                        style={{
                            width: 200,
                        }}
                        onChange={handlePartChange}
                        options={[
                            {
                                value: 'Part 1 - Mô tả tranh',
                                label: 'Part 1 - Mô tả tranh',
                            },
                            {
                                value: 'Part 2 - Hỏi & Đáp',
                                label: 'Part 2 - Hỏi & Đáp',
                            },
                            {
                                value: 'Part 3 - Đoạn hội thoại',
                                label: 'Part 3 - Đoạn hội thoại',
                            },
                            {
                                value: 'Part 4 - Bài nói ngắn',
                                label: 'Part 4 - Bài nói ngắn',
                            },
                        ]}
                    />
                </div>

                <div style={{ marginBottom: 20 }}>
                    <div>Level của bài test</div>
                    <Select
                        defaultValue={450}
                        style={{
                            width: 200,
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

export default CreateListening;