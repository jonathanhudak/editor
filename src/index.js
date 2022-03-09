import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";
import "./input.css";
import "./styles.css";

const sanitizeConf = {
  allowedTags: ["b", "i", "em", "strong", "a", "p", "h1", "button"],
  allowedAttributes: { a: ["href"] }
};

function MyComponent() {
  const [html, setHTML] = useState(
    `<p>Hello <b>World</b> !</p><p>Paragraph 2</p>\n\r<button>Action</button>`
  );
  const [editable, setEditable] = useState(true);

  const handleChange = useCallback(
    (evt) => {
      console.debug(evt.target.value);
      setHTML(evt.target.value);
    },
    [setHTML]
  );

  const sanitize = useCallback(() => {
    setHTML(sanitizeHtml(html, sanitizeConf));
  }, [setHTML, html]);

  const toggleEditable = useCallback(() => {
    setEditable({ editable: !editable });
  }, [setEditable, editable]);

  return (
    <div>
      <h3>editable contents</h3>
      <ContentEditable
        className="editable"
        tagName="pre"
        html={html} // innerHTML of the editable div
        disabled={!editable} // use true to disable edition
        onChange={handleChange} // handle innerHTML change
        onBlur={sanitize}
      />
      <h3>source</h3>
      <textarea
        className="editable"
        value={html}
        onChange={handleChange}
        onBlur={sanitize}
      />
      <h3>actions</h3>
      <EditButton cmd="italic" />
      <EditButton cmd="bold" />
      <EditButton cmd="formatBlock" arg="h1" name="heading" />
      <EditButton
        cmd="createLink"
        arg="https://github.com/lovasoa/react-contenteditable"
        name="hyperlink"
      />
      <button onClick={toggleEditable}>
        Make {editable ? "readonly" : "editable"}
      </button>
    </div>
  );
}

function EditButton(props) {
  return (
    <button
      key={props.cmd}
      onMouseDown={(evt) => {
        evt.preventDefault(); // Avoids loosing focus from the editable area
        document.execCommand(props.cmd, false, props.arg); // Send the command to the browser
      }}
    >
      {props.name || props.cmd}
    </button>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<MyComponent />, rootElement);
