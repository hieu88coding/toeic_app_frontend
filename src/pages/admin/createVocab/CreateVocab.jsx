import { useState, useEffect } from "react";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll
} from "firebase/storage";
import { storage } from '../../../firebase';
import { v4 } from "uuid";
import { Modal, Input, Select } from "antd";
import { useToastSuccess, useToastError } from "../../../utils/toastSettings";
import { publicRequest } from "../../../requestMethods";
import * as XLSX from 'xlsx/xlsx.mjs';

function CreateVocab({
    dataTest,
    testName,
    isOpenModal,
    handleOpenChange,
}) {
    const [dataArray, setDataArray] = useState([]);
    const [imageVocab, setImageVocab] = useState([]);
    const [testTilte, setTestTilte] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [finalData, setFinalData] = useState(null);

    const handleGetVocabImage = async () => {
        const imageRefs = await listAll(ref(storage, 'Vocab')); // Lấy danh sách các file trong thư mục
        console.log(imageRefs);
        const imageUrls = await Promise.all(
            imageRefs.items.map(async (imageRef) => {
                const url = await getDownloadURL(imageRef); // Tải xuống từng ảnh
                return {
                    image: url,
                };
            })
        );
        console.log("images url", imageUrls);
        setImageVocab(imageUrls)

    }

    useEffect(() => {
        handleGetVocabImage();
    }, []);


    function closeModal() {
        handleOpenChange(false);
    }
    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const worksheet = workbook.Sheets[workbook.SheetNames[0]];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });


            jsonData.forEach((row) => {
                const rowData = {
                    number: row[0],
                    word: row[1],
                    type: row[2],
                    transcribe: row[3],
                    meaning: row[4],
                };

                dataArray.push(rowData);
            });
            const mergedArray = dataArray.map((item, index) => {
                return {
                    ...item,
                    ...imageVocab[index],
                };
            });
            console.log(mergedArray);
            setFinalData(mergedArray);

        };

        reader.readAsArrayBuffer(file);
    };

    const handleCreateVocab = async () => {
        try {
            if (dataArray.length !== 0) {

                for (let i = 0; i < finalData.length; ++i) {
                    finalData[i].testName = testTilte;
                    try {
                        const res = await publicRequest.post(
                            `/vocabularys`, finalData[i]);
                        if (res && res.status === 200) {
                            console.log("Gét gô");
                            useToastSuccess(res.message);
                        } else {
                            console.log("Not so good");
                        }
                    } catch (error) {
                        console.log(error);
                    }
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
            title={`Thêm mới bài ${testName} `}
            open={isOpenModal}
            onCancel={closeModal}
            onOk={handleCreateVocab}
            confirmLoading={isLoading}
            cancelText="Hủy"
            okText="Xác nhận"
            width={570}
        >
            <div className="App">
                <div style={{ marginBottom: 20 }}>
                    <span>Tên chủ đề từ vựng </span>
                    <Input
                        placeholder="Ví dụ: Education, School,..."
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
                    <div>Chọn file list từ vựng </div>
                    <input
                        type="file"
                        onChange={handleFileUpload}
                    />
                </div>

            </div>
        </Modal>
    );
}

export default CreateVocab;