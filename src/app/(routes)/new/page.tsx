"use client";
import { createAllModels } from "@/lib/createAllModels";
import { Field, Model } from "@/types/Models";
import React, { useEffect, useState } from "react";
import Prism from "prismjs"; // Import Prism
import "prismjs/themes/prism-tomorrow.css"; // Default Prism theme
import "dracula-prism/dist/css/dracula-prism.css"; // Import Dracula theme
export default function New() {
  const [models, setModels] = useState<Model[]>([]);

  function addModel() {
    setModels([
      ...models,
      {
        collection_name: "",
        fields: [],
      },
    ]);
  }

  function addFieldToModel(index: number) {
    setModels((prevModels) => [
      ...prevModels.slice(0, index),
      {
        ...prevModels[index],
        fields: [
          ...prevModels[index].fields,
          { name: "", type: "string", ref: null, ref_field: null },
        ],
      },
      ...prevModels.slice(index + 1),
    ]);
  }

  function updateModelName(index: number, value: string) {
    setModels((prevModels) => [
      ...prevModels.slice(0, index),
      { ...prevModels[index], collection_name: value },
      ...prevModels.slice(index + 1),
    ]);
  }

  function updateField(
    index: number,
    fieldIndex: number,
    updatedField: Partial<Field>,
  ) {
    setModels((prevModels) => {
      const updatedFields = prevModels[index].fields.map((field, i) =>
        i === fieldIndex ? { ...field, ...updatedField } : field,
      );

      return [
        ...prevModels.slice(0, index),
        { ...prevModels[index], fields: updatedFields },
        ...prevModels.slice(index + 1),
      ];
    });
  }

  useEffect(() => {
    // Highlight code when models change
    Prism.highlightAll();
  }, [models]);

  return (
    <div className="bg-[#17181f] text-white">
      <button onClick={addModel}>Add Model</button>
      <div className="flex flex-wrap">
        {models.map((model, modelIndex) => (
          <div
            className="m-3 flex w-fit flex-col gap-3 border p-3"
            key={modelIndex}
          >
            <input
              type="text"
              value={model.collection_name}
              onChange={(e) => updateModelName(modelIndex, e.target.value)}
              placeholder="Collection Name"
            />
            <div className="flex flex-col gap-3">
              {model.fields.map((field, fieldIndex) => (
                <div className="flex gap-3 border p-3" key={fieldIndex}>
                  <input
                    type="text"
                    value={field.name}
                    placeholder="Field Name"
                    onChange={(e) =>
                      updateField(modelIndex, fieldIndex, {
                        name: e.target.value,
                      })
                    }
                  />
                  <select
                    value={field.type}
                    onChange={(e) =>
                      updateField(modelIndex, fieldIndex, {
                        type: e.target.value as Model["fields"][0]["type"],
                      })
                    }
                  >
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                    <option value="object">object</option>
                    <option value="array">array</option>
                    <option value="date">date</option>
                    <option value="ref">ref</option>
                  </select>
                  {field.type === "ref" && (
                    <>
                      <select
                        value={field.ref?.collection_name || ""}
                        onChange={(e) => {
                          const selectedCollection = models.find(
                            (m) => m.collection_name === e.target.value,
                          );
                          updateField(modelIndex, fieldIndex, {
                            ref: selectedCollection
                              ? { ...selectedCollection }
                              : null,
                          });
                        }}
                      >
                        <option value="">none</option>
                        {models.map((model) => (
                          <option
                            key={model.collection_name}
                            value={model.collection_name}
                          >
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
                          updateField(modelIndex, fieldIndex, {
                            ref_field: selectedField
                              ? { ...selectedField }
                              : null,
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
                  )}
                  {/* Checkbox for required and unique */}
                  <label>Required</label>
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) =>
                      updateField(modelIndex, fieldIndex, {
                        required: e.target.checked,
                      })
                    }
                  />
                  <label>Unique</label>
                  <input
                    type="checkbox"
                    checked={field.unique}
                    onChange={(e) =>
                      updateField(modelIndex, fieldIndex, {
                        unique: e.target.checked,
                      })
                    }
                  />
                </div>
              ))}
            </div>
            <div className="p-3">
              <button onClick={() => addFieldToModel(modelIndex)}>
                Add Field
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Displaying models in a highlighted code block */}
      <pre className="language-json">
        <code>{JSON.stringify(models, null, 2)}</code>
      </pre>

      {/* Another highlighted code block for createAllModels output */}
      <div className="m-3 flex w-fit flex-col gap-3 rounded-lg bg-[#282a36] p-5 shadow-md shadow-black">
        <div className="flex gap-3 p-1">
          <div className="h-5 w-5 rounded-full bg-red-500"></div>
          <div className="h-5 w-5 rounded-full bg-yellow-500"></div>
          <div className="h-5 w-5 rounded-full bg-green-500"></div>
        </div>
        <hr />
        <div className="p-1">
          {/* Highlighting the output of createAllModels */}
          <pre className="language-javascript">
            <code>{createAllModels(models)}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
