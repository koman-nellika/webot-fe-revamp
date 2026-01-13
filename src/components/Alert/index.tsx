import { notification } from "antd";

import CloseIcon from "/public/icons/icon-close.svg";
import CheckIcon from "/public/icons/icon-check.svg";
import InfoIcon from "/public/icons/icon-info.svg";
import WarningIcon from "/public/icons/icon-warning.svg";
import { ArgsProps } from "antd/es/notification/interface";

const success = ({ ...props }: ArgsProps) => {
  return notification.success({
    icon: <CheckIcon />,
    closeIcon: <CloseIcon />,
    placement: props.placement || "bottomRight",
    ...props,
  });
};

const error = ({ ...props }: ArgsProps) => {
  return notification.error({
    icon: <InfoIcon />,
    closeIcon: <CloseIcon />,
    placement: props.placement || "bottomRight",
    ...props,
  });
};

const warning = ({ ...props }: ArgsProps) => {
  return notification.warning({
    icon: <WarningIcon />,
    closeIcon: <CloseIcon />,
    placement: props.placement || "bottomRight",
    ...props,
  });
};

const info = ({ ...props }: ArgsProps) => {
  return notification.info({
    icon: <InfoIcon />,
    closeIcon: <CloseIcon />,
    placement: props.placement || "bottomRight",
    ...props,
  });
};

const Alert = { success, warning, error, info };

export default Alert;
