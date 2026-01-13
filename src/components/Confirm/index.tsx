import { Modal, ModalFuncProps } from "antd";

const getMessage = (
  type: "add" | "edit" | "delete" | "cancel" | "transfer" | undefined,
  pageText?: string
): { topic: string; desc: string } => {
  if (!type) return { topic: "", desc: "" };
  const title = pageText || "";
  const message: any = {
    add: {
      topic: "Confirm Add",
      desc: `Are you sure you want to add this item?`,
    },
    edit: {
      topic: "Confirm Update",
      desc: `Are you sure you want to update this item?`,
    },
    delete: {
      topic: "Confirm Delete",
      desc: `Are you sure you want to delete this item(s)?`,
    },
    cancel: {
      topic: "Cancel Edit",
      desc: `Are you sure you want to cancel edit this ${title || "item"}?`,
    },
    transfer: {
      topic: "Confirm to Transfer",
      desc: `Are you sure you want to transfer this item?`,
    },
  };

  return message[type];
};

const Confirm = ({
  typeText,
  pageText,
  title,
  content,
  width,
  okText,
  okType,
  cancelText,
  onOk,
  onCancel,
  ...props
}: ModalConfirmProps) => {
  const { topic, desc } = getMessage(typeText, pageText);
  return Modal.confirm({
    centered: true,
    icon: null,
    width: width || 650,
    title: title || topic,
    content: content || desc,
    cancelText: okText || "Confirm",
    okText: cancelText || "Cancel",
    okType: okType || "default",
    transitionName: "",
    maskTransitionName: "",
    onCancel() {
      typeof onOk === "function" && onOk();
    },
    onOk() {
      typeof onCancel === "function" && onCancel();
    },
    ...props,
  });
};

type ModalConfirmProps = ModalFuncProps & {
  typeText?: "add" | "edit" | "delete" | "cancel" | "transfer";
  pageText?: string;
};

export default Confirm;
