import Split from 'react-split'
import './App.css'
import Renderer from './Renderer'
import Editor from './Editor'
import { useState } from 'react'
import { Modal } from 'react-bootstrap'

const defaultVertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}`;

const defaultFragmentShader = `
uniform float time;
uniform vec2 resolution;
uniform float frame;
uniform vec2 mouse;
varying vec2 vUv;
void main() {
    vec2 p = (2.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
    vec3 col = 0.5 + 0.5 * cos(time + p.xyx + vec3(0, 2, 4));
    gl_FragColor = vec4(col, 1.0);
}`;

function App() {
  const [vertexShader, setVertexShader] = useState<string>(defaultVertexShader);
  const [fragmentShader, setFragmentShader] = useState<string>(defaultFragmentShader);
  const [showAbout, setShowAbout] = useState<boolean>(false);

  const handleCodeChange = (file: string, code: string) => {
    if (file === 'vertex.glsl') {
      setVertexShader(code);
    } else {
      setFragmentShader(code);
    }
  };

  const handleMenuItemClick = (menu: string, item: string) => {
    switch (menu) {
      case 'file':

        if (item === 'new') {
          // File -> New
          setVertexShader('');
          setFragmentShader('');
        } else if (item === 'save') {
          // File -> Save
          const vertexBlob = new Blob([vertexShader], { type: 'text/plain' });
          const fragmentBlob = new Blob([fragmentShader], { type: 'text/plain' });
          const vertexUrl = URL.createObjectURL(vertexBlob);
          const fragmentUrl = URL.createObjectURL(fragmentBlob);
          const vertexLink = document.createElement('a');
          const fragmentLink = document.createElement('a');
          vertexLink.href = vertexUrl;
          fragmentLink.href = fragmentUrl;
          vertexLink.download = 'vertex.glsl';
          fragmentLink.download = 'fragment.glsl';
          vertexLink.click();
          fragmentLink.click();
          URL.revokeObjectURL(vertexUrl);
          URL.revokeObjectURL(fragmentUrl);
        }
        break;
      case 'view':
        if (item === 'fullscreen') {
          // View -> Fullscreen
          const app = document.getElementById('app');
          if (app) {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              app.requestFullscreen();
            }
          }
        }
        break;
      case 'help':
        if (item === 'about') {
          // Help -> About
          setShowAbout(true);
        }
        break;
    }
  };

  return (
    <div id="app">
      <Split
        direction="vertical"
        cursor="row-resize"
        style={{ height: `100%`, display: 'flex', flexDirection: 'column' }}
        sizes={[50, 50]} // Initial size of each pane in percentage
        minSize={100} // Minimum size in pixels
        gutterSize={5} // Size of the gutter in pixels
        gutterAlign='center'
        gutterStyle={() => ({
          backgroundColor: 'rgb(128, 128, 128)',
          borderTop: '1px solid rgba(255, 255, 255, 0.75)',
          borderBottom: '1px solid rgba(200, 200, 200, 0.75)',
          height: '2px',
          cursor: 'row-resize',
        })}
      >
        <div id="renderer-container">
          <Renderer vertexShader={vertexShader} fragmentShader={fragmentShader} />
        </div>
        <div id="editor-container">
          <Editor onCodeChange={handleCodeChange}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            onMenuItemClick={handleMenuItemClick}
          />
        </div>
      </Split>
      <Modal show={showAbout} onHide={() => setShowAbout(false)} centered={true}>
        <Modal.Body className='modal-body'>
          <p><img src="/favicon-32x32.png" /></p>
          <p>Neydır: A shader thing v0.1</p>
          <p>Talha Orak</p>
          <a href="https://github.com/talhaorak/neydir">Github</a>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default App
