import React, { useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface TextEditorInlineProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const TextEditorInline: React.FC<TextEditorInlineProps> = ({
  value,
  onChange,
  className
}) => {
  const plainTextToHtml = (text: string) => {
    if (!text) return "";
    if (text.includes("<") && text.includes(">")) return text;
    return `<p>${text.replace(/\n/g, "</p><p>")}</p>`.replace(
      /<p><\/p>/g,
      "<p><br></p>",
    );
  };

  const [editorValue, setEditorValue] = React.useState("");

  useEffect(() => {
    setEditorValue(plainTextToHtml(value));
  }, [value]);

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const handleChange = (content: string) => {
    setEditorValue(content);
    onChange(content);
  };

  return (
    <ReactQuill
      value={editorValue}
      onChange={handleChange}
      theme="snow"
      modules={modules}
      className={className}
    />
  );
};

export default TextEditorInline;