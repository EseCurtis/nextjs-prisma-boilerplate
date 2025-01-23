/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Input, InputProps } from "@material-tailwind/react";

type InputDefaultProps = InputProps & {};

export function InputDefault({ ...rest }: InputDefaultProps) {
  return (
    //@ts-ignore
    <Input {...rest} />
  );
}
