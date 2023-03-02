export function DropdownInput({
    name,
    options,
    required,
    defaultValue = undefined,
  }: {
    name: string;
    options: any[];
    required: boolean;
    defaultValue?: string | undefined;
  }) {
    return (
      <select
        name={name}
        className="border border-zinc-300 bg-transparent py-3 px-3 rounded-2xl focus:ring-0 focus:outline-none"
        required={required}
      >
        {options.map((option, index) => (
          <option
            value={option.value ? option.value : option.name.toLowerCase()}
            key={index}
          >
            {option.name}
          </option>
        ))}
      </select>
    );
  }
  