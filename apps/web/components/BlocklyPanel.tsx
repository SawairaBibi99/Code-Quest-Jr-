'use client';
import { useEffect, useRef, useState } from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import 'blockly/python';
export default function BlocklyPanel() {
  const divRef = useRef<HTMLDivElement>(null);
  const [python, setPython] = useState('');
  useEffect(() => {
    if (!divRef.current) return;
    const workspace = Blockly.inject(divRef.current, {
      toolbox: {
        kind: 'flyoutToolbox',
        contents: [
          { kind: 'block', type: 'controls_repeat_ext' },
          { kind: 'block', type: 'controls_if' },
          { kind: 'block', type: 'math_number', fields: { NUM: 3 } },
          { kind: 'block', type: 'text' },
          { kind: 'block', type: 'variables_set' }
        ]
      }
    });
    const onChange = () => {
      const code = (Blockly as any).Python.workspaceToCode(workspace);
      setPython(code || '# Start building blocks → Python appears here');
    };
    workspace.addChangeListener(onChange);
    return () => workspace.dispose();
  }, []);
  return (
    <div className="grid grid-rows-[1fr_auto] h-[480px]">
      <div ref={divRef} className="min-h-0" />
      <pre className="bg-slate-900 text-slate-50 p-3 rounded-b-puffy overflow-auto text-xs">{python}</pre>
    </div>
  );
}
