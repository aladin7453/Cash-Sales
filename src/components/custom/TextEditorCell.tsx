import React, { useState } from "react";
import TextEditorModal from "./TextEditorModal";  // adjust import as needed

export function TextEditorCell({ value, secondDescription, moreDescription, note, remark, remark2, remark3 }) {
  const fields = [
    { label: "Description", val: value },
    { label: "2nd Description", val: secondDescription },
    { label: "More Description", val: moreDescription },
    { label: "Note", val: note },
    { label: "Remark", val: remark },
    { label: "Remark 2", val: remark2 },
    { label: "Remark 3", val: remark3 },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      {fields.map((field, index) =>
        field.val ? (
          <div
            key={field.label}
            className="cursor-pointer truncate max-w-[200px] text-ellipsis"
            onClick={() => setOpenIndex(index)}
            title={`Click to view ${field.label}`}
            dangerouslySetInnerHTML={{ __html: field.val }}
          />
        ) : null
      )}
      {openIndex !== null && (
        <TextEditorModal
          title={fields[openIndex].label}
          initialValue={fields[openIndex].val}
          onClose={() => setOpenIndex(null)}
          hideSaveButton={true}
        />
      )}
    </>
  );
}