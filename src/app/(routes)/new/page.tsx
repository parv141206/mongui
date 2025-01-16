"use client";

import { Field, Model } from "@/types/Models";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "dracula-prism/dist/css/dracula-prism.css";
import Draggable from "react-draggable";
import DotPattern from "@/components/ui/dot-pattern";
import { IoIosAdd } from "react-icons/io";
import { useConfirm } from "@/hooks/useConfirm";
import DefaultView from "@/components/DefaultView";
import CodeView from "@/components/CodeView";
import { DraggableEvent, DraggableData } from "react-draggable";
import { useModal } from "@/hooks/useModal";
import { IoMdHome } from "react-icons/io";
import Link from "next/link";
import { Checkbox } from "@/components/Checkbox";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BsController } from "react-icons/bs";

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

  const validateRefModels = () => {
    // Check each model's fields for ref types
    for (const model of models) {
      for (const field of model.fields) {
        if (field.type === "ref") {
          // Check if the referenced model exists
          const referencedModel = models.find(
            (m) =>
              m.collection_name.trim() === field.ref?.collection_name?.trim(),
          );

          if (!referencedModel) {
            setError(
              `Invalid Reference: Create and name all models before editing.`,
            );
            return false;
          }
        }
      }
    }
    setError(null);
    return true;
  };

  useEffect(() => {
    validateRefModels();
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
      className="relative h-screen overflow-x-hidden overflow-y-hidden bg-black text-white"
    >
      <div className="absolute inset-0 z-0">
        <DotPattern className="bg-black fill-white opacity-25" />
      </div>
      {isCodeViewOpen && (
        <CodeView setIsCodeViewOpen={setIsCodeViewOpen} models={models} />
      )}
      <div className="absolute z-10 flex w-full items-center justify-center">
        <div className="m-5 flex flex-col justify-between rounded-xl border border-white/15 bg-black p-3 backdrop-blur-lg md:w-[80%]">
          <div className="flex justify-between">
            <div className="flex items-center justify-center gap-4">
              <Link
                href={"/"}
                className="flex bg-black pl-3 text-2xl text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IoMdHome />
              </Link>

              <Link
                href={"/create-controller"}
                className="border-b border-emerald-500 bg-black text-base text-emerald-500"
              >
                Controllers!
              </Link>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center justify-start gap-1 rounded-sm border-2 border-white/20 px-3 py-1 text-white transition-all duration-500 hover:bg-white hover:text-black">
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
                className="rounded-sm border-2 border-white/20 bg-black px-3 py-1 text-white transition-all duration-500 hover:border-black hover:bg-white hover:text-black"
              >
                Center Layout
              </button>
              <button
                onClick={async () => {
                  if (await confirm("Are you sure?")) {
                    setModels([]);
                  }
                }}
                className="rounded-sm border-2 border-white/20 bg-black px-3 py-1 text-white transition-all duration-500 hover:border-black hover:bg-red-500 hover:text-black"
              >
                Clear all
              </button>
            </div>
            <div className="flex space-x-3 text-base">
              <button
                className="text-yellow-400"
                onClick={() => {
                  modal(`
                    <div class="max-w-md mx-auto flex flex-col gap-4 text-left px-4 py-1">
                      <h2 class="futura text-3xl font-medium text-white/90">
                        Getting Started!
                      </h2>
                      <hr class="border-white/15" />
                      <div>
                        <h3 class="futura text-2xl text-white/90 mb-2">
                          Navigation
                        </h3>
                        <ul class="body space-y-1 text-base text-white/75">
                          <li>• Hold Alt + mouse to pan around</li>
                          <li>• Ctrl + scroll to zoom</li>
                          <li>• Drag models to move them</li>
                        </ul>
                      </div>
                      <div class="body text-emerald-400 bg-emerald-950/35 p-3 rounded">
                        <strong>Tip:</strong> To reference another model's field, use the 'ref' data type and specify the model name.
                      </div>
                    </div>
                  `);
                }}
              >
                Help
              </button>
              <button
                onClick={handleCodeViewOpen}
                className="rounded-sm border-2 border-emerald-500 bg-emerald-500 px-3 py-1 text-black"
              >
                Code
              </button>
            </div>
          </div>
          {error && (
            <div className="absolute left-1/2 top-[calc(100%+0.5rem)] flex -translate-x-1/2 items-center justify-center rounded bg-white p-3 text-center text-red-500">
              {error}
            </div>
          )}
        </div>
      </div>
      {models.length === 0 && (
        <div className="relative flex h-full w-full items-center justify-center gap-5 text-xl">
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
    <div className="m-3 flex w-fit flex-col gap-3 rounded-sm border-2 border-white/20 bg-black p-3 backdrop-blur-lg">
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
      <div className="flex w-full justify-between gap-3">
        <div className="w-fit rounded-sm border border-white/30 bg-white px-3 py-1 text-black transition-all duration-500 hover:border hover:border-green-500 hover:bg-green-500">
          <button className="flex items-center gap-1" onClick={addFieldToModel}>
            <IoIosAdd className="text-2xl font-bold" />
            Add Field
          </button>
        </div>
        <div className="w-fit rounded-sm border border-white/30 px-3 py-1 text-white transition-all duration-500 hover:border-red-500 hover:bg-red-500 hover:text-black">
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
    <div className="flex flex-col gap-3 border-s-2 border-green-500 p-3">
      <div className="flex flex-row items-center justify-center gap-3">
        <input
          className="field-input"
          type="text"
          value={field.name}
          placeholder="Field Name"
          onChange={(e) => updateField({ name: e.target.value })}
        />
        <Select
          value={field.type}
          onValueChange={(value) =>
            updateField({ type: value as Field["type"] })
          }
        >
          <SelectTrigger className="flex h-full w-fit items-center gap-1 rounded-sm border border-white/30 px-3 py-1 text-base text-white/80 hover:border-white/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-2 border-white/20 bg-black text-base text-white outline outline-1 focus:outline-black">
            {[
              { value: "string", label: "String" },
              { value: "number", label: "Number" },
              { value: "boolean", label: "Boolean" },
              { value: "object", label: "Object" },
              { value: "array", label: "Array" },
              { value: "date", label: "Date" },
              { value: "ref", label: "Reference" },
            ].map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {field.type === "ref" && (
        <div className="flex items-center gap-3 px-1">
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
      <div className="flex gap-3">
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
      </div>
      <button
        className="w-fit rounded-sm border border-white/30 px-3 py-1 text-white transition-all duration-500 hover:border-red-500 hover:bg-red-500 hover:text-black"
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
        Remove
      </button>
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
      <Select
        value={field.ref?.collection_name || ""}
        onValueChange={(value) => {
          const selectedCollection = models.find(
            (m) => m.collection_name === value,
          );
          updateField({
            ref: selectedCollection ? { ...selectedCollection } : null,
          });
        }}
      >
        <SelectTrigger className="w-fit gap-3 rounded-sm border border-white/30">
          <SelectValue placeholder="Select a collection" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="None">none</SelectItem>
          {models.map((model) => (
            <SelectItem
              key={model.collection_name}
              value={model.collection_name}
            >
              {model.collection_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
