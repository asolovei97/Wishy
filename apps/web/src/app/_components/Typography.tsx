import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cn } from "../_lib";

const textColors = {
  "stone-800": "text-stone-800",
  "stone-900": "text-stone-900",
  white: "text-white",
} as const;

type TextColor = keyof typeof textColors;

type HeadingTags = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
type BodyTags = "p" | "i";

type TextTags = HeadingTags | BodyTags;

type BaseTextProps<T extends TextTags> = ComponentPropsWithoutRef<T> & {
  Tag: T;
  color?: TextColor;
  children?: ReactNode;
};

const BaseText = <T extends TextTags>({
  Tag,
  children,
  color = "stone-800",
  className,
  ...props
}: BaseTextProps<T>) => {
  if (!Tag) {
    return null;
  }

  const Component: ElementType = Tag;

  return (
    <Component className={cn(textColors[color], className)} {...props}>
      {children}
    </Component>
  );
};


interface HeadingProps extends Omit<
  ComponentPropsWithoutRef<HeadingTags>,
  "color"
> {
  color?: TextColor;
}

export const Heading1 = ({ children, color, ...props }: HeadingProps) => {
  return (
    <BaseText
      Tag="h1"
      color={color}
      className={"text-6xl font-semibold tracking-tight"}
      {...props}
    >
      {children}
    </BaseText>
  );
};

export const Heading2 = ({ children, color, ...props }: HeadingProps) => {
  return (
    <BaseText
      Tag="h2"
      color={color}
      className="text-5xl font-semibold tracking-tight"
      {...props}
    >
      {children}
    </BaseText>
  );
};

export const Heading3 = ({ children, color, ...props }: HeadingProps) => {
  return (
    <BaseText
      Tag="h3"
      color={color}
      className="text-4xl font-medium tracking-tight"
      {...props}
    >
      {children}
    </BaseText>
  );
};

export const Heading4 = ({ children, color, ...props }: HeadingProps) => {
  return (
    <BaseText
      Tag="h4"
      color={color}
      className="text-3xl font-medium tracking-tight"
      {...props}
    >
      {children}
    </BaseText>
  );
};

export const Heading5 = ({ children, color, ...props }: HeadingProps) => {
  return (
    <BaseText
      Tag="h5"
      className="text-2xl font-medium"
      color={color}
      {...props}
    >
      {children}
    </BaseText>
  );
};

export const Heading6 = ({ children, color, ...props }: HeadingProps) => {
  return (
    <BaseText Tag="h6" className="text-xl font-medium" color={color} {...props}>
      {children}
    </BaseText>
  );
};

interface BodyProps extends Omit<ComponentPropsWithoutRef<BodyTags>, "color"> {
  color?: TextColor;
}

export const BodyLarge = ({ children, color, ...props }: BodyProps) => {
  return (
    <BaseText
      Tag="p"
      className="text-lg leading-relaxed"
      color={color}
      {...props}
    >
      {children}
    </BaseText>
  );
};

export const BodyMedium = ({ children, color, ...props }: BodyProps) => {
  return (
    <BaseText
      Tag="p"
      className="text-base leading-relaxed"
      color={color}
      {...props}
    >
      {children}
    </BaseText>
  );
};

export const BodySmall = ({ children, color, ...props }: BodyProps) => {
  return (
    <BaseText Tag="p" className="text-sm" color={color} {...props}>
      {children}
    </BaseText>
  );
};

export const BodyExtraSmall = ({ children, color, ...props }: BodyProps) => {
  return (
    <BaseText Tag="p" className="text-xs" color={color} {...props}>
      {children}
    </BaseText>
  );
};
