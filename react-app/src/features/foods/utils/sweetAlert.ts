import Swal, { type SweetAlertIcon } from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

type ShowAlertOptions = {
  title: string;
  text?: string;
  html?: string;
  icon?: SweetAlertIcon;
};

type ShowConfirmOptions = {
  title: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: SweetAlertIcon;
};

export const showAlert = ({ title, text, html, icon = 'info' }: ShowAlertOptions) => {
  return Swal.fire({
    title,
    text,
    html,
    icon,
    confirmButtonText: '확인',
  });
};

export const showConfirm = async ({
  title,
  text,
  confirmButtonText = '확인',
  cancelButtonText = '취소',
  icon = 'warning',
}: ShowConfirmOptions): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });

  return result.isConfirmed;
};
