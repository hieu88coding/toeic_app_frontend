import React, { useState, useEffect, useRef } from 'react';
import { LibraryAdd, Warning } from "@mui/icons-material";
import {
    Button,
    Table,
    Form,
    Dropdown,
    Space,
    Input,
    Spin
} from "antd";
import Highlighter from 'react-highlight-words';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SearchOutlined, LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import { useAuthUser } from "react-auth-kit";
import { useToastError, useToastSuccess } from "../../utils/toastSettings";
import { publicRequest, userRequest } from "../../requestMethods";
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { WarningModal } from '../warningModal/WarningModal';
import CustomizedMenus from '../adminCRUD/CustomizedMenus';
import CreateTest from '../../pages/admin/createTest/CreateTest'
import {
    ref,
    getDownloadURL,
    listAll,
} from "firebase/storage";
import { storage } from '../../firebase';
import axios from "axios";
import * as XLSX from "xlsx";
import MockDetailModal from '../adminDetailModal/MockDetailModal';

const DeleteOneProductBtn = () => {
    return (
        <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            ghost
            style={{ width: '100%' }}
        >
            Xóa
        </Button>
    );
};


export const MockTable = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const authUser = useAuthUser();
    const [data, setData] = useState([]);
    const [modalData, setModalData] = useState([]);
    const testCode = useLocation().pathname.split("/")[3];
    const navigate = useNavigate();
    const dataCol = [];
    const [tableData, setTableData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [exelParaPart6, setExelParaPart6] = useState([]);
    const [exelParaPart7, setExelParaPart7] = useState([]);
    const [part7Slice, setPart7Slice] = useState(0);
    const handlePart = () => {
        if (data && data.length !== 0) {
            let paragraph1 = data.exel[3].map((item) => {
                if (item.question === undefined) {
                    return '';
                }
                if (item?.question.length !== 0) {
                    return `${item.question}`;
                }
                return null;
            }).filter((item) => item !== null);
            setExelParaPart6(paragraph1)

            let paragraph2 = data.exel[4].map((item) => {
                if (item.para === undefined) {
                    return '';
                }
                if (item?.para.length !== 0) {
                    return `${item.para}`;
                }
                return null;
            }).filter((item) => item !== null);
            setExelParaPart7(paragraph2)
        }

    }

    const handlePart7 = (index) => {
        if (index >= 147 && index < 153) {
            setPart7Slice(2)
        } else if (index >= 153 && index < 156) {
            setPart7Slice(3)
        } else if (index >= 156 && index < 158) {
            setPart7Slice(2)
        } else if (index >= 158 && index < 161) {
            setPart7Slice(3)
        } else if (index >= 161 && index < 169) {
            setPart7Slice(4)
        } else if (index >= 169 && index < 172) {
            setPart7Slice(3)
        } else if (index >= 172 && index < 176) {
            setPart7Slice(4)
        } else {
            setPart7Slice(5)
        }
    }
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const handleDeleteSingleProduct = async (data) => {
        try {
            let res = await userRequest.delete(`/mockTests/${data.id}`);
            if (res.status === 200) {
                navigate(0);
            } else return useToastError("Xóa sản phẩm thất bại");
        } catch (error) {
            console.log(error);
        }
    };
    const getAudioNumber = (link) => {
        const startIndex = link.indexOf("audio_") + 6;
        const endIndex = link.indexOf(".mp3");
        const audioNumber = link.slice(startIndex, endIndex);

        return parseInt(audioNumber);
    };
    const getImagesNumber = (link) => {
        const startIndex = link.indexOf("images_") + 6;
        const endIndex = link.indexOf(".jpg");
        const audioNumber = link.slice(startIndex, endIndex);

        return parseInt(audioNumber);
    };
    const compareAudioLinks = (link1, link2) => {
        const audioNumber1 = getAudioNumber(link1);
        const audioNumber2 = getAudioNumber(link2);

        return audioNumber1 - audioNumber2;
    };
    const compareImagesLinks = (link1, link2) => {
        const audioNumber1 = getImagesNumber(link1);
        const audioNumber2 = getImagesNumber(link2);

        return audioNumber1 - audioNumber2;
    };

    const fetchData = async () => {
        let exelRefs = await listAll(ref(storage, `exel/${testCode}`));
        let exelUrls = await Promise.all(
            exelRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        let audioRefs = await listAll(ref(storage, `mp3/${testCode}`));
        let audioUrls = await Promise.all(
            audioRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        let imagesRefs = await listAll(ref(storage, `jpg/${testCode}`));
        let imagesUrls = await Promise.all(
            imagesRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        audioUrls.sort(compareAudioLinks);
        imagesUrls.sort(compareImagesLinks);
        let answerRefs = await getDownloadURL(ref(storage, `json/${testCode}/${testCode}_answer.xlsx`));
        let temp = [];
        let answerTemp = [];
        if (exelUrls.length !== 0) {
            for (let i = 0; i < exelUrls.length; i++) {
                try {
                    const response = await axios.get(`${exelUrls[i]}`, {
                        responseType: 'arraybuffer',
                    });
                    const data = new Uint8Array(response.data);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    let formattedData = [];
                    if (i === 4) {
                        formattedData = jsonData.slice(1).map((item, index) => ({
                            key: String(index + 1),
                            number: item[0],
                            para: item[1],
                            question: item[2],
                            answerA: item[3],
                            answerB: item[4],
                            answerC: item[5],
                            answerD: item[6],
                        }));
                    } else {
                        formattedData = jsonData.slice(1).map((item, index) => ({
                            key: String(index + 1),
                            number: item[0],
                            question: item[1],
                            answerA: item[2],
                            answerB: item[3],
                            answerC: item[4],
                            answerD: item[5],
                        }));
                    }
                    temp.push(formattedData);
                } catch (error) {
                    console.error('Error fetching Excel data:', error);
                }
            }
        }
        if (answerRefs) {
            try {
                const response = await axios.get(`${answerRefs}`, {
                    responseType: 'arraybuffer',
                });
                const data = new Uint8Array(response.data);
                const workbook = XLSX.read(data, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                let formattedData = jsonData.slice(1).map((item, index) => ({
                    key: String(index + 1),
                    number: item[0],
                    correctAnswer: item[1],
                    explanation: item[2],
                    transcript: item[3],
                }));

                answerTemp.push(formattedData);
            } catch (error) {
                console.error('Error fetching Excel data:', error);
            }
        }
        console.log(temp);
        setData({
            exel: temp,
            audio: audioUrls,
            images: imagesUrls,
            answer: answerTemp,
        });
        for (let i = 0; i < 6; i++) {
            const element = {
                index: i + 1,
                question: 'Không có',
                answer: answerTemp[0][i].correctAnswer,
            };
            dataCol.push(element);
        }
        for (let i = 0; i < 25; i++) {
            const element = {
                index: i + 7,
                question: 'Không có',
                answer: answerTemp[0][i].correctAnswer,
            };
            dataCol.push(element);
        }
        for (let i = 0; i < 39; i++) {
            const element = {
                index: i + 32,
                question: temp[0][i].question,
                answer: answerTemp[0][i + 31].correctAnswer,
            };
            dataCol.push(element);
        }
        for (let i = 0; i < 30; i++) {
            const element = {
                index: i + 71,
                question: temp[1][i].question,
                answer: answerTemp[0][i + 70].correctAnswer,
            };
            dataCol.push(element);
        }
        for (let i = 0; i < 30; i++) {
            const element = {
                index: i + 101,
                question: temp[2][i].question,
                answer: answerTemp[0][i + 100].correctAnswer,
            };
            dataCol.push(element);
        }
        for (let i = 0; i < 16; i++) {
            const element = {
                index: i + 131,
                question: temp[3][i].question === '' ? 'Không có' : temp[3][i].question,
                answer: answerTemp[0][i + 130].correctAnswer,
            };
            dataCol.push(element);
        }
        for (let i = 0; i < 54; i++) {
            const element = {
                index: i + 147,
                question: temp[4][i].question,
                answer: answerTemp[0][i + 146].correctAnswer,
            };
            dataCol.push(element);
        }
        console.log(dataCol);
        setTableData(dataCol)

    };
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        handlePart();
    }, [data]);
    const handleOpenChange = (newValue) => {
        setIsOpen(newValue);
    };
    const handleOpenModalChange = (newValue) => {
        setIsModalOpen(newValue);
    };

    const viewDetailModal = (record) => {
        if (data && data.length !== 0) {
            let index = record.index;
            console.log(index);
            const tempModalData = [];
            if (index <= 6) {
                tempModalData.push({
                    partName: 'part1',
                    exel: '',
                    audio: data.audio[index - 1],
                    images: data.images[index - 1],
                    correctAnswer: data.answer[0][index - 1],
                })
            } else if (index > 6 && index <= 31) {
                tempModalData.push({
                    partName: 'part2',
                    exel: '',
                    audio: data.audio[index - 1],
                    images: '',
                    correctAnswer: data.answer[0][index - 1],
                })
            } else if (index > 31 && index <= 70) {
                if (index >= 65 && index <= 70) {
                    tempModalData.push({
                        partName: 'part3',
                        images: (data.images[Math.floor((index - 65) / 3) + 6]),
                        exel: (data.exel[0][index - 32]),
                        audio: (data.audio[Math.floor((index - 31) / 3) + 31]),
                        correctAnswer: (data.answer[0][index - 1]),
                    })
                } else {
                    tempModalData.push({
                        partName: 'part3',
                        images: '',
                        exel: (data.exel[0][index - 32]),
                        audio: (data.audio[Math.floor((index - 31) / 3) + 31]),
                        correctAnswer: (data.answer[0][index - 1]),
                    })
                }

            } else if (index > 70 && index <= 100) {
                if (index >= 95 && index <= 100) {
                    tempModalData.push({
                        partName: 'part4',
                        images: (data.images[Math.floor((index - 95) / 3) + 8]),
                        exel: (data.exel[1][index - 71]),
                        audio: (data.audio[Math.floor((index - 95) / 3) + 44]),
                        correctAnswer: (data.answer[0][index - 1]),
                    })

                } else {
                    tempModalData.push({
                        partName: 'part4',
                        images: '',
                        exel: (data.exel[1][index - 71]),
                        audio: (data.audio[Math.floor((index - 95) / 3) + 44]),
                        correctAnswer: (data.answer[0][index - 1]),
                    })
                }
            } else if (index > 100 && index <= 130) {
                tempModalData.push({
                    partName: 'part5',
                    images: '',
                    exel: (data.exel[2][index - 101]),
                    audio: '',
                    correctAnswer: (data.answer[0][index - 1]),
                })
            } else if (index > 130 && index <= 146) {
                let temp = data.exel[3][index - 131];
                temp.question = exelParaPart6[Math.floor((index - 131) / 4)];
                tempModalData.push({
                    partName: 'part6',
                    exel: temp,
                    images: '',
                    audio: '',
                    correctAnswer: (data.answer[0][index - 1]),
                })

            } else if (index > 146 && index <= 200) {
                handlePart7(index);
                let part7 = data.exel[4][index - 147];
                if (part7 && part7 !== undefined && part7.length !== 0 && part7Slice !== 0) {
                    part7.question = exelParaPart7[Math.floor((index - 147) / part7Slice)];
                    tempModalData.push({
                        partName: 'part7',
                        exel: part7,
                        images: '',
                        audio: '',
                        correctAnswer: (data.answer[0][index - 1]),
                    })
                }
            } else {
                console.log('Vào trường hợp phụ ở mocktable');
            }
            console.log(tempModalData);
            setModalData(tempModalData[0]);
            handleOpenModalChange(true);
        }
    }

    const columns = [
        {
            title: 'Số thứ tự',
            dataIndex: 'index',
            key: 'index',
            width: '10%',
            ...getColumnSearchProps('index'),
        },
        {
            title: 'Câu hỏi',
            dataIndex: 'question',
            key: 'question',
            width: '40%',
            ...getColumnSearchProps('question'),
            render: (_, record) => {
                return (
                    <div><span dangerouslySetInnerHTML={{ __html: `${record.question}` }}></span></div>
                )
            }
        },
        {
            title: 'Đáp án',
            dataIndex: 'answer',
            key: 'answer',
            width: '30%',
            ...getColumnSearchProps('answer'),
        },
        {
            dataIndex: "action",
            width: "20%",
            align: "center",
            render: (_, record) => {
                const items = [
                    {
                        key: '1',
                        label: (
                            <Button
                                type="primary"
                                icon={<DeleteOutlined />}
                                ghost
                                onClick={() => viewDetailModal(record)}
                            >
                                Xem chi tiết
                            </Button>
                        ),
                    },

                ];
                return (
                    <div>
                        <Dropdown
                            menu={{
                                items,
                                selectable: true,
                            }}
                            placement="bottomLeft"
                            arrow={{
                                pointAtCenter: true,
                            }}
                        >
                            <Space >
                                <Button size='large' style={{ borderColor: '#1677ff', color: '#1677ff' }}>Thao tác</Button>
                            </Space>
                        </Dropdown>
                    </div>
                )
            },
        },
    ];




    return (
        <div>
            <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 50 }}>{testCode}</div>
            <Spin
                indicator={
                    <LoadingOutlined
                        style={{
                            fontSize: 24,
                        }}
                        spin
                    />
                }
                spinning={tableData.length !== 0 ? false : true}
                fullscreen="true" tip="Đang tải dữ liệu" size="large">
                {/* <div>
                    <CreateTest
                        dataTest={props.data}
                        testName={props.itemKey}
                        style={{ textAlign: "center" }}
                        isOpenModal={isOpen}
                        handleOpenChange={handleOpenChange}
                    />
                </div> */}
                {modalData !== undefined && modalData.length !== 0 &&
                    <div>
                        <MockDetailModal
                            data={modalData}
                            testName={props.itemKey}
                            style={{ textAlign: "center" }}
                            isOpenModal={isModalOpen}
                            handleOpenModalChange={handleOpenModalChange}
                            oldExel={data.exel}
                            oldAnswer={data.answer}
                        />
                    </div>
                }



                {/* <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'flex-end' }} className="uploadExcelBtn">
                    <CustomizedMenus
                        handleOpenChange={handleOpenChange}
                        isOpenModal={isOpen}
                    />
                </div> */}
                <Table
                    rowKey={(record) => record + Math.floor(Math.random() * 10000)}
                    bordered
                    dataSource={tableData}
                    columns={columns}
                    pagination={{
                        //pageSize: pageSize,
                        //current: page,
                        //total: totalCount,
                        //onChange: (page) => {
                        //getProducts(page);
                        //},
                    }}
                />
            </Spin>





        </div>


    );
};
