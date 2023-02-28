import { Layout } from "@/components/templates/Layout";
import { Button } from "@/components/atoms/Button";
import { Stepper } from "@/components/organisms/Stepper";
import { useState } from "react";
import { InputForm } from "@/components/molecules/InputForm";
import { TextareaForm } from "@/components/molecules/TextareaForm";
import { DropdownForm } from "@/components/molecules/DropdownForm";
import useSWR from "swr";
import { fetcher } from "@/utils/common";
import { useEffect } from "react";
import { MultiselectForm } from "@/components/molecules/MultiselectForm";

export default function CreatePlugin() {
  const [formStep, setFormStep] = useState<number>(0);
  const [formattedChains, setFormattedChains] = useState<any>([]);
  const [formattedCategories, setFormattedCategories] = useState<any>([]);
  const [formError, setFormError] = useState<boolean>(false);
  const [creationLoading, setCreationLoading] = useState<boolean>(false);
  const [creationSuccess, setCreationSuccess] = useState<boolean>(false);
  const [creationError, setCreationError] = useState<boolean>(false);

  const { data: chains } = useSWR("/api/get-chains", fetcher);
  const { data: categories } = useSWR("/api/get-plugin-categories", fetcher);

  useEffect(() => {
    if (chains) {
      const formattedChainsReturn = chains.map((chain: any) => {
        return {
          value: chain.id,
          label: chain.name,
        };
      });
      setFormattedChains(formattedChainsReturn);
    }
  }, [chains]);

  useEffect(() => {
    if (categories) {
      const formattedCategoriessReturn = categories.map((category: any) => {
        return {
          value: category.id,
          name: category.name,
        };
      });
      setFormattedCategories(formattedCategoriessReturn);
    }
  }, [categories]);

  function verifyForm(e: any) {
    if (
      e.target.name.value &&
      e.target.oneLiner.value &&
      e.target.description.value &&
      e.target.version.value &&
      e.target.contractAddress.value &&
      e.target.pluginCategoryId.value &&
      e.target.codeName.value &&
      e.target.codeUrl.value &&
      e.target.codeVersion.value &&
      e.target.codeContent.value
    ) {
      return true;
    } else {
      return false;
    }
  }

  function resetFormMessages() {
    setFormError(false);
    setCreationSuccess(false);
    setCreationError(false);
  }

  async function createPlugin(e: any) {
    e.preventDefault();
    setCreationLoading(true);
    const chainIds = [];
    for (let i = 0; i < e.target.chains.length; i++) {
      chainIds.push(e.target.chains[i].value);
    }
    if (verifyForm(e) && chainIds.length > 0) {
      resetFormMessages();
      await fetch("/api/create-plugin", {
        method: "POST",
        body: JSON.stringify({
          name: e.target.name.value,
          oneLiner: e.target.oneLiner.value,
          description: e.target.description.value,
          version: e.target.version.value,
          icon: e.target.icon.value ? e.target.icon.value : "",
          contractAddress: e.target.contractAddress.value,
          tippingAddress: e.target.tippingAddress.value
            ? e.target.tippingAddress.value
            : "",
          pluginCategoryId: e.target.pluginCategoryId.value,
          chains: chainIds,
          codeName: e.target.codeName.value,
          codeUrl: e.target.codeUrl.value,
          codeVersion: e.target.codeVersion.value,
          codeContent: e.target.codeContent.value,
        }),
      })
        .then((res) => {
          setCreationSuccess(true);
          e.target.reset();
        })
        .catch((e) => setCreationError(true));
    } else {
      setFormError(true);
    }
    setCreationLoading(false);
  }

  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center overflow-auto">
        <h3 className="text-2xl font-semibold text-zinc-900 mb-6 mt-12">
          Create a plugin
        </h3>
        <div className="w-[40vw] mt-8">
          <Stepper
            stepperElements={[
              {
                heading: "Details",
                form: (
                  <div className="flex flex-col mt-8 w-[40vw] justify-center">
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <InputForm
                        label="Name"
                        inputType="text"
                        placeholder="Multi Factor Authentication"
                        inputName="name"
                        requiredStar
                      />
                    </div>
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <InputForm
                        label="One Liner"
                        inputType="text"
                        placeholder="This plugin allows you to secure your wallet with 2FA."
                        inputName="oneLiner"
                        requiredStar
                      />
                    </div>
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <TextareaForm
                        label="Description"
                        placeholder="A detailed description of the plugin."
                        inputName="description"
                        requiredStar
                      />
                    </div>
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <InputForm
                        label="Version"
                        inputType="text"
                        placeholder="0.0.1"
                        inputName="version"
                        requiredStar
                      />
                    </div>
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <InputForm
                        label="Icon URL"
                        inputType="text"
                        placeholder="0.0.1"
                        inputName="icon"
                      />
                    </div>
                  </div>
                ),
              },
              {
                heading: "Plugin Code",
                form: (
                  <div className="flex flex-col mt-8 w-[40vw] justify-center">
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <InputForm
                        label="Contract Name"
                        inputType="text"
                        placeholder="MFA.sol"
                        inputName="codeName"
                        requiredStar
                      />
                    </div>
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <InputForm
                        label="Code URL"
                        inputType="text"
                        placeholder="URL to a repository containing the plugin code."
                        inputName="codeUrl"
                        requiredStar
                      />
                    </div>
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <TextareaForm
                        label="Code"
                        placeholder="// SPDX-License-Identifier: GPL-3.0
                        pragma solidity ^0.8.12;
                        
                        contract MFAPlugin {...}"
                        inputName="codeContent"
                        requiredStar
                      />
                    </div>
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <InputForm
                        label="Code Version"
                        inputType="text"
                        placeholder="0.0.1"
                        inputName="codeVersion"
                        requiredStar
                      />
                    </div>
                  </div>
                ),
              },
              {
                heading: "Plugin Metadata",
                form: (
                  <div className="flex flex-col mt-8 w-[40vw] justify-center">
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <InputForm
                        label="Deployed Contract Address"
                        inputType="text"
                        placeholder="0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
                        inputName="contractAddress"
                        requiredStar
                      />
                    </div>
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <InputForm
                        label="Tipping Address"
                        inputType="text"
                        placeholder="An optional address to receive tips for the plugin."
                        inputName="tippingAddress"
                      />
                    </div>
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <DropdownForm
                        label="Plugin Category"
                        options={formattedCategories}
                        inputName="pluginCategoryId"
                        requiredStar
                      />
                    </div>
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <MultiselectForm
                        label="Deployed Chain(s)"
                        options={formattedChains}
                        inputName="chains"
                        requiredStar
                      />
                    </div>
                    <div className="flex flex-col my-4 w-3/4 mx-auto">
                      <Button
                        type="submit"
                        onClick={() => {}}
                        backgroundColor="bg-purple-600"
                        textColor="text-white"
                        additionalClasses="px-4 py-1"
                        loading={creationLoading}
                      >
                        Create plugin
                      </Button>
                      {formError && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                          Please fill in all required fields
                        </p>
                      )}
                      {creationError && (
                        <p className="text-red-500 text-sm mt-2 text-center">
                          Error creating plugin
                        </p>
                      )}
                      {creationSuccess && (
                        <p className="text-green-600 text-sm mt-2 text-center">
                          Plugin created successfully
                        </p>
                      )}
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
