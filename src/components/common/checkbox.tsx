/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Checkbox, CheckboxProps } from "@material-tailwind/react";

export function CheckboxDefault({ ...restProps }: CheckboxProps) {
  //@ts-ignore
  return <Checkbox {...restProps}/>;
}
