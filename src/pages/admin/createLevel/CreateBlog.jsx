import { useState, useEffect, useRef } from "react";
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
import { Editor } from '@tinymce/tinymce-react';
function CreateBlog({
    dataTest,
    testName,
    isOpenModal,
    handleOpenChange,
}) {
    const [exelFileUpload, setExelFileUpload] = useState({ file: null, fileType: 'exel' });
    const [imageFileUpload, setImageFileUpload] = useState({ file: null, fileType: 'json' });
    const data = [];
    const [testTilte, setTestTilte] = useState("");
    const [selectedLevel, setSelectedLevel] = useState(450);
    const [testCategory, setTestCategory] = useState("");
    const [selectedPart, setSelectedPart] = useState('TOEIC Listening');
    const [isLoading, setIsLoading] = useState(false);
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
    function closeModal() {
        setEditorContents({
            editor1: '',
        });
        props.handleOpenModalChange(false);
    }
    const handlePartChange = (value) => {
        setSelectedPart(value);
    };
    const uploadFile = (fileData) => {
        return new Promise((resolve, reject) => {
            if (fileData.file == null) {
                resolve(null);
                return;
            }

            const fileRef = ref(storage, `Blogs/${fileData.fileType}/${selectedPart}/${testTilte}/${fileData.file.name}`);
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
    const uploadHTMLString = (htmlString) => {
        return new Promise((resolve, reject) => {
            if (!htmlString) {
                resolve(null);
                return;
            }

            const fileRef = ref(
                storage,
                `Blogs/html/${selectedPart}/${testTilte}/index.html`
            );

            const htmlBlob = new Blob([htmlString], { type: 'text/html' });

            uploadBytes(fileRef, htmlBlob)
                .then(async (snapshot) => {
                    const fileUrl = await getDownloadURL(snapshot.ref);
                    const fileDataWithUrl = {
                        dataType: 'html',
                        fileUrl: fileUrl,
                    };
                    data.push(fileDataWithUrl);
                    resolve(data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };
    function closeModal() {
        handleOpenChange(false);
    }
    const handleCreateBlog = async () => {
        try {
            if (imageFileUpload.file !== null) {
                const pdfUploadPromise = await uploadHTMLString(editorContents.editor1);
                const jsonUploadPromise = await uploadFile(imageFileUpload);

                useToastSuccess("Upload đề thành công !");
                useToastSuccess("Hệ thống đang xử lý file");
                console.log(data);
                try {
                    const res = await publicRequest.post(
                        `/blogs`, {
                        blogName: testTilte,
                        category: selectedPart,
                        data: data,
                        description: testCategory
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
            title={`Thêm mới bài viết`}
            open={isOpenModal}
            onCancel={closeModal}
            onOk={handleCreateBlog}
            confirmLoading={isLoading}
            cancelText="Hủy"
            okText="Xác nhận"
            width={1200}
        >
            <div className="App">
                <div style={{ marginBottom: 20 }}>
                    <div>Chủ đề bài viết</div>
                    <Select
                        defaultValue={'TOEIC Listening'}
                        style={{
                            width: 200,
                        }}
                        onChange={handlePartChange}
                        options={[
                            {
                                value: 'TOEIC Listening',
                                label: 'TOEIC Listening',
                            },
                            {
                                value: 'TOEIC Reading',
                                label: 'TOEIC Reading',
                            },
                            {
                                value: 'TOEIC Speaking',
                                label: 'TOEIC Speaking',
                            },
                            {
                                value: 'TOEIC Writting',
                                label: 'TOEIC Writting',
                            },
                            {
                                value: 'Thông tin kỳ thi TOEIC',
                                label: 'Thông tin kỳ thi TOEIC',
                            },
                            {
                                value: 'Kinh nghiệm thi TOEIC',
                                label: 'Kinh nghiệm thi TOEIC',
                            },
                        ]}
                    />
                </div>
                <div style={{ marginBottom: 20 }}>
                    <span>Tên bài blog </span>
                    <Input
                        placeholder=" Ví dụ: Các từ vựng trong TOEIC Listening"
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
                    <span>Mô tả bài viết </span>
                    <Input
                        placeholder=" Ví dụ: Một bài viết hay"
                        autoComplete="off"
                        type="text"
                        onInput={(event) => {
                            const inputValue = event.target.value;
                            const capitalizedValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1);
                            event.target.value = capitalizedValue;
                        }}
                        onChange={(event) => {
                            setTestCategory(event.target.value);
                        }}
                    />
                </div>


                <div className="input" style={{ marginBottom: 10 }}>
                    <div className="part3-title" style={{ fontWeight: 'bold', marginBottom: 10 }}><Editor
                        apiKey='gih8fhms5j8pyrjdkiizbeya8ckgjdhfj6fn335ajfk342kk'
                        onInit={(_evt, editor) => editorRefs.current.editor1 = editor}
                        initialValue={``}
                        onEditorChange={(content) => handleEditorChange('editor1', content)}
                        init={{
                            height: 600,
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
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
                            language: 'vi'
                        }}
                    /></div>

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

export default CreateBlog;