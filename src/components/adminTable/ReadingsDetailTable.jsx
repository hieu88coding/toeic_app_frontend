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
import ReadingsDetailAdmin from '../adminDetailModal/ReadingsDetailAdmin';

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


export const ReadingsDetailTable = (props) => {
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
    const handlePart = () => {
        if (data && data.length !== 0) {
            if (testCode === 'part6') {
                let paragraph1 = data.exel[0].map((item) => {
                    if (item.question === undefined) {
                        return '';
                    }
                    if (item?.question.length !== 0) {
                        return `${item.question}`;
                    }
                    return null;
                }).filter((item) => item !== null);
                setExelParaPart6(paragraph1)
            } else if (testCode.charAt(4) === '7') {
                let paragraph2 = data.exel[0].map((item) => {
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

    }

    const handlePart7 = (index) => {
        if (testCode === 'part71') {
            if (index >= 1 && index < 9) {
                setPart7Slice(2)
            } else if (index >= 9 && index < 18) {
                setPart7Slice(3)
            } else {
                setPart7Slice(4)
            }
        } else if (testCode === 'part72' || testCode === 'part73') {
            setPart7Slice(5)
        } else {
            setPart7Slice(0);
        }

    }
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

    const fetchData = async () => {
        let exelRefs = await listAll(ref(storage, `Readings/exel/${partEnglishName}/${testName}`));
        let exelUrls = await Promise.all(
            exelRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        console.log(exelUrls);
        let answerRefs = await listAll(ref(storage, `Readings/json/${partEnglishName}/${testName}`));
        let answerUrls = await Promise.all(
            answerRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        let temp = [];
        let answerTemp = [];
        if (exelUrls.length !== 0) {
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
            audio: [],
            images: [],
            answer: answerTemp[0],
        });
        if (answerTemp.length !== 0) {
            for (let i = 0; i < temp[0].length; i++) {
                const element = {
                    index: i + 1,
                    question: temp[0][i].question === '' ? 'Không có' : temp[0][i].question,
                    answer: answerTemp[0][i].correctAnswer,
                };
                dataCol.push(element);
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
            if (testCode === 'part5' || testCode === 'part6') {
                tempModalData.push({
                    partName: testCode,
                    images: '',
                    exel: (data.exel[0][index - 1]),
                    audio: '',
                    correctAnswer: (data.answer[index - 1]),
                })
            } else {
                handlePart7(index);
                let part7 = data.exel[0][index - 1];
                if (part7 && part7 !== undefined && part7.length !== 0 && part7Slice !== 0) {
                    part7.question = exelParaPart7[Math.floor((index - 1) / part7Slice)];
                    tempModalData.push({
                        partName: 'part7',
                        exel: part7,
                        images: '',
                        audio: '',
                        correctAnswer: (data.answer[0][index - 1]),
                    })
                }
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
                        <ReadingsDetailAdmin
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
