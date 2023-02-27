import { Layout } from "@/components/templates/Layout";
import { Button } from "@/components/atoms/Button";
import { Stepper } from "@/components/organisms/Stepper";
import { useState } from "react";
import { FormInput } from "@/components/molecules/FormInput";

export default function CreatePlugin() {
  const [formStep, setFormStep] = useState<number>(0);
  function createPlugin(e: any) {
    e.preventDefault();
    console.log("create plugin");
  }
  return (
    <Layout>
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <h3 className="text-2xl font-semibold text-zinc-900 mb-6">
          Create a plugin
        </h3>
        <div className="w-[40vw] mt-8">
          <Stepper
            stepperElements={[
              {
                heading: "Plugin Details",
                form: (
                  <div className="flex flex-col mt-8 w-[40vw] justify-center">
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <FormInput
                        label="Name"
                        inputType="text"
                        placeholder="Plugin Name"
                        inputName="interactionName"
                        requiredStar
                      />
                    </div>
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <FormInput
                        label="Name"
                        inputType="text"
                        placeholder="Blah"
                        inputName="interactionName"
                        requiredStar
                      />
                    </div>
                  </div>
                ),
              },
              {
                heading: "Plugin Details",
                form: (
                  <div className="flex flex-col mt-8 w-[40vw] justify-center">
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <Button
                        type="submit"
                        onClick={() => {}}
                        backgroundColor="bg-purple-600"
                        textColor="text-white"
                        additionalClasses="px-4 py-1"
                      >
                        Create plugin
                      </Button>
                    </div>
                  </div>
                ),
              },
            ]}
            formStep={formStep}
            setFormStep={setFormStep}
            submitForm={createPlugin}
          />
        </div>
      </div>
    </Layout>
  );
}
