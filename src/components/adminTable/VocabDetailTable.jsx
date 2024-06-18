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
import VocabDetailAdmin from '../adminDetailModal/VocabDetailAdmin';

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


export const VocabDetailTable = (props) => {
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
    const getImagesNumber = (link) => {
        const startIndex = link.indexOf("images_") + 6;
        const endIndex = link.indexOf(".jpg");
        const audioNumber = link.slice(startIndex, endIndex);

        return parseInt(audioNumber);
    };
    const compareImagesLinks = (link1, link2) => {
        const audioNumber1 = getImagesNumber(link1);
        const audioNumber2 = getImagesNumber(link2);

        return audioNumber1 - audioNumber2;
    };
    const fetchData = async () => {
        let exelRefs = await listAll(ref(storage, `Vocabularys/exel/${testCode}`));
        let exelUrls = await Promise.all(
            exelRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        console.log(exelUrls);
        let imagesRefs = await listAll(ref(storage, `Vocabularys/jpg/Ảnh/${testCode}/extractedFile`));
        let imagesUrls = await Promise.all(
            imagesRefs.items.map(async (exelRef) => {
                const url = await getDownloadURL(exelRef); // Tải xuống từng ảnh
                return url;
            })
        );
        let temp = [];
        imagesUrls.sort(compareImagesLinks);
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
                    word: item[1],
                    transcribe: item[2],
                    meaning: item[3],
                }));


                temp.push(formattedData);
            } catch (error) {
                console.error('Error fetching Excel data:', error);
            }

        }
        console.log(temp);
        console.log(imagesUrls);
        setData({
            exel: temp,
            audio: [],
            images: imagesUrls,
            answer: [],
        });
        if (imagesUrls.length !== 0) {
            for (let i = 0; i < temp[0].length; i++) {
                const element = {
                    index: i + 1,
                    word: temp[0][i].word === '' ? 'Không có' : temp[0][i].word,
                    meaning: temp[0][i].meaning,
                };
                dataCol.push(element);
            }
        }
        console.log(dataCol);
        setTableData(dataCol);

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
                partName: testCode,
                images: (data.images[index - 1]),
                exel: (data.exel[0][index - 1]),
                audio: '',
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
            title: 'Từ vựng',
            dataIndex: 'word',
            key: 'word',
            width: '40%',
            ...getColumnSearchProps('word'),
            render: (_, record) => {
                return (
                    <div><span dangerouslySetInnerHTML={{ __html: `${record.word}` }}></span></div>
                )
            }
        },
        {
            title: 'Ý nghĩa',
            dataIndex: 'meaning',
            key: 'meaning',
            width: '30%',
            ...getColumnSearchProps('meaning'),
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
                        <VocabDetailAdmin
                            data={modalData}
                            testName={props.itemKey}
                            style={{ textAlign: "center" }}
                            isOpenModal={isModalOpen}
                            handleOpenModalChange={handleOpenModalChange}
                            oldExel={data.exel}
                            oldAnswer={data.answer}
                        // partEnglishName={partEnglishName}
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
