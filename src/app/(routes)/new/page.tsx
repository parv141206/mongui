"use client";
import { createAllModels } from "@/lib/createAllModels";
import { Field, Model } from "@/types/Models";
import React, { useEffect, useRef, useState } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "dracula-prism/dist/css/dracula-prism.css";
import Draggable from "react-draggable"; // The default

export default function New() {
  const [models, setModels] = useState<Model[]>([]);
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const handleWheel = (event: WheelEvent) => {
    if (event.ctrlKey) {
      event.preventDefault();
      console.log("Ctrl + Scroll detected");

      const newScale = event.deltaY > 0 ? scale - 0.1 : scale + 0.1;

      setScale(Math.max(0.1, newScale));
    }
  };

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
  }

  useEffect(() => {
    Prism.highlightAll();
  }, [models]);

  return (
    <div
      ref={ref}
      className="h-screen overflow-y-hidden bg-[#17181f-temp] bg-black text-white"
      style={{ transform: `translate(${translateX}px, ${translateY}px)` }}
    >
      <button onClick={addModel}>Add Model</button>
      <ModelList scale={scale} models={models} setModels={setModels} />
    </div>
  );
}

function ModelList({
  scale,
  models,
  setModels,
}: {
  scale: number;
  models: Model[];
  setModels: React.Dispatch<React.SetStateAction<Model[]>>;
}) {
  return (
    <div className="flex min-h-screen flex-wrap overflow-y-hidden">
      {models.map((model, modelIndex) => (
        <Draggable key={modelIndex}>
          <div className="handle absolute">
            <div style={{ transform: `scale(${scale})` }}>
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
      <div className="p-3">
        <button onClick={addFieldToModel}>Add Field</button>
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
    <div className="flex gap-3 p-3">
      <input
        type="text"
        value={field.name}
        placeholder="Field Name"
        onChange={(e) => updateField({ name: e.target.value })}
      />
      <select
        value={field.type}
        onChange={(e) => updateField({ type: e.target.value as Field["type"] })}
      >
        {["string", "number", "boolean", "object", "array", "date", "ref"].map(
          (type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ),
        )}
      </select>

      {field.type === "ref" && (
        <>
          <ReferenceSelector
            field={field}
            modelIndex={modelIndex}
            fieldIndex={fieldIndex}
            models={models}
            updateField={updateField}
          />
        </>
      )}

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

      <select
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
      </select>
    </>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <>
      <label className="custom-checkbox">
        {label}
        <input
          className="checkbox"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="checkmark"></span>
      </label>
    </>
  );
}

function CodeDisplay({ models }: { models: Model[] }) {
  return (
    <pre className="language-json">
      <code>{JSON.stringify(models, null, 2)}</code>
    </pre>
  );
}

function CreateAllModelsOutput({ models }: { models: Model[] }) {
  return (
    <div className="m-3 flex w-fit flex-col gap-3 rounded-lg bg-[#282a36] p-5 shadow-md shadow-black">
      <StatusIndicators />

      <hr />

      <pre className="language-javascript">
        <code>{createAllModels(models)}</code>
      </pre>
    </div>
  );
}

function StatusIndicators() {
  return (
    <div className="flex gap-3 p-1">
      {["red", "yellow", "green"].map((color) => (
        <div
          key={color}
          className={`h-5 w-5 rounded-full bg-${color}-500`}
        ></div>
      ))}
    </div>
  );
}
