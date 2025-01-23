/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Button, ButtonProps, Spinner } from "@material-tailwind/react";
import { ReactNode } from "react";

type ButtonDefaultProps = ButtonProps & {
  children: ReactNode;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
  [key: string]: any; // Add this line to allow rest props
};

export function ButtonDefault({
  children,
  icon,
  loading = false,
  disabled = false,
  onClick,
  type,
  ...rest // Add this line to capture rest props
}: ButtonDefaultProps) {
  return (
    //@ts-ignore
    <Button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center py-4 w-full rounded-lg"
      placeholder=""
      variant="filled"
      type={type}
      {...rest} // Spread rest props here
    >
      <div className="flex items-center w-full">
        <div className="mx-auto">{children}</div>
        {loading ? (
          //@ts-ignore
          <Spinner className="w-4 h-4" />
        ) : (
          icon
        )}
      </div>
    </Button>
  );
}
