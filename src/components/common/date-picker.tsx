/* eslint-disable @typescript-eslint/no-explicit-any */
import { DateRangePicker, DateRangePickerProps } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

type DatePickerDefaultProps = DateRangePickerProps & {
  caretAs?: any;
};

export function DatePickerDefault({ ...rest }: DatePickerDefaultProps) {
  return <DateRangePicker {...rest} />;
}
