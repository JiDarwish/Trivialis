import { Input } from "antd";
import { FC } from "react";
import { Controller, FieldError } from "react-hook-form";

const { TextArea } = Input;

type InputFieldProps = {
  fieldName: string,
  control: any;
  error: FieldError | undefined | any;
  type?: string;
  placeholder?: string;
};


export const TextInputField: FC<InputFieldProps> = ({ fieldName, control, error, placeholder, type = "text" }) => {
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

type TextAreaFieldProps = {
  fieldName: string;
  control: any;
  error: FieldError | undefined | any;
  placeholder?: string;
  rows?: number;
};

export const TextAreaField: FC<TextAreaFieldProps> = ({
  fieldName,
  control,
  error,
  placeholder,
  rows = 4,
}) => {
  return (
    <>
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => (
          <TextArea
            {...field}
            placeholder={placeholder}
            className="w-full"
            size="large"
            rows={rows}
          />
        )}
      />
      {error && <div className="text-sm text-red-500">{error.message}</div>}
    </>
  );
};


