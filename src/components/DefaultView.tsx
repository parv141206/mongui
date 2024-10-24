import React from "react";

export default function DefaultView() {
  return (
    <div className="container flex flex-col gap-3 text-center md:w-[60%]">
      <div>No models yet! Click 'Add Model' to get started.</div>
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
  );
}
