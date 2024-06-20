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
import BlogDetailAdmin from '../adminDetailModal/BlogDetailAdmin';

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


export const BlogDetailTable = (props) => {
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
        try {
            let res = await publicRequest.get(
                `/blogs?id=${testCode}`
            );
            console.log(res);
            if (res.status === 200) {
                let exelRefs = await listAll(ref(storage, `Blogs/html/${res.data[0].contentMarkdown}/${res.data[0].title}`));
                let exelUrls = await Promise.all(
                    exelRefs.items.map(async (exelRef) => {
                        const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                        return url;
                    })
                );
                console.log(exelUrls);
                let imagesRefs = await listAll(ref(storage, `Blogs/jpg/${res.data[0].contentMarkdown}/${res.data[0].title}`));
                let imagesUrls = await Promise.all(
                    imagesRefs.items.map(async (exelRef) => {
                        const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                        return url;
                    })
                );
                let temp = [];
                if (exelUrls.length !== 0) {
                    try {
                        const response = await axios.get(exelUrls[0]);
                        temp = response.data;
                    } catch (error) {
                        console.error('Error fetching Excel data:', error);
                    }

                }
                console.log(temp);
                setData({
                    exel: temp,
                    data: res.data[0],
                    images: imagesUrls,
                    answer: [],
                });

                const element = {
                    index: 1,
                    question: res.data[0].title,
                    answer: res.data[0].contentMarkdown,
                };
                dataCol.push(element);

                console.log(dataCol);
                setTableData(dataCol);
            } else return useToastError("Something went wrong!");
        } catch (error) {
            console.log(error);
        }


    };
    useEffect(() => {
        fetchData();
    }, []);
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
            tempModalData.push({
                partName: 'Bài viết',
                exel: data.exel,
                audio: '',
                images: data.images[index - 1],
                correctAnswer: '',
            })

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
            title: 'Chuyên mục',
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
            title: 'Tiêu đề',
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
            <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 50 }}>Blog Detail</div>
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
                        <BlogDetailAdmin
                            data={modalData}
                            testName={props.itemKey}
                            style={{ textAlign: "center" }}
                            isOpenModal={isModalOpen}
                            handleOpenModalChange={handleOpenModalChange}
                            oldExel={data.data}
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
