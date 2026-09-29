import React, { Children, isValidElement, cloneElement } from "react";
import { cn } from "@/lib/utils";

export interface ScrollStackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  key?: React.Key;
  itemDistance?: number; // Distance in px between stacked tops
  offset?: number; // Top offset in px (to clear navbar)
  itemScale?: number; // Progressive scale reduction
}

export interface ScrollStackItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  key?: React.Key;
  index?: number;
  total?: number;
  topOffset?: number;
}

export function ScrollStackItem({
  children,
  className,
  index = 0,
  topOffset = 96,
  style,
  ...props
}: ScrollStackItemProps) {
  return (
    <div
      className={cn(
        "sticky transition-all duration-300 w-full mb-12 last:mb-0",
        className
      )}
      style={{
        top: `${topOffset}px`,
        zIndex: index + 10,
        ...style,
      }}
      {...props}
    >
      <div className="w-full bg-surface border border-border-subtle shadow-xl hover:border-primary/60 transition-colors rounded-2xl md:rounded-3xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function ScrollStack({
  children,
  className,
  itemDistance = 24,
  offset = 96,
  style,
  ...props
}: ScrollStackProps) {
  const validChildren = Children.toArray(children).filter(isValidElement);
  const total = validChildren.length;

  return (
    <div
      className={cn("relative w-full flex flex-col pb-16", className)}
      style={style}
      {...props}
    >
      {validChildren.map((child, index) => {
        const topOffset = offset + index * itemDistance;
        return cloneElement(child as React.ReactElement<ScrollStackItemProps>, {
          index,
          total,
          topOffset,
          key: child.key || index,
        });
      })}
    </div>
  );
}

export default ScrollStack;
