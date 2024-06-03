import { useState, useEffect } from "react";
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { storage } from '../../../firebase';
import { v4 } from "uuid";
import { Modal, Input, Select } from "antd";
import { useToastSuccess, useToastError } from "../../../utils/toastSettings";
import { publicRequest } from "../../../requestMethods";

function CreateReading({
    dataTest,
    testName,
    isOpenModal,
    handleOpenChange,
}) {
    const [exelFileUpload, setExelFileUpload] = useState({ file: null, fileType: 'exel' });
    const [jsonFileUpload, setJsonFileUpload] = useState({ file: null, fileType: 'json' });
    const data = [];
    const [testTilte, setTestTilte] = useState("");
    const [selectedLevel, setSelectedLevel] = useState(450);
    const [testCategory, setTestCategory] = useState("");
    const [selectedPart, setSelectedPart] = useState('Part 5 - Hoàn thành câu');
    const [isLoading, setIsLoading] = useState(false);

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

            const fileRef = ref(storage, `Readings/${fileData.fileType}/${selectedPart}/${testTilte}/${fileData.file.name}`);
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

            const fileRef = ref(storage, `Readings/json/${selectedPart}/${testTilte}/${fileData.file.name}`);
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
    const handleCreateReading = async () => {
        try {
            if (exelFileUpload.file !== null && jsonFileUpload.file !== null) {
                const pdfUploadPromise = await uploadFile(exelFileUpload);
                const jsonUploadPromise = await uploadAnswer(jsonFileUpload);

                useToastSuccess("Upload đề thành công !");
                useToastSuccess("Hệ thống đang xử lý file");
                console.log(data);
                try {
                    const res = await publicRequest.post(
                        `/readings`, {
                        level: selectedLevel,
                        testName: testTilte,
                        part: selectedPart,
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
    };

    return (
        <Modal
            title={`Thêm mới bài Reading`}
            open={isOpenModal}
            onCancel={closeModal}
            onOk={handleCreateReading}
            confirmLoading={isLoading}
            cancelText="Hủy"
            okText="Xác nhận"
            width={570}
        >
            <div className="App">
                <div style={{ marginBottom: 20 }}>
                    <div>Part</div>
                    <Select
                        defaultValue={'Part 5 - Hoàn thành câu'}
                        style={{
                            width: 200,
                        }}
                        onChange={handlePartChange}
                        options={[
                            {
                                value: 'Part 5 - Hoàn thành câu',
                                label: 'Part 5 - Hoàn thành câu',
                            },
                            {
                                value: 'Part 6 - Hoàn thành đoạn văn',
                                label: 'Part 6 - Hoàn thành đoạn văn',
                            },
                            {
                                value: 'Part 7 - Đoạn đơn',
                                label: 'Part 7 - Đooạn đơn',
                            },
                            {
                                value: 'Part 7 - Đoạn kép',
                                label: 'Part 7 - Đoạn kép',
                            },
                            {
                                value: 'Part 7 - Đoạn ba',
                                label: 'Part 7 - Đoạn ba',
                            },
                        ]}
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

export default CreateReading;