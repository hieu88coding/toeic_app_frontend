import { useState, useEffect } from "react";
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { storage } from '../../../firebase';
import { v4 } from "uuid";
import { message } from "antd";
import { publicRequest } from "../../../requestMethods";

function CreateListening() {
    const [pdfFileUpload, setPdfFileUpload] = useState({ file: null, fileType: 'pdf' });
    const [audioFileUpload, setAudioFileUpload] = useState({ file: null, fileType: 'audio' });
    const [jsonFileUpload, setJsonFileUpload] = useState({ file: null, fileType: 'json' });
    const data = [];
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

    const handleCreateListening = async () => {
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
                        level: 500,
                        testName: 'Listening2',
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
    };

    return (
        <div className="App">
            <input
                type="file"
                onChange={(event) => {
                    setPdfFileUpload({
                        file: event.target.files[0],
                        fileType: 'pdf',
                    });
                }}
            />

            <div>
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
            <div>
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
            <button onClick={handleCreateListening}>Submit</button>
        </div>
    );
}

export default CreateListening;