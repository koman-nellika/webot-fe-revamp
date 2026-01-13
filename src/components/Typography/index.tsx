import { Typography as AntdTypography } from "antd";
import { TextProps as AntdTextProps } from "antd/lib/typography/Text";
import { TitleProps as AntdTitleProps } from "antd/lib/typography/Title";
import { LinkProps as AntdLinkProps } from "antd/lib/typography/Link";
import clsx from "clsx";
import { default as NextLink } from "next/link";
import { memo } from "react";

const VARIENTS: any = {
  ["96"]: "text-8xl",
  ["72"]: "text-7xl",
  ["60"]: "text-6xl",
  ["48"]: "text-5xl",
  ["36"]: "text-4xl",
  ["30"]: "text-3xl",
  ["24"]: "text-2xl",
  ["22"]: "text-1xl",
  ["20"]: "text-xl",
  ["18"]: "text-lg",
  ["16"]: "text-base",
  ["14"]: "text-sm",
  ["12"]: "text-xs",
};

const Title = memo(
  ({ size, weight, className, children, onClick, ...props }: TitleProps) => {
    const fontSize = size || "48";
    const fontClassName = VARIENTS[fontSize];
    const customClassName = clsx({
      [`${className}`]: className,
      [`${fontClassName}`]: fontSize,
      ["cursor-pointer is-hover"]: typeof onClick === "function",
    });

    return (
      <AntdTypography.Title
        className={customClassName}
        style={{ fontWeight: weight || 300 }}
        onClick={onClick}
        {...props}
      >
        {children}
      </AntdTypography.Title>
    );
  }
);

const Text = memo(
  ({ size, weight, className, children, onClick, ...props }: TextProps) => {
    const fontSize = size || "16";
    const fontClassName = VARIENTS[fontSize];
    const customClassName = clsx({
      [`${className}`]: className,
      [`${fontClassName}`]: fontSize,
      ["cursor-pointer is-hover"]: typeof onClick === "function",
    });

    return (
      <AntdTypography.Text
        className={customClassName}
        style={{ fontWeight: weight || 300 }}
        onClick={onClick}
        {...props}
      >
        {children}
      </AntdTypography.Text>
    );
  }
);

const Link = memo(({ className, size, weight, children, href }: LinkProps) => {
  const fontSize = size || "16";
  const fontClassName = VARIENTS[fontSize];
  const customClassName = clsx({
    [`${className}`]: className,
    [`${fontClassName}`]: fontSize,
  });

  return (
    <NextLink href={href} legacyBehavior>
      <AntdTypography.Link
        className={customClassName}
        href={href}
        style={{ fontWeight: weight || 400 }}
      >
        {children}
      </AntdTypography.Link>
    </NextLink>
  );
});

type TextProps = AntdTextProps & {
  size?:
    | "96"
    | "72"
    | "60"
    | "48"
    | "36"
    | "30"
    | "24"
    | "22"
    | "20"
    | "18"
    | "16"
    | "14"
    | "12";
  weight?: 100 | 300 | 400 | 500;
};

type TitleProps = AntdTitleProps & {
  size?:
    | "96"
    | "72"
    | "60"
    | "48"
    | "36"
    | "30"
    | "24"
    | "22"
    | "20"
    | "18"
    | "16"
    | "14"
    | "12";
  weight?: 100 | 300 | 400 | 500;
};

type LinkProps = AntdLinkProps & {
  className?: string;
  href: string;
  children: React.ReactNode;
  size?:
    | "96"
    | "72"
    | "60"
    | "48"
    | "36"
    | "30"
    | "22"
    | "24"
    | "20"
    | "18"
    | "16"
    | "14"
    | "12";
  weight?: 100 | 300 | 400 | 500;
};

const Typography = { Link, Title, Text };
Title.displayName = "Title";
Link.displayName = "Link";
Text.displayName = "Text";
export default Typography;
