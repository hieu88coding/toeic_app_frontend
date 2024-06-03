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

function CreateVocab({
    dataTest,
    testName,
    isOpenModal,
    handleOpenChange,
}) {
    const [imageFileUpload, setImageFileUpload] = useState({ file: null, fileType: 'jpg' });
    const [exelFileUpload, setExelFileUpload] = useState({ file: null, fileType: 'exel' });
    const data = [];
    const [testTilte, setTestTilte] = useState("");

    const uploadFile = (fileData) => {
        return new Promise((resolve, reject) => {
            if (fileData.file == null) {
                resolve(null);
                return;
            }

            const fileRef = ref(storage, `Vocabularys/${fileData.fileType}/${testTilte}/${fileData.file.name}`);
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
            if (exelFileUpload.file !== null && imageFileUpload.file !== null) {
                const pdfUploadPromise = await uploadFile(exelFileUpload);
                await uploadFile(imageFileUpload);
                useToastSuccess("Upload đề thành công !");
                useToastSuccess("Hệ thống đang xử lý file");
                console.log(data);
                try {
                    const res = await publicRequest.post(
                        `/vocabularys`, {
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
    };

    return (
        <Modal
            title={`Thêm mới list từ vựng`}
            open={isOpenModal}
            onCancel={closeModal}
            onOk={handleCreateReading}
            cancelText="Hủy"
            okText="Xác nhận"
            width={570}
        >
            <div className="App">
                <div style={{ marginBottom: 20 }}>
                    <span>Tên list từ vựng </span>
                    <Input
                        placeholder=" ví dụ: Nature"
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
                    <div>Chọn file từ vựng </div>
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

export default CreateVocab;