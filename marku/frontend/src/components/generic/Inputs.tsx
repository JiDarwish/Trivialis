/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input, DatePicker } from "antd";
import type { FC } from "react";
import { Controller, type FieldError } from "react-hook-form";
import dayjs, { type Dayjs } from "dayjs";
import { type RangePickerProps } from "antd/es/date-picker";
const { RangePicker } = DatePicker;

type InputFieldProps = {
  fieldName: string,
  control: any;
  error: FieldError | undefined | any;
  type?: string;
  placeholder?: string;
};

const TextInputField: FC<InputFieldProps> = ({ fieldName, control, error, placeholder, type = "text" }) => {
  return (
    <>
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type={type}
            placeholder={placeholder}
            className="w-full"
            size="large"
          />
        )}
      />
      {error && <div className="text-sm text-red-500">{error.message}</div>}
    </>
  );
};


// eslint-disable-next-line arrow-body-style
const disabledDate: RangePickerProps['disabledDate'] = (current: Dayjs) => {
  // Can not select days before today and today
  return current && current < dayjs().endOf('day');
};

const DateRangePicker: FC<InputFieldProps> = ({ fieldName, control, error }) => {
  // TODO style this for the phone
  return (
    <>
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <RangePicker
            format="MM/DD/YYYY"
            disabledDate={disabledDate}
            onChange={(dates) => {
              // Convert the moment objects to Date objects
              const selectedDates = dates?.map((date) =>
                date ? new Date(date.format("YYYY-MM-DD")) : null
              );
              // Update the value of the Controller to be an array of Date objects
              field.onChange(selectedDates);
            }}
          />
        )}
      />
      {error && <div className="text-sm text-red-500">{error.message}</div>}
    </>
  );
};


export { TextInputField, DateRangePicker };
