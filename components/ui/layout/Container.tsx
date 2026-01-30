import React from "react";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

export default function Container({
  children,
  className = "",
  as,
}: ContainerProps) {
  const Component = (as ?? "div") as any;

  return (
    <Component className={`mx-auto w-full max-w-7xl px-6 ${className}`.trim()}>
      {children}
    </Component>
  );
}
