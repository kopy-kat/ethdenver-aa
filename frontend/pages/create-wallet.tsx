import { Button } from "@/components/atoms/Button";
import { Layout } from "@/components/templates/Layout";
// import { plugins, pluginCategories } from "@/data/plugins";
import {
  DragDropContext,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useState, useEffect } from "react";
import { GenericModal } from "@/components/atoms/GenericModal";
import useSWR from "swr";
import { fetcher, formatAddress } from "@/utils/common";
import { InputForm } from "@/components/molecules/InputForm";
import { TextareaForm } from "@/components/molecules/TextareaForm";
import { DropdownForm } from "@/components/molecules/DropdownForm";
import { MultiselectForm } from "@/components/molecules/MultiselectForm";
import { AnimatePresence, motion } from "framer-motion";
import { MdOutlineContentCopy } from "react-icons/md";
import { AiOutlineCheck } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { PluginItem } from "@/components/molecules/PluginItem";
import { ethers } from "ethers";

export default function CreateWallet() {
  const [availablePlugins, setAvailablePlugins] = useState<any[]>([]);
  const [selectedPlugins, setSelectedPlugins] = useState<any[]>([]);
  const [loadingComplete, setLoadingComplete] = useState<boolean>(false);
  const [categoryConfigs, setCategoryConfigs] = useState<any>({});
  const [creatingWallet, setCreatingWallet] = useState<boolean>(false);
  const [walletCreated, setWalletCreated] = useState<boolean>(false);
  const [createdWalletAddress, setCreatedWalletAddress] = useState<string>("");
  const [createdWalletCopied, setCreatedWalletCopied] =
    useState<boolean>(false);

  const { data: categories } = useSWR("/api/get-plugin-categories", fetcher);
  const { data: plugins } = useSWR("/api/get-plugins", fetcher);
  const { data: session } = useSession();

  // MODALS
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [detailModalPlugin, setDetailModalPlugin] = useState<any>({});
  const [activeDetailTab, setActiveDetailTab] = useState<string>("description");

  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [configModalPlugin, setConfigModalPlugin] = useState<any>({});
  const [configMissing, setConfigMissing] = useState<boolean>(false);
  const [pluginsMissing, setPluginsMissing] = useState<boolean>(false);

  function openDetailModal(plugin: any) {
    setDetailModalPlugin(plugin);
    setShowDetailModal(true);
  }

  function openConfigModal(plugin: any, e: any) {
    e.stopPropagation();
    setConfigModalPlugin(plugin);
    setShowConfigModal(true);
  }

  useEffect(() => {
    if (plugins) {
      setAvailablePlugins(plugins);
      setLoadingComplete(true);
    }
  }, [plugins]);

  function removeSelectedPlugin(id: number, e: any) {
    e.stopPropagation();
    let index = selectedPlugins.findIndex((plugin) => plugin.id === id);
    let add = selectedPlugins[index];
    selectedPlugins.splice(index, 1);
    availablePlugins.push(add);
    const newSelectedPlugins = [...selectedPlugins];
    setAvailablePlugins(availablePlugins);
    setSelectedPlugins(newSelectedPlugins);
  }

  const onDragEndHandler = (result: DropResult) => {
    const { destination, source } = result;
    console.log(destination, source);

    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    )
      return;

    let add = availablePlugins[source.index];
    availablePlugins.splice(source.index, 1);

    if (add) {
      selectedPlugins.splice(destination.index, 0, add);
    }

    setAvailablePlugins(availablePlugins);
    setSelectedPlugins(selectedPlugins);
  };

  function saveConfig(form: any, plugin: any) {
    form.preventDefault();
    const modCategoryConfigs = { ...categoryConfigs };
    modCategoryConfigs[plugin.id] = {};
    for (let i = 0; i < form.target.length; i++) {
      if (form.target[i].name) {
        const id = plugin.requirements.find(
          (req: any) =>
            req.name.replace(/\s+/g, "-").toLowerCase() === form.target[i].name
        ).id;
        modCategoryConfigs[plugin.id][id] = form.target[i].value;
      }
    }
    setCategoryConfigs(modCategoryConfigs);
    setShowConfigModal(false);
  }

  async function createContractAddress() {
    const wallet = ethers.Wallet.createRandom()
    return wallet.address;
  }

  function createImplementedPluginArray(smartWalletAddress: string) {
    const implementedPlugins: any = [];
    for (let i = 0; i < selectedPlugins.length; i++) {
      const config = categoryConfigs[selectedPlugins[i].id];
      const implementedPlugin = {
        pluginId: parseInt(selectedPlugins[i].id),
        config: config,
        smartWalletAddress: smartWalletAddress,
      };
      implementedPlugins.push(implementedPlugin);
    }
    return implementedPlugins;
  }

  function resetErrors() {
    setConfigMissing(false);
    setPluginsMissing(false);
  }

  async function createWallet() {
    if (!session) return;
    if (!session.user) return;
    resetErrors();
    if (selectedPlugins.length === 0) {
      setPluginsMissing(true);
      return;
    }
    const requiredConfigNumber = selectedPlugins.reduce(
      (acc: number, plugin: any) => acc + plugin.requirements.length,
      0
    );
    const configNumber = Object.keys(categoryConfigs).reduce(
      (acc: number, key: string) =>
        acc + Object.keys(categoryConfigs[key]).length,
      0
    );
    if (requiredConfigNumber !== configNumber) {
      setConfigMissing(true);
      return;
    }
    setCreatingWallet(true);
    const contractAddress = await createContractAddress();
    setCreatedWalletAddress(contractAddress);
    const implementedPlugins = createImplementedPluginArray(contractAddress);
    await fetch("/api/create-wallet", {
      method: "POST",
      body: JSON.stringify({
        address: contractAddress,
        userEmail: session.user.email,
        plugins: implementedPlugins,
      }),
    });
    setWalletCreated(true);
    setCreatingWallet(false);
  }

  function copyAddress() {
    navigator.clipboard.writeText(createdWalletAddress);
    setCreatedWalletCopied(true);
    setTimeout(() => setCreatedWalletCopied(false), 5000);
  }

  return (
    <Layout
      outsideOfBoxChildren={
        <>
          <Button
            onClick={createWallet}
            backgroundColor={"bg-blue-600"}
            textColor={"text-zinc-100"}
            additionalClasses="px-6 py-1 mt-8 mx-auto w-1/4"
            loading={creatingWallet}
          >
            create wallet
          </Button>
          {configMissing && (
            <p className="text-red-600 text-center font-semibold text-sm mt-2">
              finish configuring plugins
            </p>
          )}
          {pluginsMissing && (
            <p className="text-red-600 text-center font-semibold text-sm mt-2">
              no plugins selected
            </p>
          )}
        </>
      }
    >
      <div className="flex flex-row">
        <DragDropContext onDragEnd={onDragEndHandler}>
          <section className="w-1/2 px-6 py-8 border-r border-zinc-200">
            <div className="flex flex-col justify-start">
              <h4 className="text-2xl font-semibold">plugins</h4>
              {loadingComplete ? (
                <Droppable droppableId="Plugins">
                  {(droppableProvided, droppableSnapshot) => (
                    <div
                      className="flex flex-col mt-6 h-[60vh] overflow-auto scrollbar-hide px-4"
                      ref={droppableProvided.innerRef}
                      {...droppableProvided.droppableProps}
                    >
                      {categories !== undefined
                        ? categories.map((pluginCategory: any) => (
                            <>
                              <h4 className="font-semibold text-base mb-2 mt-2 ml-1 lowercase">
                                {pluginCategory.name}
                              </h4>
                              {availablePlugins.some(
                                (plugin) =>
                                  plugin.pluginCategoryId == pluginCategory.id
                              ) ? (
                                availablePlugins.map(
                                  (plugin: any, index: number) =>
                                    pluginCategory.id ===
                                      plugin.pluginCategoryId && (
                                      <PluginItem
                                        index={index}
                                        plugin={plugin}
                                        pluginCategory={pluginCategory}
                                        showDetailModal={() =>
                                          openDetailModal(plugin)
                                        }
                                        selected={false}
                                        key={index}
                                      />
                                    )
                                )
                              ) : (
                                <div className="flex flex-row justify-between items-center border border-dashed border-zinc-300 rounded-2xl px-4 py-5 my-2 font-semibold text-zinc-500">
                                  no more {pluginCategory.name.toLowerCase()}{" "}
                                  plugins
                                </div>
                              )}
                            </>
                          ))
                        : null}
                      {droppableProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              ) : (
                <div className="flex flex-col mt-6 h-[60vh] overflow-auto scrollbar-hide px-4">
                  {[0, 0].map((el) => (
                    <>
                      <h4 className="font-semibold text-base mb-2 mt-2 ml-1 bg-zinc-200 text-zinc-200 rounded-2xl animate-pulse w-fit select-none">
                        Placeholder
                      </h4>
                      {[0, 0].map((el: any, index: number) => (
                        <div
                          className={`flex flex-row justify-between items-center rounded-2xl px-4 py-3 my-2 hover:cursor-pointer hover:scale-105 transition duration-300 bg-zinc-100 select-none border border-zinc-200`}
                          key={index}
                        >
                          <div className="flex flex-row items-center">
                            <div className="w-10 h-10 rounded-full bg-zinc-200 animate-pulse mr-1 p-1" />
                            <div className="flex flex-col">
                              <div className="text-lg font-semibold bg-zinc-200 text-zinc-200 rounded-2xl animate-pulse mb-3">
                                Placeholder
                              </div>
                              <p className="mb-1 -mt-1 font-semibold bg-zinc-200 text-zinc-200 rounded-2xl animate-pulse mb-2">
                                Placeholder | 3332 installs | Placeholder | 23
                                Verified Audits
                              </p>
                              <div
                                className={`bg-zinc-200 text-zinc-200 rounded-2xl animate-pulse text-sm mb-1`}
                              >
                                This is the placeholder one liner
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ))}
                </div>
              )}
            </div>
          </section>
          <section className="w-1/2 px-6 py-8">
            <div className="flex flex-col">
              <h4 className="text-2xl font-semibold">wallet</h4>
              {loadingComplete ? (
                <Droppable droppableId="Selected">
                  {(droppableProvided, droppableSnapshot) => (
                    <div
                      className="flex flex-col mt-6 h-[60vh] overflow-auto scrollbar-hide px-4"
                      ref={droppableProvided.innerRef}
                      {...droppableProvided.droppableProps}
                    >
                      {categories != undefined
                        ? categories?.map((pluginCategory: any) => (
                            <>
                              <h4 className="font-semibold text-base mb-2 mt-2 ml-1 lowercase">
                                {pluginCategory.name}
                              </h4>
                              {selectedPlugins.some(
                                (plugin) =>
                                  plugin.pluginCategoryId == pluginCategory.id
                              ) ? (
                                selectedPlugins.map(
                                  (plugin: any, index: any) =>
                                    pluginCategory.id ===
                                      plugin.pluginCategoryId && (
                                      <PluginItem
                                        index={index}
                                        key={index}
                                        plugin={plugin}
                                        pluginCategory={pluginCategory}
                                        showDetailModal={(e: any) =>
                                          openDetailModal(plugin)
                                        }
                                        openConfigModal={(e: any) =>
                                          openConfigModal(plugin, e)
                                        }
                                        removeSelectedPlugin={
                                          removeSelectedPlugin
                                        }
                                        selected={true}
                                      />
                                    )
                                )
                              ) : (
                                <div className="flex flex-row justify-between items-center border border-dashed border-zinc-300 rounded-2xl px-4 py-5 my-2 font-semibold text-zinc-500">
                                  no {pluginCategory.name.toLowerCase()} plugin
                                  yet
                                </div>
                              )}
                            </>
                          ))
                        : null}
                      {droppableProvided.placeholder}
                    </div>
                  )}
                </Droppable>
              ) : (
                <div className="flex flex-col mt-6 h-[60vh] overflow-auto scrollbar-hide px-4">
                  {[0, 0].map((el) => (
                    <>
                      <h4 className="font-semibold text-base mb-2 mt-2 ml-1 bg-zinc-200 text-zinc-200 rounded-2xl animate-pulse w-fit select-none">
                        Placeholder
                      </h4>
                      {[0, 0].map((el: any, index: number) => (
                        <div
                          className={`flex flex-row justify-between items-center rounded-2xl px-4 py-3 my-2 hover:cursor-pointer hover:scale-105 transition duration-300 bg-zinc-100 select-none border border-zinc-200`}
                          key={index}
                        >
                          <div className="flex flex-row items-center">
                            <div className="w-10 h-10 rounded-full bg-zinc-200 animate-pulse mr-1 p-1" />
                            <div className="flex flex-col">
                              <div className="text-lg font-semibold bg-zinc-200 text-zinc-200 rounded-2xl animate-pulse mb-3">
                                Placeholder
                              </div>
                              <p className="mb-1 -mt-1 font-semibold bg-zinc-200 text-zinc-200 rounded-2xl animate-pulse mb-2">
                                Placeholder | 3332 installs | Placeholder | 23
                                Verified Audits
                              </p>
                              <div
                                className={`bg-zinc-200 text-zinc-200 rounded-2xl animate-pulse text-sm mb-1`}
                              >
                                This is the placeholder one liner
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  ))}
                </div>
              )}
            </div>
          </section>
        </DragDropContext>
      </div>

      {/* PLUGIN DETAIL MODAL */}
      {showDetailModal && (
        <GenericModal
          title={"detail"}
          closeModal={() => setShowDetailModal(false)}
        >
          <div className="px-12 pb-8 max-w-[50vw] max-h-[82vh] overflow-auto scrollbar-hide">
            <div className="mb-4">
              <h3 className="font-bold text-4xl lowercase">{detailModalPlugin.name}</h3>
              <p className="mt-2 text-lg font-semibold lowercase">
                {detailModalPlugin.creator} |{" "}
                {detailModalPlugin.usage.toLocaleString()} installs |{" "}
                {[...Array(detailModalPlugin.rating)].map(
                  (rating: any, index: number) => (
                    <span key={index}>⭐️</span>
                  )
                )}{" "}
                {detailModalPlugin.ratingAmount != 0
                  ? "(" + detailModalPlugin.ratingAmount + ") |"
                  : null}{" "}
                {detailModalPlugin.audits} verified audits
              </p>
            </div>
            <div className="flex flex-row pt-2">
              <div
                className={
                  "rounded-2xl px-4 py-1 mr-2 hover:cursor-pointer font-semibold text-sm" +
                  (activeDetailTab == "description"
                    ? " bg-zinc-800 text-zinc-200"
                    : " bg-zinc-200 text-zinc-800")
                }
                onClick={() => setActiveDetailTab("description")}
              >
                description
              </div>
              <div
                className={
                  "rounded-2xl px-4 py-1 mr-2 hover:cursor-pointer font-semibold text-sm" +
                  (activeDetailTab == "rating"
                    ? " bg-zinc-800 text-zinc-200"
                    : " bg-zinc-200 text-zinc-800")
                }
                onClick={() => setActiveDetailTab("rating")}
              >
                rating & review
              </div>
              <div
                className={
                  "rounded-2xl px-4 py-1 hover:cursor-pointer font-semibold text-sm" +
                  (activeDetailTab == "code"
                    ? " bg-zinc-800 text-zinc-200"
                    : " bg-zinc-200 text-zinc-800")
                }
                onClick={() => setActiveDetailTab("code")}
              >
                code
              </div>
            </div>
            <div className="">
              {/* {activeDetailTab == "description" &&
                detailModalPlugin.description.map((desc: string) => (
                  <p className="text-lg my-6">{desc}</p>
                ))} */}
              {activeDetailTab == "description" && (
                <p className="text-lg my-6 lowercase">{detailModalPlugin.description}</p>
              )}
              {activeDetailTab == "rating" &&
                (detailModalPlugin.reviews?.length ? (
                  detailModalPlugin.reviews.map(
                    (review: any, index: number) => (
                      <div
                        className="my-6 border border-zinc-200 py-2 px-4 rounded-2xl"
                        key={index}
                      >
                        <div className="flex flex-col">
                          <div className="font-semibold lowercase">{review.reviewer}</div>
                          <div className="mb-2 lowercase">
                            {[...Array(review.rating)].map(
                              (rating: any, index: number) => (
                                <span key={index}>⭐️</span>
                              )
                            )}
                          </div>
                        </div>
                        <p className="text-lg lowercase">{review.text}</p>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-center text-lg text-zinc-300 font-bold mt-6">
                    no reviews yet
                  </p>
                ))}
              {activeDetailTab == "code" &&
                detailModalPlugin.code.map((code: any, index: number) => (
                  <div className="" key={index}>
                    <p className="text-lg mt-6 font-bold mb-4">{code.name}</p>
                    <div className="bg-black text-white rounded-2xl p-6 prose render-with-whitespace">
                      {code.content}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </GenericModal>
      )}

      {/* PLUGIN CONFIG MODAL */}
      {showConfigModal && (
        <GenericModal
          title="finish configuring plugin"
          closeModal={() => setShowConfigModal(false)}
        >
          <form
            className="flex flex-col justify-center items-center mt-4 mb-8"
            onSubmit={(e: any) => saveConfig(e, configModalPlugin)}
          >
            {configModalPlugin.requirements.map(
              (config: any, index: number) => (
                <div className="mx-auto w-1/2 flex flex-col my-2" key={index}>
                  {config.type == "string" && (
                    <InputForm
                      label={config.name.toLowerCase()}
                      inputType="text"
                      placeholder={config.placeholder}
                      inputName={config.name.replace(/\s+/g, "-").toLowerCase()}
                      defaultValue={
                        categoryConfigs[configModalPlugin.id] &&
                        categoryConfigs[configModalPlugin.id][config.id]
                          ? categoryConfigs[configModalPlugin.id][config.id]
                          : undefined
                      }
                      requiredStar
                    />
                  )}
                </div>
              )
            )}
            <Button
              onClick={() => {}}
              backgroundColor={"bg-blue-600"}
              textColor={"text-zinc-100"}
              additionalClasses="px-6 py-1 mt-4"
              type="submit"
            >
              save
            </Button>
          </form>
        </GenericModal>
      )}

      {/* WALLET CREATED SUCCESS MODAL */}
      {walletCreated && (
        <GenericModal title="" closeModal={() => setWalletCreated(false)}>
          <div className="px-12 pt-2 pb-4 max-w-[30vw]">
            <div className="text-black p-6">
              <AnimatePresence initial={true}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={5}
                  stroke="currentColor"
                  className="w-16 h-16 mx-auto"
                >
                  <motion.path
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                    transition={{
                      type: "tween",
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </AnimatePresence>
              <div className="text-center text-3xl font-semibold mt-4">
                wallet created
              </div>
              <h4 className="text-lg text-center text-gray-600 mt-6">
                your wallet has been created but not deployed yet. you can
                already receive funds at:
              </h4>
              <div
                className="bg-orange-100 px-4 py-2 rounded-2xl mt-2 w-full flex flex-row justify-center font-semibold"
                onClick={copyAddress}
              >
                {formatAddress(createdWalletAddress)}
                {createdWalletCopied ? (
                  <AiOutlineCheck className="ml-2 my-auto" size={15} />
                ) : (
                  <MdOutlineContentCopy className="ml-2 my-auto" size={15} />
                )}
              </div>
              <h4 className="text-lg text-center text-gray-600 mt-2">
                head to the profile page to deploy your wallet and start sending
                transactions.
              </h4>
            </div>
          </div>
        </GenericModal>
      )}
    </Layout>
  );
}
