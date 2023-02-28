import { DropdownInput } from "../atoms/DropdownInput";

export function DropdownForm({
  label,
  options,
  inputName,
  helpText,
  required = false,
  requiredStar = false,
}: {
  label: string;
  inputName: string;
  options: any;
  helpText?: React.ReactNode;
  required?: boolean;
  requiredStar?: boolean;
}) {
  return (
    <>
      <h5 className="ml-1 mb-2">
        {label}{" "}
        {required || requiredStar ? (
          <span className="text-orange-600">*</span>
        ) : null}
      </h5>
      <DropdownInput name={inputName} options={options} required={required} />
      {helpText && (
        <small className="ml-1 mt-2 text-zinc-700">{helpText}</small>
      )}
    </>
  );
}
