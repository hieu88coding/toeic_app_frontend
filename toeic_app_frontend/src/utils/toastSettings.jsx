import { toast } from "react-toastify"

export const toastSettings = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
}

export const useToastSuccess = (message) => {
    toast.success(message, { ...toastSettings })
}
export const useToastError = (message) => {
    toast.error(message, { ...toastSettings })
}
export const useToastShow = (message) => {
    toast.warn(message, { ...toastSettings })
}