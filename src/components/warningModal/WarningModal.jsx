import { Dialog, Transition } from "@headlessui/react";
import { WarningAmber } from "@mui/icons-material";
import { Modal } from "antd";
import { Fragment, useState } from "react";

export const WarningModal = ({
  InitiateComponent,
  warningContent,
  confirmFunction,
  parameters,
}) => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleConfirm = () => {
    confirmFunction(parameters);
    closeModal();
  };

  return (
    <>
      <div onClick={openModal} style={{ cursor: "pointer" }}>
        <InitiateComponent />
      </div>

      <Modal
        title={"Cảnh báo"}
        open={isOpen}
        onOk={handleConfirm}
        onCancel={closeModal}
        cancelText="Hủy"
        okText="Xác nhận"
        width={570}
      >
        <div className="mt-2">
          <p>{warningContent}</p>
        </div>
      </Modal>
    </>
  );
};
