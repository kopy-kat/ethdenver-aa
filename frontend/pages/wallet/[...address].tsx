import { Button } from "@/components/atoms/Button";
import { Layout } from "@/components/templates/Layout";
// import { plugins, pluginCategories } from "@/data/plugins";
import { TiInfoLarge } from "react-icons/ti";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useState, useEffect } from "react";
import { GenericModal } from "@/components/atoms/GenericModal";
import useSWR from "swr";
import { fetcher } from "@/utils/common";
import { useRouter } from "next/router";

interface PluginProps {
  index: number;
  plugin: any;
  pluginCategory: any;
  showDetailModal: (plugin: any) => void;
  openConfigModal?: (plugin: any) => void;
  removeSelectedPlugin?: (id: number, e: any) => void;
  selected: boolean;
}

const PluginItem: React.FC<PluginProps> = ({
  index,
  plugin,
  selected,
  pluginCategory,
  showDetailModal,
  openConfigModal,
  removeSelectedPlugin,
}) => {
  const backgroundColors: any = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    red: "bg-red-600",
    purple: "bg-purple-700",
    yellow: "bg-yellow-600",
    zincLight: "bg-zinc-100",
    zincDark: "bg-zinc-800",
  };

  const textColors: any = {
    blue: "text-blue-600",
    green: "text-green-600",
    red: "text-red-600",
    purple: "text-purple-600",
    yellow: "text-yellow-600",
    zincLight: "text-zinc-100",
    zincDark: "text-zinc-900",
  };

  let cardBackground = backgroundColors[pluginCategory.backgroundColor];
  let buttonBackground = backgroundColors[pluginCategory.buttonBackgroundColor];
  let cardText = textColors[pluginCategory.textColor];
  const subTextArray = [];
  subTextArray.push(cardText.split("-")[0]);
  subTextArray.push(cardText.split("-")[1]);
  subTextArray.push(
    parseInt(cardText.split("-")[2]) == 100
      ? 50
      : parseInt(cardText.split("-")[2]) - 100
  );
  let cardSubText = subTextArray.join("-");
  let buttonText = textColors[pluginCategory.buttonTextColor];

  if (selected) {
    return (
      <div
        className={`flex flex-row justify-between items-center rounded-2xl px-4 py-3 my-2 hover:cursor-pointer bg-blue-600 ${cardBackground} ${cardText}`}
        key={plugin.id}
        onClick={showDetailModal}
      >
        <div className="flex flex-row items-center">
          <img
            src={plugin.icon}
            className="w-10 h-10 rounded-full bg-transparent mr-1 p-1"
            alt=""
          />
          <div className="flex flex-col">
            <div className="text-lg font-semibold">{plugin.name}</div>
            <p className="mb-1 -mt-1 font-semibold">
              {plugin.creator} | {plugin.usage.toLocaleString()} installs |{" "}
              {[...Array(plugin.rating)].map((rating: any) => (
                <span>⭐️</span>
              ))}{" "}
              ({plugin.ratingAmount}) | {plugin.audits} Verified Audits
            </p>
            <div className={`${cardSubText} text-sm mb-1`}>
              {plugin.oneLiner.length > 80
                ? plugin.oneLiner.slice(0, 80) + "..."
                : plugin.oneLiner}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center">
          {/* <Button
            onClick={showDetailModal}
            backgroundColor={buttonBackground}
            textColor={buttonText}
            additionalClasses="rounded-full w-10 h-10 p-1 mx-1"
          >
            <TiInfoLarge size={35} />
          </Button> */}
          <Button
            onClick={openConfigModal}
            backgroundColor={buttonBackground}
            textColor={buttonText}
            additionalClasses="rounded-full w-10 h-10 p-1 mx-1"
          >
            <MdEdit size={35} />
          </Button>
          <Button
            onClick={
              removeSelectedPlugin
                ? (e: any) => removeSelectedPlugin(plugin.id, e)
                : () => {}
            }
            backgroundColor={buttonBackground}
            textColor={buttonText}
            additionalClasses="rounded-full w-10 h-10 p-1 mx-1"
          >
            <FaTrash size={30} />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Draggable draggableId={plugin.id.toString()} index={index} key={plugin.id}>
      {(draggableProvided, draggableSnapshot) => (
        <div
          className={`flex flex-row justify-between items-center rounded-2xl px-4 py-3 my-2 hover:cursor-pointer hover:scale-105 transition duration-300 ${cardBackground} ${cardText}`}
          key={plugin.id}
          {...draggableProvided.draggableProps}
          {...draggableProvided.dragHandleProps}
          ref={draggableProvided.innerRef}
          onClick={showDetailModal}
        >
          <div className="flex flex-row items-center">
            <img
              src={plugin.icon}
              className="w-10 h-10 rounded-full bg-transparent mr-1 p-1"
              alt=""
            />
            <div className="flex flex-col">
              <div className="text-lg font-semibold">{plugin.name}</div>
              <p className="mb-1 -mt-1 font-semibold">
                {plugin.creator} | {plugin.usage.toLocaleString()} installs |{" "}
                {[...Array(plugin.rating)].map((rating: any) => (
                  <span>⭐️</span>
                ))}{" "}
                ({plugin.ratingAmount}) | {plugin.audits} Verified Audits
              </p>
              <div className={`${cardSubText} text-sm mb-1`}>
                {plugin.oneLiner.length > 80
                  ? plugin.oneLiner.slice(0, 80) + "..."
                  : plugin.oneLiner}
              </div>
            </div>
          </div>
          {/* <Button
            onClick={showDetailModal}
            backgroundColor={buttonBackground}
            textColor={buttonText}
            additionalClasses="rounded-full w-10 h-10 p-1"
          >
            <TiInfoLarge size={35} />
          </Button> */}
        </div>
      )}
    </Draggable>
  );
};

export default function CreateWallet() {
  const router = useRouter();
  const { address } = router.query;
  const [availablePlugins, setAvailablePlugins] = useState<any[]>([]);
  const [selectedPlugins, setSelectedPlugins] = useState<any[]>([]);
  const [loadingComplete, setLoadingComplete] = useState<boolean>(false);

  const { data: categories } = useSWR("/api/get-plugin-categories", fetcher);
  const { data: plugins } = useSWR("/api/get-plugins", fetcher);

  // MODALS
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [detailModalPlugin, setDetailModalPlugin] = useState<any>({});
  const [activeDetailTab, setActiveDetailTab] = useState<string>("description");

  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [configModalPlugin, setConfigModalPlugin] = useState<any>({});

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
    if (address) {
      //fetch wallet and display plugins
    }
  }, [address]);

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

  return (
    <Layout>
      <div className="flex flex-row">
        <DragDropContext onDragEnd={onDragEndHandler}>
          <section className="w-1/2 px-6 py-8 border-r border-zinc-200">
            <div className="flex flex-col justify-start">
              <h4 className="text-2xl font-semibold">Plugins</h4>
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
                              <h4 className="font-semibold text-base mb-2 mt-2 ml-1">
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
                                      />
                                    )
                                )
                              ) : (
                                <div className="flex flex-row justify-between items-center border border-dashed border-zinc-300 rounded-2xl px-4 py-5 my-2 font-semibold text-zinc-500">
                                  No more {pluginCategory.name.toLowerCase()}{" "}
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
                      {[0, 0].map((el) => (
                        <div
                          className={`flex flex-row justify-between items-center rounded-2xl px-4 py-3 my-2 hover:cursor-pointer hover:scale-105 transition duration-300 bg-zinc-100 select-none border border-zinc-200`}
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
              <h4 className="text-2xl font-semibold">Your Wallet</h4>
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
                              <h4 className="font-semibold text-base mb-2 mt-2 ml-1">
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
                                  No {pluginCategory.name.toLowerCase()} plugin
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
                      {[0, 0].map((el) => (
                        <div
                          className={`flex flex-row justify-between items-center rounded-2xl px-4 py-3 my-2 hover:cursor-pointer hover:scale-105 transition duration-300 bg-zinc-100 select-none border border-zinc-200`}
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
          title={"Detail"}
          closeModal={() => setShowDetailModal(false)}
        >
          <div className="px-12 pb-8 max-w-[50vw] max-h-[82vh] overflow-auto scrollbar-hide">
            <div className="mb-4">
              <h3 className="font-bold text-4xl">{detailModalPlugin.name}</h3>
              <p className="mt-2 text-lg font-semibold">
                {detailModalPlugin.creator} | {detailModalPlugin.usage.toLocaleString().toLocaleString()} installs
                |{" "}
                {[...Array(detailModalPlugin.rating)].map((rating: any) => (
                  <span>⭐️</span>
                ))}{" "}
                ({detailModalPlugin.ratingAmount}) | {detailModalPlugin.audits}{" "}
                Verified Audits
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
                Description
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
                Rating & Review
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
                Code
              </div>
            </div>
            <div className="">
              {/* {activeDetailTab == "description" &&
                detailModalPlugin.description.map((desc: string) => (
                  <p className="text-lg my-6">{desc}</p>
                ))} */}
              {activeDetailTab == "description" && (
                <p className="text-lg my-6">{detailModalPlugin.description}</p>
              )}
              {activeDetailTab == "rating" &&
                (detailModalPlugin.reviews?.length ? (
                  detailModalPlugin.reviews.map((review: any) => (
                    <div className="my-6 border border-zinc-200 py-2 px-4 rounded-2xl">
                      <div className="flex flex-col">
                        <div className="font-semibold">{review.reviewer}</div>
                        <div className=" mb-2">
                          {[...Array(review.rating)].map((rating: any) => (
                            <span>⭐️</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-lg">{review.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-lg text-zinc-300 font-bold mt-6">
                    No reviews yet
                  </p>
                ))}
              {activeDetailTab == "code" &&
                detailModalPlugin.code.map((code: any) => (
                  <div className="">
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
          title={"Finish configuring " + configModalPlugin.name}
          closeModal={() => setShowConfigModal(false)}
        >
          <div className="px-6 py-4">Text here</div>
        </GenericModal>
      )}
    </Layout>
  );
}
