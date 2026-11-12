import Swal, { type SweetAlertIcon } from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

type ShowAlertOptions = {
  title: string;
  text?: string;
  html?: string;
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
