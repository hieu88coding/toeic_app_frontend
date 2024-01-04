import React, { useState, useEffect } from 'react';
import { LibraryAdd, Warning } from "@mui/icons-material";
import {
    Button,
    Table,
    Form,
    Input,
    InputNumber,
    Typography,
    Upload,
    Tag,
} from "antd";
import { DeleteOutlined, SaveOutlined, EditOutlined } from "@ant-design/icons";
import { useAuthUser } from "react-auth-kit";
import { useToastError, useToastSuccess } from "../../utils/toastSettings";
import { publicRequest, userRequest } from "../../requestMethods";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { WarningModal } from '../warningModal/WarningModal';
import { AddProductModal } from '../addProductModal/AddProductModal';
import CustomizedMenus from './CustomizedMenus';



const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    key={dataIndex}
                    name={dataIndex}
                    style={{
                        margin: 0,
                    }}
                    rules={[
                        {
                            required: true,
                            message: `Hãy điền ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                <div className="centered-cell">{children}</div>
                // children
            )}
        </td>
    );
};

const DeleteOneProductBtn = () => {
    return (
        <Button
            type="primary"
            danger
            style={{ marginRight: "8px" }}
            icon={<DeleteOutlined />}
            ghost
        >
            Xóa
        </Button>
    );
};

export const AdminCRUD = (props) => {
    const [stats, setStats] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 6;
    const [totalCount, setTotalCount] = useState(1);
    const authUser = useAuthUser();
    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [editingKey, setEditingKey] = useState("");
    const isEditing = (record) => record.id === editingKey;
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const handlePostProducts = async () => {
        // if (data && data.length === 0) {
        //   useToastError("Hàng chưa được tải lên !");
        // } else if (!validateProducts(data)) {
        //   return;
        // } else {
        //   let checkedArray = await handleCheckProductCode();
        //   if (checkedArray.length === 0) {
        //     for (let i = 0; i < data.length; ++i) {
        //       try {
        //         let res = await userRequest.post(`/productShop`, {
        //           name: data[i].name,
        //           quantity: data[i].quantity,
        //           price: data[i].price,
        //           image: data[i].image,
        //           weight: data[i].weight,
        //           description: data[i].description,
        //           productCode: v4(),
        //           shopOwnerId: authUser().id,
        //         });
        //         await userRequest.put(`/productShop/${res.data.data.id}`, {
        //           name: data[i].name,
        //           quantity: data[i].quantity,
        //           price: data[i].price,
        //           image: data[i].image,
        //           weight: data[i].weight,
        //           description: data[i].description,
        //           productCode: generateProductCode(res.data.data.id),
        //           shopOwnerId: authUser().id,
        //         });
        //       } catch (error) {
        //         console.log(error);
        //       }
        //     }
        //     handleClearProducts();
        //     navigate(0);
        //   } else {
        //     for (let i = 0; i < checkedArray.length; i++) {
        //       useToastError(checkedArray[i]);
        //     }
        //   }
        // }
    };


    const handleOpenChange = (newValue) => {
        setIsOpen(newValue);
    };

    const handleAddProduct = (inputs, imageURL) => {
        // setProducts((prevProducts) => [
        //   ...prevProducts,
        //   {
        //     id: inputs.id,
        //     image: imageURL,
        //     name: inputs.name,
        //     price: parseInt(inputs.price),
        //     quantity: parseInt(inputs.quantity),
        //     description: inputs.description,
        //     weight: parseFloat(inputs.weight),
        //   },
        // ]);
    };

    const getProducts = async () => {
        try {
            setIsLoading(true);
            let res = await publicRequest.get(
                `/${props.itemKey}`
            );
            console.log(res);
            if (res.status === 200) {
                setProducts(res.data);
                // setPage(currentPage);
                setIsLoading(false);
            } else return useToastError("Something went wrong!");
        } catch (error) {
            console.log(error);
        }

    };

    useEffect(() => {
        handleProps();
        getProducts();
    }, [props.itemKey]);

    const edit = (record) => {
        form.setFieldsValue({
            id: "",
            testName: "",
            pdf: "",
            audiomp3: "",
            correctAnswer: "",
            ...record,
        });
        console.log(record);
        setEditingKey(record.id);
    };
    const cancel = () => {
        setEditingKey("");
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.id);
            let item;
            if (index > -1) {
                item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                item = newData[index];
                let res = await handleUpdateProduct(item);
                console.log(res);
                if (res) {
                    return useToastError(res);
                } else {
                    setData(newData);
                    setEditingKey("");
                }
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey("");
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }
    };

    const handleUpdateProduct = async (data) => {
        console.log(data);
        try {
            // let res = await userRequest.put(`/productShop/${data.id}`, {
            //     name: data.name,
            //     quantity: data.quantity,
            //     price: data.price,
            //     image: data.image,
            //     weight: data.weight,
            //     description: data.description,
            //     productCode: data.productCode,
            //     shopOwnerId: authUser().id,
            // });
            console.log(res);
            if (res.data.type === "success") {
                navigate(0);
            } else return res.data.message;
        } catch (error) {
            console.log(error);
        }
    };
    const columns = [
        {
            title: "Test ID",
            dataIndex: "id",
            align: "center",
            // editable: true,
        },
        {
            title: "Tên Test",
            dataIndex: "testName",
            editable: true,
            align: "center",
        },
        {
            title: "File PDF Đề bài",
            dataIndex: "pdf",
            editable: true,
            align: "center",
            render: (_, record) => (
                <a href={record.pdf}>Link PDF đề bài</a> // Sử dụng component Link để tạo liên kết
            ),
        },
        {
            title: "File Audio MP3",
            dataIndex: "audiomp3",
            editable: true,
            align: "center",
            render: (_, record) => (
                <a href={record.pdf}>Link file Audio MP3</a> // Sử dụng component Link để tạo liên kết
            ),
        },
        {
            title: "File Đáp án",
            dataIndex: "correctAnswer",
            editable: true,
            align: "center",
            render: (_, record) => (
                <a href={record.pdf}>Link Đáp án</a> // Sử dụng component Link để tạo liên kết
            ),
        },
        {
            title: "Sửa",
            dataIndex: "action",
            width: "18vw",
            align: "center",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span className="flex">
                        <Button
                            type="primary"
                            onClick={() => save(record.id)}
                            style={{
                                marginRight: 8,
                            }}
                            icon={<SaveOutlined />}
                            ghost
                        >
                            Lưu
                        </Button>

                        <WarningModal
                            confirmFunction={handleDeleteSingleProduct}
                            parameters={record}
                            warningContent={"Bạn chắc muốn xóa sản phẩm này chứ?"}
                            InitiateComponent={DeleteOneProductBtn}
                        />
                        <Button
                            onClick={cancel}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Hủy
                        </Button>
                    </span>
                ) : (
                    <Button
                        style={{ width: "100px" }}
                        disabled={editingKey !== ""}
                        onClick={() => edit(record)}
                        icon={<EditOutlined />}
                    />
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === "quantity" ? "number" : "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
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
        setEditingKey("");
    };

    useEffect(() => {
        setData(products);
    }, [products]);
    const handleProps = () => {
        switch (props.itemKey) {
            case 'mockTests':
                setStats('Mock Tests');
                break;
            case 'listenings':
                setStats('Listenings');
                break;
            case 'readings':
                setStats('Readings');
                break;
            case 'grammars':
                setStats('grammars');
                break;
            case 'vocabularys':
                setStats('Vocabularys');
                break;
            case 'blogs':
                setStats('Blogs');
                break;
            default:
                setStats('Errors');
                break;
        }
    }


    return (
        <div>
            <div style={{ fontSize: 18, fontWeight: 'bold' }}>{stats}</div>
            <div>
                <AddProductModal
                    style={{ textAlign: "center" }}
                    isOpenModal={isOpen}
                    handleOpenChange={handleOpenChange}
                    handleAddProduct={handleAddProduct}
                /></div>

            <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'flex-end' }} className="uploadExcelBtn">
                <CustomizedMenus
                    //handleExelClick={handleUploadExcel}
                    handleOpenChange={handleOpenChange}
                    isOpenModal={isOpen}
                />
            </div>
            <Form form={form} component={false}>
                <Table
                    rowKey={(record) => record + Math.floor(Math.random() * 1000)}
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    //loading={isLoading}
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{
                        pageSize: pageSize,
                        current: page,
                        total: totalCount,
                        onChange: (page) => {
                            //getProducts(page);
                        },
                    }}
                />
            </Form>
        </div>


    );
};
