import { TextareaInput } from "../atoms/TextareaInput";

export function TextareaForm({
  label,
  inputName,
  placeholder,
  helpText,
  required = false,
  requiredStar = false,
}: {
  label: string;
  inputName: string;
  placeholder: string;
  helpText?: React.ReactNode;
  required?: boolean;
  requiredStar?: boolean;
}) {
  return (
    <>
      <h5 className="ml-1 mb-2">{label} {required || requiredStar ? <span className="text-orange-600">*</span>:null}</h5>
      <TextareaInput inputName={inputName} placeholder={placeholder} />
      {helpText && (
        <small className="ml-1 mt-2 text-zinc-700">{helpText}</small>
      )}
    </>
  );
}
