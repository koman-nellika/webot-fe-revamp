import type { ThemeConfig } from "antd";

const PRIMARY_COLOR = "#de8cff"; /* สีที่ต้องการเปลี่ยน */
const TEXT_COLOR = "#39464e";/* สีดำ */
const DISABLED_COLOR = "#bdb0b0"; /* สีเทา */

const theme: ThemeConfig = {
  hashed: false,
  token: {
    fontSize: 16,
    fontFamily: `DB Helvethaica X, sans-serif`,
    colorPrimary: PRIMARY_COLOR,
    colorLink: PRIMARY_COLOR,
    colorSuccess: PRIMARY_COLOR,
    colorText: TEXT_COLOR,
    colorTextPlaceholder: DISABLED_COLOR,
  },
  components: {
    Button: {
      fontWeight: 500,
      fontSize: 22,
      fontSizeLG: 22,
      borderRadius: 3,
      borderRadiusLG: 3,
      defaultColor: PRIMARY_COLOR,
      defaultBorderColor: PRIMARY_COLOR,
      colorTextDisabled: DISABLED_COLOR,
      borderColorDisabled: DISABLED_COLOR,
      colorBgContainerDisabled: "#fff",
    },
    Menu: {
      fontSize: 24,
      itemHeight: 50,
      iconMarginInlineEnd: 25,
      itemBg: "#fff",
      itemHoverBg: "#fff",
    },
    Layout: {
      bodyBg: "#f7f7f8",
    },
    Card: {
      borderRadius: 5,
    },
    Form: {
      labelFontSize: 22,
      labelHeight: 40,
      labelColor: TEXT_COLOR,
      verticalLabelPadding: 1,
      itemMarginBottom: 0,
    },
    Input: {
      borderRadius: 3,
      borderRadiusLG: 3,
      paddingInline: 0,
    },
    Select: {
      singleItemHeightLG: 40,
      borderRadius: 2,
      borderRadiusLG: 2,
      colorTextPlaceholder: TEXT_COLOR,
      fontSize: 20,
      controlHeight: 38,
    },
    Table: {
      headerBg: "#f4efee",
      fontSize: 20,
    },
    Avatar: {
      fontSize: 30,
    },
  },
};

export default theme;
