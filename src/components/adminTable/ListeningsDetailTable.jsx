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
import ListeningsDetailAdmin from '../adminDetailModal/ListeningsDetailAdmin';

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


export const ListeningsDetailTable = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const authUser = useAuthUser();
    const [data, setData] = useState([]);
    const [modalData, setModalData] = useState([]);
    const testCode = useLocation().pathname.split("/")[3];
    const testName = useLocation().pathname.split("/")[4];
    const navigate = useNavigate();
    const dataCol = [];
    const [tableData, setTableData] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const [exelParaPart6, setExelParaPart6] = useState([]);
    const [exelParaPart7, setExelParaPart7] = useState([]);
    const [part7Slice, setPart7Slice] = useState(0);
    const [partEnglishName, setPartEnglishName] = useState('');
    const partDetection = () => {
        switch (testCode) {
            case 'part1':
                setPartEnglishName('Part 1 - Mô tả tranh')
                break;
            case 'part2':
                setPartEnglishName('Part 2 - Hỏi & Đáp')
                break;
            case 'part3':
                setPartEnglishName('Part 3 - Đoạn hội thoại')
                break;
            case 'part4':
                setPartEnglishName('Part 4 - Bài nói ngắn')
                break;
            case 'part5':
                setPartEnglishName('Part 5 - Hoàn thành câu')
                break;
            case 'part6':
                setPartEnglishName('Part 6 - Hoàn thành đoạn văn')
                break;
            case 'part71':
                setPartEnglishName('Part 7 - Đoạn đơn')
                break;
            case 'part72':
                setPartEnglishName('Part 7 - Đoạn kép')
                break;
            case 'part73':
                setPartEnglishName('Part 7 - Đoạn ba')
                break;

            default:
                setPartEnglishName('default')
                break;
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
        let exelRefs = await listAll(ref(storage, `Listenings/exel/${partEnglishName}/${testName}`));
        let exelUrls = await Promise.all(
            exelRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        console.log(exelUrls);
        let audioRefs = await listAll(ref(storage, `Listenings/mp3/${partEnglishName}/${testName}/extractedFile`));
        let audioUrls = await Promise.all(
            audioRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        let imagesRefs = await listAll(ref(storage, `Listenings/jpg/${partEnglishName}/${testName}/extractedFile`));
        let imagesUrls = await Promise.all(
            imagesRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        audioUrls.sort(compareAudioLinks);
        imagesUrls.sort(compareImagesLinks);
        let answerRefs = await listAll(ref(storage, `Listenings/json/${partEnglishName}/${testName}`));
        let answerUrls = await Promise.all(
            answerRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        let temp = [];
        let answerTemp = [];
        if (exelUrls.length !== 0) {
            if (testCode !== 'part1' && testCode !== 'part2') {
                try {
                    const response = await axios.get(`${exelUrls}`, {
                        responseType: 'arraybuffer',
                    });
                    const data = new Uint8Array(response.data);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    let formattedData = [];

                    formattedData = jsonData.slice(1).map((item, index) => ({
                        key: String(index + 1),
                        number: item[0],
                        question: item[1],
                        answerA: item[2],
                        answerB: item[3],
                        answerC: item[4],
                        answerD: item[5],
                    }));


                    temp.push(formattedData);
                } catch (error) {
                    console.error('Error fetching Excel data:', error);
                }
            }
        }
        console.log(answerUrls);
        if (answerUrls.length !== 0) {
            try {
                const response = await axios.get(`${answerUrls[0]}`, {
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
        console.log(answerTemp);
        console.log(temp);
        setData({
            exel: temp,
            audio: audioUrls,
            images: imagesUrls,
            answer: answerTemp[0],
        });
        if (answerTemp.length !== 0) {
            if (testCode === 'part1' || testCode === 'part2') {
                for (let i = 0; i < answerTemp[0].length; i++) {
                    const element = {
                        index: i + 1,
                        question: 'Không có',
                        answer: answerTemp[0][i].correctAnswer,
                    };
                    dataCol.push(element);
                }
            } else {
                for (let i = 0; i < answerTemp[0].length; i++) {
                    const element = {
                        index: i + 1,
                        question: temp[0][i].question,
                        answer: answerTemp[0][i].correctAnswer,
                    };
                    dataCol.push(element);
                }
            }
        }
        console.log(dataCol);
        setTableData(dataCol);

    };
    useEffect(() => {
        partDetection();
    }, []);
    useEffect(() => {
        fetchData();
    }, [partEnglishName]);
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
            if (testCode === 'part1') {
                tempModalData.push({
                    partName: 'part1',
                    exel: '',
                    audio: data.audio[index - 1],
                    images: data.images[index - 1],
                    correctAnswer: data.answer[index - 1],
                })
            } else if (testCode === 'part2') {
                tempModalData.push({
                    partName: 'part2',
                    exel: '',
                    audio: data.audio[index - 1],
                    images: '',
                    correctAnswer: data.answer[index - 1],
                })
            } else {
                tempModalData.push({
                    partName: testCode,
                    images: '',
                    exel: (data.exel[0][index - 1]),
                    audio: (data.audio[index - 1]),
                    correctAnswer: (data.answer[index - 1]),
                })
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
                {modalData !== undefined && modalData.length !== 0 &&
                    <div>
                        <ListeningsDetailAdmin
                            data={modalData}
                            testName={props.itemKey}
                            style={{ textAlign: "center" }}
                            isOpenModal={isModalOpen}
                            handleOpenModalChange={handleOpenModalChange}
                            oldExel={data.exel}
                            oldAnswer={data.answer}
                            partEnglishName={partEnglishName}
                        />
                    </div>
                }
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
