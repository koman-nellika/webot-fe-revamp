import React, { memo } from "react";
import Image, { ImageProps } from "next/image";

const basePath = process.env.NEXT_PUBLIC_PREFIX;

const Images = ({ ...props }: ImageProps) => {
  const src: any = props.src;
  const url = src?.startsWith("/") ? `${basePath || ""}${src}` : src;
  return <Image {...props} src={url} alt={props.alt}></Image>;
};

export default memo(Images);
