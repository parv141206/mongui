"use client";

import { Field, Model } from "@/types/Models";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "dracula-prism/dist/css/dracula-prism.css";
import Draggable from "react-draggable";
import DotPattern from "@/components/ui/dot-pattern";
import { IoTrashBin } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import { useConfirm } from "@/hooks/useConfirm";
import DefaultView from "@/components/DefaultView";
import CodeView from "@/components/CodeView";
import { DraggableEvent, DraggableData } from "react-draggable";
import { useModal } from "@/hooks/useModal";
import { IoMdHome } from "react-icons/io";
import Link from "next/link";
import { Checkbox } from "@/components/Checkbox";

export default function New() {
  const [models, setModels] = useState<Model[]>([]);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isCodeViewOpen, setIsCodeViewOpen] = useState(false);
  const [inverseScale, setInverseScale] = useState(1);
  // ZOOOOOOM
  const handleWheel = (event: WheelEvent) => {
    if (event.ctrlKey) {
      event.preventDefault();
      console.log("Ctrl + Scroll detected");

      const newScale = event.deltaY > 0 ? scale - 0.1 : scale + 0.1;

      setScale(Math.max(0.1, newScale));
      setInverseScale(1 / newScale);
    }
  };

  // PANEEEEE
  const handleDrag = (event: MouseEvent) => {
    if (event.altKey) {
      event.preventDefault();
      console.log("Alt + Drag detected");

      setTranslateX((prev) => prev + event.movementX);
      setTranslateY((prev) => prev + event.movementY);
    }
  };

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener("wheel", handleWheel, { passive: false });
      element.addEventListener("mousemove", handleDrag);
    }

    return () => {
      if (element) {
        element.removeEventListener("wheel", handleWheel);
        element.removeEventListener("mousemove", handleDrag);
      }
    };
  }, [scale]);

  function addModel() {
    setModels([...models, { collection_name: "", fields: [] }]);
    setTranslateX(0);
    setTranslateY(0);
  }

  useEffect(() => {
    Prism.highlightAll();
  }, [models]);

  const validateCollectionNames = () => {
    const collectionNames = new Set<string>();
    const duplicates = new Set<string>();

    const emptyCollections = models.some(
      (model) => !model.collection_name.trim(),
    );
    if (emptyCollections) {
      setError("All collections must have names");
      return false;
    }

    models.forEach((model) => {
      const name = model.collection_name.trim();
      if (collectionNames.has(name)) {
        duplicates.add(name);
      }
      collectionNames.add(name);
    });

    if (duplicates.size > 0) {
      setError(
        `Duplicate collection names found: ${Array.from(duplicates).join(", ")}`,
      );
      return false;
    }

    setError(null);
    return true;
  };

  const handleCodeViewOpen = () => {
    if (validateCollectionNames()) {
      setIsCodeViewOpen(true);
    }
  };
  const confirm = useConfirm();
  const modal = useModal();
  return (
    <div
      ref={ref}
      className="relative h-screen overflow-x-hidden overflow-y-hidden bg-[#17181f-temp] bg-black text-white"
    >
      <div className="absolute inset-0 z-0">
        <DotPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          repeatDelay={1}
          className="opacity-25"
        />
      </div>
      {isCodeViewOpen && (
        <CodeView setIsCodeViewOpen={setIsCodeViewOpen} models={models} />
      )}
      <div className="absolute z-10 flex w-full items-center justify-center">
        <div className="m-5 flex flex-col justify-between rounded-xl border border-white/15 bg-black/15 p-3 backdrop-blur-lg md:w-[80%]">
          <div className="flex justify-between">
            <div className="flex items-center justify-center gap-1">
              <Link href={"/"} className="flex text-xl">
                <IoMdHome />
              </Link>
              <Link href={"/about"} className="mx-3 flex text-xl">
                About
              </Link>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center justify-start gap-1">
                <button
                  onClick={addModel}
                  className="flex items-center justify-center gap-1"
                >
                  <IoIosAdd className="text-2xl font-bold" />
                  Add Model
                </button>
              </div>
              <button
                onClick={() => {
                  setTranslateX(0);
                  setTranslateY(0);
                }}
                className="rounded-lg bg-white px-3 py-1 text-black"
              >
                Center Layout
              </button>
              <button
                onClick={async () => {
                  if (await confirm("Are you sure?")) {
                    setModels([]);
                  }
                }}
                className="rounded-lg bg-red-700 px-3 py-1 font-bold"
              >
                Clear all
              </button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  modal(`
                   <div className="container flex flex-col gap-3 text-center md:w-[60%]">
                    <div className="text-white/75">Click Add Model to get started.</div>
                      <hr className="border-white/15" />
                    <div>
                    <div>Navigation:</div>
                      <ul className="p-3 text-white/75">
                        <li>Hold 'Alt' key and move mouse to pane around.</li>
                        <li>'Ctrl' + Scroll to zoom.</li>
                        <li>Simply drag a model to move it.</li>
                      </ul>
                    </div>
                      <div className="text-green-400">
                        Note: In order to reference a field in another model, use the 'ref' data
                        type and mention the model name. This can be used to populate the field!
                      </div>
                    </div>
                    `);
                }}
              >
                Help!
              </button>
              <button
                onClick={handleCodeViewOpen}
                className="rounded-lg bg-green-700 px-3 py-1 font-bold"
              >
                Code
              </button>
            </div>
          </div>
          {error && (
            <div className="mt-2 text-center text-red-500">{error}</div>
          )}
        </div>
      </div>
      {models.length === 0 && (
        <div className="relative flex h-full w-full items-center justify-center gap-5 text-xl">
          {/* <Image
            src={"/assets/arrow.svg"}
            width={100}
            height={100}
            alt="" 
            className="left-0 top-0 rotate-[270deg] scale-[5] opacity-50"
          /> */}
          <DefaultView />
        </div>
      )}
      <div style={{ transform: `scale(${scale})` }}>
        <ModelList
          modelRef={modelRef}
          translateX={translateX}
          translateY={translateY}
          scale={scale}
          models={models}
          setModels={setModels}
          inverseScale={inverseScale}
        />
      </div>
    </div>
  );
}

interface Position {
  x: number;
  y: number;
}

interface ModelPositions {
  [key: number]: Position;
}

function ModelList({
  scale,
  models,
  setModels,
  translateX,
  translateY,
  modelRef,
  inverseScale,
}: {
  scale: number;
  models: Model[];
  setModels: React.Dispatch<React.SetStateAction<Model[]>>;
  translateX: number;
  translateY: number;
  modelRef: React.MutableRefObject<HTMLDivElement | null>;
  inverseScale: number;
}) {
  const [modelPositions, setModelPositions] = useState<ModelPositions>({});
  const [connections, setConnections] = useState<
    Array<{
      start: {
        x: number;
        y: number;
        side: "top" | "right" | "bottom" | "left";
      };
      end: { x: number; y: number; side: "top" | "right" | "bottom" | "left" };
    }>
  >([]);

  const calculateInitialPosition = (index: number) => {
    const GRID_SPACING = 350;
    const MODELS_PER_ROW = 3;

    const row = Math.floor(index / MODELS_PER_ROW);
    const col = index % MODELS_PER_ROW;

    return {
      x: col * GRID_SPACING + 50,
      y: row * GRID_SPACING + 50,
    };
  };

  useEffect(() => {
    models.forEach((_, index) => {
      if (!modelPositions[index]) {
        setModelPositions((prev) => ({
          ...prev,
          [index]: calculateInitialPosition(index),
        }));
      }
    });
  }, [models.length]);

  const isColliding = (
    rect1: DOMRect,
    rect2: DOMRect,
    padding: number = 10,
  ): boolean => {
    return !(
      rect1.right + padding < rect2.left ||
      rect1.left > rect2.right + padding ||
      rect1.bottom + padding < rect2.top ||
      rect1.top > rect2.bottom + padding
    );
  };

  const handleDrag = (
    modelIndex: number,
    e: DraggableEvent,
    data: DraggableData,
  ) => {
    const draggedElement = document.getElementById(`model-${modelIndex}`);
    if (!draggedElement) return;

    const tempRect = draggedElement.getBoundingClientRect();
    const tempRectAtNewPosition = new DOMRect(
      tempRect.x + (data.x - (modelPositions[modelIndex]?.x || 0)),
      tempRect.y + (data.y - (modelPositions[modelIndex]?.y || 0)),
      tempRect.width,
      tempRect.height,
    );

    let canMove = true;

    models.forEach((_, index) => {
      if (index !== modelIndex) {
        const otherElement = document.getElementById(`model-${index}`);
        if (otherElement) {
          const otherRect = otherElement.getBoundingClientRect();
          if (isColliding(tempRectAtNewPosition, otherRect)) {
            canMove = false;
          }
        }
      }
    });

    if (canMove) {
      setModelPositions((prev) => ({
        ...prev,
        [modelIndex]: { x: data.x, y: data.y },
      }));
      updateConnections();
    }
  };

  const getConnectionPoints = (fromEl: Element, toEl: Element) => {
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const fromCenter = {
      x: fromRect.left + fromRect.width / 2,
      y: fromRect.top + fromRect.height / 2,
    };
    const toCenter = {
      x: toRect.left + toRect.width / 2,
      y: toRect.top + toRect.height / 2,
    };

    const angle = Math.atan2(
      toCenter.y - fromCenter.y,
      toCenter.x - fromCenter.x,
    );
    const PI = Math.PI;

    let fromSide: "top" | "right" | "bottom" | "left";
    let toSide: "top" | "right" | "bottom" | "left";
    let startX: number, startY: number, endX: number, endY: number;

    if (angle > -PI * 0.25 && angle <= PI * 0.25) {
      fromSide = "right";
      startX = fromRect.right;
      startY = fromCenter.y;
    } else if (angle > PI * 0.25 && angle <= PI * 0.75) {
      fromSide = "bottom";
      startX = fromCenter.x;
      startY = fromRect.bottom;
    } else if (angle > -PI * 0.75 && angle <= -PI * 0.25) {
      fromSide = "top";
      startX = fromCenter.x;
      startY = fromRect.top;
    } else {
      fromSide = "left";
      startX = fromRect.left;
      startY = fromCenter.y;
    }

    if (angle > -PI * 0.25 && angle <= PI * 0.25) {
      toSide = "left";
      endX = toRect.left;
      endY = toCenter.y;
    } else if (angle > PI * 0.25 && angle <= PI * 0.75) {
      toSide = "top";
      endX = toCenter.x;
      endY = toRect.top;
    } else if (angle > -PI * 0.75 && angle <= -PI * 0.25) {
      toSide = "bottom";
      endX = toCenter.x;
      endY = toRect.bottom;
    } else {
      toSide = "right";
      endX = toRect.right;
      endY = toCenter.y;
    }

    return {
      start: { x: startX, y: startY, side: fromSide },
      end: { x: endX, y: endY, side: toSide },
    };
  };

  const getControlPoints = (connection: {
    start: { x: number; y: number; side: string };
    end: { x: number; y: number; side: string };
  }) => {
    const { start, end } = connection;
    const distance = Math.hypot(end.x - start.x, end.y - start.y);
    const curveDistance = distance * 0.4;

    const cp1x =
      start.x +
      (start.side === "left"
        ? -curveDistance
        : start.side === "right"
          ? curveDistance
          : 0);
    const cp1y =
      start.y +
      (start.side === "top"
        ? -curveDistance
        : start.side === "bottom"
          ? curveDistance
          : 0);
    const cp2x =
      end.x +
      (end.side === "left"
        ? -curveDistance
        : end.side === "right"
          ? curveDistance
          : 0);
    const cp2y =
      end.y +
      (end.side === "top"
        ? -curveDistance
        : end.side === "bottom"
          ? curveDistance
          : 0);

    return { cp1x, cp1y, cp2x, cp2y };
  };

  const updateConnections = useCallback(() => {
    const newConnections: any = [];

    models.forEach((model, fromIndex) => {
      model.fields.forEach((field) => {
        if (field.type === "ref" && field.ref?.collection_name) {
          const toIndex = models.findIndex(
            (m) => m.collection_name === field.ref?.collection_name,
          );

          if (toIndex !== -1) {
            const fromEl = document.getElementById(`model-${fromIndex}`);
            const toEl = document.getElementById(`model-${toIndex}`);

            if (fromEl && toEl) {
              const connection = getConnectionPoints(fromEl, toEl);
              newConnections.push(connection);
            }
          }
        }
      });
    });

    setConnections(newConnections);
  }, [models]);

  useEffect(() => {
    updateConnections();
    window.addEventListener("mousemove", updateConnections);
    return () => window.removeEventListener("mousemove", updateConnections);
  }, [models, updateConnections]);

  return (
    <>
      <svg
        className="pointer-events-none fixed inset-0"
        style={{ zIndex: 5, scale: inverseScale }}
        width="100%"
        height="100%"
      >
        {connections.map((connection, index) => {
          const { cp1x, cp1y, cp2x, cp2y } = getControlPoints(connection);
          return (
            <g key={index}>
              <defs>
                <marker
                  id={`arrow-${index}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="rgba(255, 255, 255, 0.5)"
                  />
                </marker>
              </defs>
              <path
                d={`M ${connection.start.x} ${connection.start.y} 
                    C ${cp1x} ${cp1y},
                      ${cp2x} ${cp2y},
                      ${connection.end.x} ${connection.end.y}`}
                fill="none"
                stroke="rgba(255, 255, 255, 0.5)"
                strokeWidth="2"
                markerEnd={`url(#arrow-${index})`}
              />
            </g>
          );
        })}
      </svg>
      <div className="flex min-h-screen flex-wrap overflow-y-hidden">
        {models.map((model, modelIndex) => (
          <Draggable
            key={modelIndex}
            position={
              modelPositions[modelIndex] || calculateInitialPosition(modelIndex)
            }
            onDrag={(e, data) => handleDrag(modelIndex, e, data)}
            onStop={updateConnections}
          >
            <div className="handle absolute">
              <div
                ref={modelRef}
                id={`model-${modelIndex}`}
                style={{
                  transform: `

                   translate(${translateX}px, ${translateY}px)`,
                }}
              >
                <ModelCard
                  model={model}
                  modelIndex={modelIndex}
                  models={models}
                  setModels={setModels}
                />
              </div>
            </div>
          </Draggable>
        ))}
      </div>
    </>
  );
}

function ModelCard({
  model,
  modelIndex,
  models,
  setModels,
}: {
  model: Model;
  modelIndex: number;
  models: Model[];
  setModels: React.Dispatch<React.SetStateAction<Model[]>>;
}) {
  const confirm = useConfirm();

  function addFieldToModel() {
    setModels((prevModels) => [
      ...prevModels.slice(0, modelIndex),
      {
        ...prevModels[modelIndex],
        fields: [
          ...prevModels[modelIndex].fields,
          { name: "", type: "string", ref: null, ref_field: null },
        ],
      },
      ...prevModels.slice(modelIndex + 1),
    ]);
  }

  function updateModelName(value: string) {
    setModels((prevModels) => [
      ...prevModels.slice(0, modelIndex),
      { ...prevModels[modelIndex], collection_name: value },
      ...prevModels.slice(modelIndex + 1),
    ]);
  }

  return (
    <div className="m-3 flex w-fit flex-col gap-3 rounded-xl border border-white/25 bg-black p-3">
      <input
        className="normal-input"
        type="text"
        value={model.collection_name}
        onChange={(e) => updateModelName(e.target.value)}
        placeholder="Collection Name"
      />
      <FieldList
        fields={model.fields}
        modelIndex={modelIndex}
        models={models}
        setModels={setModels}
      />
      <div className="flex w-full justify-between">
        <div className="w-fit rounded-xl bg-white p-3 text-black">
          <button className="flex items-center gap-2" onClick={addFieldToModel}>
            <IoIosAdd className="text-2xl font-bold" />
            Add Field
          </button>
        </div>
        <div className="w-fit rounded-xl p-3">
          <button
            onClick={async () => {
              if (await confirm("Are you sure you want to delete this model?"))
                setModels(models.filter((_, i) => i !== modelIndex));
            }}
          >
            Delete Model
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldList({
  fields,
  modelIndex,
  models,
  setModels,
}: {
  fields: Field[];
  modelIndex: number;
  models: Model[];
  setModels: React.Dispatch<React.SetStateAction<Model[]>>;
}) {
  return (
    <div className="flex flex-col gap-3">
      {fields.map((field, fieldIndex) => (
        <FieldCard
          key={fieldIndex}
          field={field}
          modelIndex={modelIndex}
          fieldIndex={fieldIndex}
          models={models}
          setModels={setModels}
        />
      ))}
    </div>
  );
}

function FieldCard({
  field,
  modelIndex,
  fieldIndex,
  models,
  setModels,
}: {
  field: Field;
  modelIndex: number;
  fieldIndex: number;
  models: Model[];
  setModels: React.Dispatch<React.SetStateAction<Model[]>>;
}) {
  function updateField(updatedField: Partial<Field>) {
    setModels((prevModels) => {
      const updatedFields = prevModels[modelIndex].fields.map((f, i) =>
        i === fieldIndex ? { ...f, ...updatedField } : f,
      );

      return [
        ...prevModels.slice(0, modelIndex),
        { ...prevModels[modelIndex], fields: updatedFields },
        ...prevModels.slice(modelIndex + 1),
      ];
    });
  }

  return (
    <div className="flex flex-col gap-3 border-s border-green-400 p-3">
      <div className="flex gap-3">
        <input
          className="normal-input"
          type="text"
          value={field.name}
          placeholder="Field Name"
          onChange={(e) => updateField({ name: e.target.value })}
        />
        <select
          value={field.type}
          className="bg-black text-white"
          onChange={(e) =>
            updateField({ type: e.target.value as Field["type"] })
          }
        >
          {[
            "string",
            "number",
            "boolean",
            "object",
            "array",
            "date",
            "ref",
          ].map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      {field.type === "ref" && (
        <div className="flex items-center gap-3 px-3">
          <div>Reference: </div>
          <ReferenceSelector
            field={field}
            modelIndex={modelIndex}
            fieldIndex={fieldIndex}
            models={models}
            updateField={updateField}
          />
        </div>
      )}
      <div className="flex gap-3 p-3">
        <Checkbox
          label="Required"
          checked={field.required}
          onChange={(checked) => updateField({ required: checked })}
        />

        <Checkbox
          label="Unique"
          checked={field.unique}
          onChange={(checked) => updateField({ unique: checked })}
        />
        <button
          className="mx-3 text-3xl"
          onClick={() =>
            setModels((prevModels) =>
              prevModels.map((model, i) =>
                i === modelIndex
                  ? {
                      ...model,
                      fields: model.fields.filter((_, fi) => fi !== fieldIndex),
                    }
                  : model,
              ),
            )
          }
        >
          <IoTrashBin />
        </button>
      </div>
    </div>
  );
}

function ReferenceSelector({
  field,
  modelIndex,
  fieldIndex,
  models,
  updateField,
}: {
  field: Field;
  modelIndex: number;
  fieldIndex: number;
  models: Model[];
  updateField: (updatedField: Partial<Field>) => void;
}) {
  return (
    <>
      <select
        value={field.ref?.collection_name || ""}
        onChange={(e) => {
          const selectedCollection = models.find(
            (m) => m.collection_name === e.target.value,
          );
          updateField({
            ref: selectedCollection ? { ...selectedCollection } : null,
          });
        }}
      >
        <option value="">none</option>
        {models.map((model) => (
          <option key={model.collection_name} value={model.collection_name}>
            {model.collection_name}
          </option>
        ))}
      </select>

      {/* <select
        value={field.ref_field?.name || ""}
        onChange={(e) => {
          const selectedField = field.ref?.fields.find(
            (f) => f.name === e.target.value,
          );
          updateField({
            ref_field: selectedField ? { ...selectedField } : null,
          });
        }}
      >
        <option value="">none</option>
        {field.ref?.fields.map((refField) => (
          <option key={refField.name} value={refField.name}>
            {refField.name}
          </option>
        ))}
      </select> */}
    </>
  );
}
