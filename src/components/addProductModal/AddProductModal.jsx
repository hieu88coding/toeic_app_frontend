import { UploadOutlined } from "@ant-design/icons";
import { TextField } from "@mui/material";
import { Button, Form, Input, Modal, Upload } from "antd";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import { v4 } from "uuid";
import { storage } from "../../firebase";
import "./addProductModal.scss";

import { useToastError } from "../../utils/toastSettings";

const imgPlaceholder =
  "https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg";

export const AddProductModal = ({
  handleAddProduct,
  isOpenModal,
  handleOpenChange,
}) => {
  const [inputs, setInputs] = useState({});
  const [numberInputs, setNumberInputs] = useState({});
  const [imgFile, setImgFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const uploadRef = useRef();

  function closeModal() {
    handleOpenChange(false);
  }


  const handleInputsChange = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };
  const handleUploadImg = async () => {
    if (!imgFile) return;
    const imgRef = ref(storage, `images/${imgFile.name + v4()}`);
    await uploadBytes(imgRef, imgFile);
    const uploadedImgURL = await getDownloadURL(imgRef);
    return uploadedImgURL;
  };
  const addProduct = async () => {
    setIsLoading(true);
    const imgURL = await handleUploadImg();
    handleAddProduct(
      { ...inputs, id: v4() },
      imgURL ? imgURL : imgPlaceholder
    );
    setIsLoading(false);
    setInputs({});
    closeModal();

  };
  const handleInputNumberChange = (e) => {
    const rawValue = e.target.value;
    const unformattedValue = rawValue.replace(/,/g, "");
    // Remove existing commas and parse the number
    const parsedValue = parseFloat(unformattedValue);

    // Check if the parsed value is a valid number
    if (!isNaN(parsedValue)) {
      // Format the number with commas and update the input value
      setInputs({ ...inputs, [e.target.name]: unformattedValue });
      setNumberInputs({
        ...numberInputs,
        [e.target.name]: parsedValue.toLocaleString(),
      });
    } else {
      // Handle invalid input (optional)
      setInputs({ ...inputs, [e.target.name]: "" });
      setNumberInputs({
        ...numberInputs,
        [e.target.name]: "",
      });
    }
  };
  return (
    <>
      <Modal
        title={"Thêm mới sản phẩm"}
        open={isOpenModal}
        onCancel={closeModal}
        onOk={addProduct}
        confirmLoading={isLoading}
        cancelText="Hủy"
        okText="Xác nhận"
        width={570}
      >
        <div className="mt-5">
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 19 }}
            layout="horizontal"
          >
            <Form.Item label="Tên">
              <Input
                name="name"
                placeholder="Áo khoác da"
                onChange={handleInputsChange}
              />
            </Form.Item>
            <Form.Item label="Số lượng">
              <Input
                name="quantity"
                placeholder="10"
                value={numberInputs.quantity}
                onChange={handleInputNumberChange}
              />
            </Form.Item>
            <Form.Item label="Cân nặng">
              <Input
                name="weight"
                placeholder="10"
                onChange={handleInputsChange}
                addonAfter="kg"
              />
            </Form.Item>
            <Form.Item label="Đơn giá">
              <Input
                name="price"
                placeholder="200,000"
                value={numberInputs.price}
                onChange={handleInputNumberChange}
                addonAfter="₫"
              />
            </Form.Item>
            <Form.Item label="Mô tả">
              <Input
                name="description"
                placeholder="Áo khoác ấm"
                onChange={handleInputsChange}
              />
            </Form.Item>
            <Form.Item label="Hình ảnh">
              <Upload
                ref={uploadRef}
                listType="picture"
                maxCount={1}
                beforeUpload={(file) => {
                  setImgFile(file);
                  return false;
                }}
              >
                <Button icon={<UploadOutlined />} type="primary">
                  Chọn hình ảnh sản phẩm
                </Button>
              </Upload>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
