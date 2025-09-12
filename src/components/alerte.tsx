// components/ui/Alert.tsx
'use client';

import { forwardRef, useState, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "pending"
  | "danger"
  | "dark"
  | "outline-primary"
  | "outline-secondary"
  | "outline-success"
  | "outline-warning"
  | "outline-pending"
  | "outline-danger"
  | "outline-dark"
  | "soft-primary"
  | "soft-secondary"
  | "soft-success"
  | "soft-warning"
  | "soft-pending"
  | "soft-danger"
  | "soft-dark";

export interface AlertProps {
  children: ReactNode | ((props: { dismiss: () => void }) => ReactNode);
  dismissible?: boolean;
  variant?: Variant;
  className?: string;
  onShow?: () => void;
  onShown?: () => void;
  onHide?: () => void;
  onHidden?: () => void;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ dismissible, variant, className, children, ...props }, ref) => {
    const [show, setShow] = useState<boolean>(true);

    // Main Colors
    const primary = [
      "bg-blue-500 border-blue-500 text-white",
      "dark:border-blue-500",
    ];
    const secondary = [
      "bg-gray-300 border-gray-300 text-gray-700",
      "dark:border-gray-400 dark:bg-gray-400 dark:text-gray-300",
    ];
    const success = [
      "bg-green-500 border-green-500 text-white",
      "dark:border-green-500",
    ];
    const warning = [
      "bg-yellow-500 border-yellow-500 text-white",
      "dark:border-yellow-500",
    ];
    const pending = [
      "bg-orange-500 border-orange-500 text-white",
      "dark:border-orange-500",
    ];
    const danger = [
      "bg-red-500 border-red-500 text-white",
      "dark:border-red-500",
    ];
    const dark = [
      "bg-gray-800 border-gray-800 text-white",
      "dark:bg-gray-900 dark:border-gray-900 dark:text-gray-300",
    ];

    // Outline
    const outlinePrimary = [
      "border-blue-500 text-blue-500",
      "dark:border-blue-500",
    ];
    const outlineSecondary = [
      "border-gray-300 text-gray-700",
      "dark:border-gray-400 dark:text-gray-300",
    ];
    const outlineSuccess = [
      "border-green-500 text-green-500",
      "dark:border-green-500",
    ];
    const outlineWarning = [
      "border-yellow-500 text-yellow-500",
      "dark:border-yellow-500",
    ];
    const outlinePending = [
      "border-orange-500 text-orange-500",
      "dark:border-orange-500",
    ];
    const outlineDanger = [
      "border-red-500 text-red-500",
      "dark:border-red-500",
    ];
    const outlineDark = [
      "border-gray-800 text-gray-800",
      "dark:border-gray-900 dark:text-gray-300",
    ];

    // Soft Color
    const softPrimary = [
      "bg-blue-100 border-blue-100 text-blue-800",
      "dark:bg-blue-900/30 dark:border-blue-900/30 dark:text-blue-300",
    ];
    const softSecondary = [
      "bg-gray-100 border-gray-100 text-gray-800",
      "dark:bg-gray-800/30 dark:border-gray-800/30 dark:text-gray-300",
    ];
    const softSuccess = [
      "bg-green-100 border-green-100 text-green-800",
      "dark:bg-green-900/30 dark:border-green-900/30 dark:text-green-300",
    ];
    const softWarning = [
      "bg-yellow-100 border-yellow-100 text-yellow-800",
      "dark:bg-yellow-900/30 dark:border-yellow-900/30 dark:text-yellow-300",
    ];
    const softPending = [
      "bg-orange-100 border-orange-100 text-orange-800",
      "dark:bg-orange-900/30 dark:border-orange-900/30 dark:text-orange-300",
    ];
    const softDanger = [
      "bg-red-100 border-red-100 text-red-800",
      "dark:bg-red-900/30 dark:border-red-900/30 dark:text-red-300",
    ];
    const softDark = [
      "bg-gray-200 border-gray-200 text-gray-800",
      "dark:bg-gray-800/30 dark:border-gray-800/30 dark:text-gray-300",
    ];

    if (!show) return null;

    return (
      <div
        ref={ref}
        role="alert"
        className={twMerge([
          "relative border rounded-md px-5 py-4 animate-fadeIn",
          variant === "primary" && primary,
          variant === "secondary" && secondary,
          variant === "success" && success,
          variant === "warning" && warning,
          variant === "pending" && pending,
          variant === "danger" && danger,
          variant === "dark" && dark,
          variant === "outline-primary" && outlinePrimary,
          variant === "outline-secondary" && outlineSecondary,
          variant === "outline-success" && outlineSuccess,
          variant === "outline-warning" && outlineWarning,
          variant === "outline-pending" && outlinePending,
          variant === "outline-danger" && outlineDanger,
          variant === "outline-dark" && outlineDark,
          variant === "soft-primary" && softPrimary,
          variant === "soft-secondary" && softSecondary,
          variant === "soft-success" && softSuccess,
          variant === "soft-warning" && softWarning,
          variant === "soft-pending" && softPending,
          variant === "soft-danger" && softDanger,
          variant === "soft-dark" && softDark,
          dismissible && "pr-12",
          className,
        ])}
      >
        {typeof children === "function"
          ? children({
              dismiss: () => {
                setShow(false);
              },
            })
          : children}
          
        {dismissible && (
          <button
            type="button"
            aria-label="Close"
            className="absolute right-0 top-0 m-3 text-current hover:opacity-70 transition-opacity"
            onClick={() => setShow(false)}
          >
            ×
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export default Alert;