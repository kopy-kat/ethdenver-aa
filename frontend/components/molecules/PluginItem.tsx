import {
    Draggable,
  } from "react-beautiful-dnd";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { Button } from "@/components/atoms/Button";

interface PluginProps {
    index: number;
    plugin: any;
    pluginCategory: any;
    showDetailModal: (plugin: any) => void;
    openConfigModal?: (plugin: any) => void;
    removeSelectedPlugin?: (id: number, e: any) => void;
    selected: boolean;
  }
  
  export const PluginItem: React.FC<PluginProps> = ({
    index,
    plugin,
    selected,
    pluginCategory,
    showDetailModal,
    openConfigModal,
    removeSelectedPlugin,
  }) => {
    const backgroundColors: any = {
      blue: "bg-blue-600/20",
      green: "bg-green-600/20",
      red: "bg-red-600/20",
      purple: "bg-purple-700/20",
      orange: "bg-orange-700/20",
      lime: "bg-lime-600/20",
      yellow: "bg-yellow-600/20",
      zincLight: "bg-zinc-100",
      zincDark: "bg-zinc-800",
    };
  
    const textColors: any = {
      blue: "text-blue-600",
      green: "text-green-600",
      red: "text-red-600",
      purple: "text-purple-600",
      yellow: "text-yellow-600",
      zincLight: "text-zinc-900",
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
          className={`flex flex-row justify-between items-center rounded-2xl px-4 py-3 my-2 hover:cursor-pointer border border-zinc-300 backdrop-blur-sm ${cardBackground} ${cardText}`}
          key={plugin.id}
          onClick={showDetailModal}
        >
          <div className="flex flex-row items-center">
          {plugin.icon && plugin.icon.slice(0,4) == "http" ? (
              <img
                src={plugin.icon}
                className="w-10 h-10 rounded-full bg-transparent mr-2 p-1"
                alt=""
              />
            ) : (
              <div className="w-10 h-10 rounded-full mr-2 p-1 border border-zinc-400 border-dashed" />
            )}
            <div className="flex flex-col">
              <div className="text-lg font-semibold lowercase">{plugin.name}</div>
              <p className="mb-1 -mt-1 font-semibold lowercase">
                {plugin.creator} | {plugin.usage.toLocaleString()} installs |{" "}
                {[...Array(plugin.rating)].map((rating: any, index: number) => (
                  <span key={index}>⭐️</span>
                ))}{" "}
                {plugin.ratingAmount != 0
                  ? "(" + plugin.ratingAmount + ") |"
                  : null}{" "}
                {plugin.audits} verified audits
              </p>
              <div className={`${cardSubText} text-sm mb-1 lowercase`}>
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
            {plugin.requirements.length ? (
              <Button
                onClick={openConfigModal}
                backgroundColor={buttonBackground}
                textColor={buttonText}
                additionalClasses="rounded-full w-10 h-10 p-1 mx-1"
              >
                <MdEdit size={35} />
              </Button>
            ) : null}
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
            className={`flex flex-row justify-between items-center rounded-2xl px-4 py-3 my-2 hover:cursor-pointer hover:scale-105 transition duration-300 border border-zinc-300 backdrop-blur-sm	${cardBackground} ${cardText}`}
            key={plugin.id}
            {...draggableProvided.draggableProps}
            {...draggableProvided.dragHandleProps}
            ref={draggableProvided.innerRef}
            onClick={showDetailModal}
          >
            <div className="flex flex-row items-center">
              {plugin.icon && plugin.icon.slice(0,4) == "http" ? (
                <img
                  src={plugin.icon}
                  className="w-10 h-10 rounded-full bg-transparent mr-2 p-1"
                  alt=""
                />
              ) : (
                <div className="w-10 h-10 rounded-full mr-2 p-1 border border-zinc-400 border-dashed" />
                )}
              <div className="flex flex-col">
                <div className="text-lg font-semibold lowercase">{plugin.name}</div>
                <p className="mb-1 -mt-1 font-semibold lowercase">
                  {plugin.creator} | {plugin.usage.toLocaleString()} installs |{" "}
                  {[...Array(plugin.rating)].map((rating: any, index: number) => (
                    <span key={index}>⭐️</span>
                  ))}{" "}
                  {plugin.ratingAmount != 0
                    ? "(" + plugin.ratingAmount + ") |"
                    : null}{" "}
                  {plugin.audits} Verified Audits
                </p>
                <div className={`${cardSubText} text-sm mb-1 lowercase`}>
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