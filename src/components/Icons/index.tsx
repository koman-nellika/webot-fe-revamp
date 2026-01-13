import Plus from "/public/icons/icon-plus.svg";
import Upload from "/public/icons/icon-upload.svg";
import Download from "/public/icons/icon-download.svg";
import Wrap from "/public/icons/icon-wrap.svg";
import Edit from "/public/icons/icon-edit.svg";
import EditDisabled from "/public/icons/icon-edit-disabled.svg";
import Delete from "/public/icons/icon-delete.svg";
import DeleteDisabled from "/public/icons/icon-delete-disabled.svg";
import Search from "/public/icons/icon-search.svg";
import Reset from "/public/icons/icon-reset.svg";
import Close from "/public/icons/icon-close.svg";
import Check from "/public/icons/icon-check.svg";
import GoTo from "/public/icons/icon-goto.svg";
import Minus from "/public/icons/icon-minus.svg";
import DownArrow from "/public/icons/icon-down-arrow.svg";
import UpArrow from "/public/icons/icon-up-arrow.svg";
import Cancel from "/public/icons/icon-cancel.svg";
import SearchSelect from "/public/icons/icon-search-select.svg";
import Date from "/public/icons/icon-date.svg";
import DownloadGreen from "/public/icons/icon-download-green.svg";
import CheckGreen from "/public/icons/correct-sign.svg";
import Hamburger from "/public/icons/icon-hamburger.svg";
import User from "/public/icons/icon-user.svg";

export const EditIcon = ({ className, onClick }: IconProps) => (
  <Edit className={className} onClick={onClick} />
);
export const EditDisabledIcon = ({ className, onClick }: IconProps) => (
  <EditDisabled className={className} onClick={onClick} />
);
export const DeleteIcon = ({ className, onClick }: IconProps) => (
  <Delete className={className} onClick={onClick} />
);
export const DeleteDisabledIcon = ({ className, onClick }: IconProps) => (
  <DeleteDisabled className={className} onClick={onClick} />
);
export const WrapIcon = ({ className, onClick }: IconProps) => (
  <Wrap className={className} onClick={onClick} />
);
export const UploadIcon = ({ className, onClick }: IconProps) => (
  <Upload className={className} onClick={onClick} />
);
export const PlusIcon = ({ className, onClick }: IconProps) => (
  <Plus className={className} onClick={onClick} />
);
export const DownloadIcon = ({ className, onClick }: IconProps) => (
  <Download className={className} onClick={onClick} />
);
export const SearchIcon = ({ className, onClick }: IconProps) => (
  <Search className={className} onClick={onClick} />
);
export const ResetIcon = ({ className, onClick }: IconProps) => (
  <Reset className={className} onClick={onClick} />
);
export const CheckIcon = ({ className, onClick }: IconProps) => (
  <Check className={className} onClick={onClick} />
);
export const CloseIcon = ({ className, onClick }: IconProps) => (
  <Close className={className} onClick={onClick} />
);
export const GoToIcon = ({ className, onClick }: IconProps) => (
  <GoTo className={className} onClick={onClick} />
);
export const MinusIcon = ({ className, onClick }: IconProps) => (
  <Minus className={className} onClick={onClick} />
);
export const DownArrowIcon = ({ className, onClick }: IconProps) => (
  <DownArrow className={className} onClick={onClick} />
);
export const UpArrowIcon = ({ className, onClick }: IconProps) => (
  <UpArrow className={className} onClick={onClick} />
);
export const CancelIcon = ({ className, onClick }: IconProps) => (
  <Cancel className={className} onClick={onClick} />
);
export const SearchSelectIcon = ({ className, onClick }: IconProps) => (
  <SearchSelect className={className} onClick={onClick} />
);
export const ClearIcon = ({ className, onClick }: IconProps) => (
  <Close className={className} onClick={onClick} />
);
export const DateIcon = ({ className, onClick }: IconProps) => (
  <Date className={className} onClick={onClick} />
);
export const DownloadIconGreen = ({ className, onClick }: IconProps) => (
  <DownloadGreen className={className} onClick={onClick} />
);
export const CheckIconGreen = ({ className, onClick }: IconProps) => (
  <CheckGreen className={className} onClick={onClick} />
);
export const HamburgerIcon = ({ className, onClick }: IconProps) => (
  <Hamburger className={className} onClick={onClick} />
);
export const UserIcon = ({ className, onClick }: IconProps) => (
  <User className={className} onClick={onClick} />
);
type IconProps = {
  className?: string;
  onClick?: (any?: any) => void;
};
