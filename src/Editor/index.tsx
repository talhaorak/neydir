import { Editor as MonacoEditor, OnMount } from "@monaco-editor/react"
import '@bithero/monaco-glsl';
import NavBar from "./NavBar";
import { useRef, useState } from "react";
import { Nav } from "react-bootstrap";

export interface IEditorProps {
  vertexShader: string;
  fragmentShader: string;
  onCodeChange: (file: string, code: string) => void;
  onMenuItemClick: (menu: string, item: string) => void;
}

// type MonacoEditorType = typeof MonacoEditor;

export default function Editor({ vertexShader, fragmentShader, onCodeChange, onMenuItemClick }: IEditorProps) {
  const [currentTab, setCurrentTab] = useState("fragment.glsl");
  // const editorRef = useRef(null);
  const editorRef = useRef<any | null>(null);

  const handleTabSelect = (selectedTab: string | null) => {
    setCurrentTab(selectedTab!);
  };

  const handleEditorChange = (value?: string) => {
    onCodeChange(currentTab, value!);
  };

  const handleMenuItemClick = (menu: string, item: string) => {
    // handle Edit -> Undo, Redo
    if (menu === "edit") {
      switch (item) {
        case "undo":
          editorRef!.current.trigger("undo", "undo");
          break;
        case "redo":
          editorRef!.current.trigger("redo", "redo");
          break;
      }
    } else {
      onMenuItemClick(menu, item);
    }
  }

  const editorDidMount: OnMount = (editor, _) => {
    editorRef!.current = editor;
  }

  return (
    <div className="h-100">
      <NavBar onMenuItemClick={handleMenuItemClick} />
      <Nav variant="tabs" defaultActiveKey="fragment.glsl" onSelect={handleTabSelect}>
        <Nav.Item>
          <Nav.Link eventKey="fragment.glsl" href="#">fragment.glsl</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="vertex.glsl" href="#">vertex.glsl</Nav.Link>
        </Nav.Item>
      </Nav>

      <MonacoEditor
        height="100%"
        width="100%"
        language="glsl"
        defaultLanguage="glsl"

        theme="vs-dark"
        value={currentTab === "fragment.glsl" ? fragmentShader : vertexShader}
        onChange={handleEditorChange}
        onMount={editorDidMount}
      />

    </div>
  )
}