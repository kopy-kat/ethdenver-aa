import { TextInput } from "../atoms/TextInput";

export function InputForm({
  label,
  inputType,
  placeholder,
  inputName,
  helpText,
  required = false,
  requiredStar = false,
  step = undefined
}: {
  label: string;
  inputType: string;
  placeholder: string;
  inputName: string;
  helpText?: React.ReactNode;
  required?: boolean;
  requiredStar?: boolean;
  step?: number
}) {
  return (
    <>
      <h5 className="ml-1 mb-2">{label} {required || requiredStar ? <span className="text-orange-600">*</span>:null}</h5>
      <TextInput
        inputType={inputType}
        placeholder={placeholder}
        name={inputName}
        step={step}
        required={required}
      />
      {helpText && (
        <small className="ml-1 mt-2 text-zinc-700">{helpText}</small>
      )}
    </>
  );
}
