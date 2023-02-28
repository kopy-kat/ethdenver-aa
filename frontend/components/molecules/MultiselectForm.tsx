import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const customStyles = {
  control: (styles: any) => ({
    ...styles,
    borderRadius: "16px",
    paddingTop: "0.4rem",
    paddingBottom: "0.4rem",
    paddingLeft: "0.4rem",
    paddingRight: "0.4rem",
    borderWidth: "1px",
    borderColor: "rgb(212 212 216)",
  }),
  multiValue: (styles: any) => ({
    ...styles,
    borderRadius: "16px",
  }),
};

export function MultiselectForm({
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
      <Select
        defaultValue={[]}
        isMulti
        name={inputName}
        options={options}
        // className="border border-zinc-300 bg-transparent py-3 px-3 rounded-2xl focus:ring-0 focus:outline-none"
        // styles={{ width: "100%"}}
        components={animatedComponents}
        styles={customStyles}
      />
      {helpText && (
        <small className="ml-1 mt-2 text-zinc-700">{helpText}</small>
      )}
    </>
  );
}
