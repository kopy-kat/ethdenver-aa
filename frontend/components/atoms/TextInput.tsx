export function TextInput({
    inputType,
    placeholder,
    name,
    required,
    step
}: {
    inputType: string;
    placeholder: string;
    name: string;
    required: boolean;
    step?: number
}) {
  return (
    <input
      type={inputType}
      className="border border-zinc-300 bg-transparent py-3 px-3 rounded-2xl focus:ring-0 focus:outline-none"
      placeholder={placeholder}
      name={name}
      step={step}
      required={required}
    />
  );
}
