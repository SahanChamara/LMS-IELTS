import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

const Card = ({
  title,
  content,
  footer,
  className = "",
  children,
  variant,
  animate = true,
}) => {
  const baseClasses = clsx(
    "rounded-2xl  w-full shadow-sm transition-all duration-300 ease-in-out",
    "bg-white text-gray-800 ", // Light mode focused
    {
      "h-96": variant === "institution",
    },
    className
  );

  const MotionWrapper = animate ? motion.div : "div";

  return (
    <MotionWrapper
      className={baseClasses}
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={animate ? { opacity: 1, y: 0 } : false}
      transition={animate ? { duration: 0.4 } : undefined}
    >
      {children ? (
        children
      ) : (
        <div className="p-6 space-y-4">
          {title && (
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          )}
          {content && (
            <p className="text-sm leading-relaxed text-gray-700">{content}</p>
          )}
          {footer && (
            <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
              {footer}
            </div>
          )}
        </div>
      )}
    </MotionWrapper>
  );
};

export const CardContent = ({ className, children }) => (
  <div className={clsx("p-4 md:p-6", className)}>{children}</div>
);

export default Card;
