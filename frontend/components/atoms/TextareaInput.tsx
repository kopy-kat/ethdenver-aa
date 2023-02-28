export function TextareaInput({
    inputName,
    placeholder,
  }: {
    inputName: string;
    placeholder: string;
  }) {
    return (
      <textarea
        name={inputName}
        className="border border-zinc-300 bg-transparent py-3 px-3 rounded-2xl focus:ring-0 focus:outline-none"
        placeholder={placeholder}
      />
    );
  }
  