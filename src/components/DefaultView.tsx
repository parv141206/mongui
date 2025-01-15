import React from "react";

export default function DefaultView() {
  return (
    <div className="container flex flex-col gap-2 text-center md:w-[60%]">
      <div>No models yet! Click 'Add Model' to get started.</div>
      <p>Create and Name all Models first!</p>
      <hr className="border-white/30" />
      <div>
        <div>Navigation:</div>
        <ul className="p-3 text-white/75">
          <li>• Hold Alt + mouse to pan around</li>
          <li>• Ctrl + scroll to zoom</li>
          <li>• Drag models to move them</li>
        </ul>
      </div>
      <div className="body rounded bg-black p-3 text-emerald-400">
        <strong>Tip:</strong> To reference another model's field, use the 'ref'
        data type and specify the model name.
      </div>
    </div>
  );
}
