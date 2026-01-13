import { Typography } from "antd";
import { default as NextLink } from "next/link";

const Link = ({ className, children, href }: LinkProps) => {
  return (
    <NextLink href={href}>
      <Typography.Link className={className} href={href}>
        {children}
      </Typography.Link>
    </NextLink>
  );
};

type LinkProps = {
  className?: string;
  href: string;
  children: React.ReactNode;
};

export default Link;
