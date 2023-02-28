import { Button } from "../atoms/Button";

export function Stepper({
  stepperElements,
  formStep,
  setFormStep,
  submitForm,
}: {
  stepperElements: any[];
  formStep: number;
  setFormStep: any;
  submitForm: any;
}) {
  return (
    <div>
      <section>
        <div className="container mx-auto">
          <div className="flex flex-row items-center justify-between items-center border-b border-zinc-200 pb-4">
            <div className="w-1/2">
              <p className="text-zinc-500 font-semibold text-sm">
                Step {formStep + 1} of {stepperElements.length}
              </p>
              <h4 className="text-xl text-zinc-700 font-bold">
                {stepperElements[formStep]["heading"]}
              </h4>
            </div>
            <div className="w-1/4 flex flex-row items-center">
              <div className="w-full bg-zinc-200 rounded-full h-2.5">
                <div
                  className={`bg-blue-600 h-2.5 rounded-full`}
                  style={{
                    width: `${Math.round(
                      ((formStep + 1) / stepperElements.length) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <span className="ml-4">
                {Math.round(((formStep + 1) / stepperElements.length) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="mb-20">
        <form className="" onSubmit={submitForm}>
          {stepperElements.map((element: any, index: number) => (
            <div
              className={
                "flex flex-col items-center" +
                (index == formStep ? "" : " hidden")
              }
              key={index}
            >
              {element["form"]}{" "}
              <div className="flex flex-row items-center justify-between w-3/4 2xl:w-1/2 mt-6">
                <Button
                  backgroundColor="bg-blue-600"
                  textColor="text-white"
                  onClick={() => setFormStep(formStep - 1)}
                  additionalClasses={"" + (formStep == 0 ? " invisible" : "")}
                >
                  Previous
                </Button>
                <Button
                  backgroundColor="bg-blue-600"
                  textColor="text-white"
                  onClick={() => setFormStep(formStep + 1)}
                  additionalClasses={
                    "" +
                    (formStep == stepperElements.length - 1 ? " invisible" : "")
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          ))}
        </form>
      </section>
    </div>
  );
}
