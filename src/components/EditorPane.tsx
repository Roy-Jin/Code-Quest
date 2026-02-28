import React, { useEffect, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { AlertCircle, CheckCircle2, History, Terminal, Code2, X } from 'lucide-react';
import { TooltipButton } from './TooltipButton';
import { LevelConfig } from '../types';
import { COMMAND_REGISTRY } from '../config';
import { useStore } from '../context/StoreContext';

interface EditorPaneProps {
  t: any;
  levelConfig: LevelConfig;
  code: string;
  setCode: (code: string) => void;
  onSave?: (code: string) => void;
  isRunning: boolean;
  resetCode: () => void;
  error: string | null;
  isSuccess: boolean;
  logs: string[];
  hasNextLevel: boolean;
  goToNextLevel: () => void;
  onClose?: () => void;
}

export function EditorPane({
  t, levelConfig, code, setCode, onSave,
  isRunning, resetCode, error, isSuccess, logs,
  hasNextLevel, goToNextLevel, onClose
}: EditorPaneProps) {
  const { settings } = useStore();
  const monaco = useMonaco();
  const [activeTab, setActiveTab] = useState<'code' | 'console'>('code');

  useEffect(() => {
    if (monaco) {
      // Generate TS definitions based on available commands for the current level
      const tsDefs = levelConfig.availableCommands
        .map(cmdId => COMMAND_REGISTRY[cmdId]?.tsDefinition || '')
        .join('\n');

      const disposable = (monaco.languages.typescript as any).javascriptDefaults.addExtraLib(
        tsDefs,
        'ts:filename/sandbox.d.ts'
      );

      return () => disposable.dispose();
    }
  }, [monaco, levelConfig.availableCommands]);

  // Auto-switch to console on run, error, or success
  useEffect(() => {
    if (isRunning || error || isSuccess) {
      setActiveTab('console');
    }
  }, [isRunning, error, isSuccess]);

  // Auto-switch to code on level change
  useEffect(() => {
    setActiveTab('code');
  }, [levelConfig]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      if (onSave) {
        onSave(editor.getValue());
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 relative z-10 shrink-0">
      {/* Editor Header with Tabs */}
      <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-2 shrink-0">
        <div className="flex h-full">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 h-full border-b-2 transition-colors ${
              activeTab === 'code' 
                ? 'border-cyan-400 text-cyan-400 bg-slate-800/50' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Code2 size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">{t.codeTab}</span>
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`flex items-center gap-2 px-4 h-full border-b-2 transition-colors relative ${
              activeTab === 'console' 
                ? 'border-cyan-400 text-cyan-400 bg-slate-800/50' 
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Terminal size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">{t.consoleOutput}</span>
            {(error || isSuccess) && activeTab !== 'console' && (
              <span className={`absolute top-2 right-2 w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-emerald-500'}`} />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 px-2">
          {activeTab === 'code' && (
            <TooltipButton
              icon={<History size={14} />}
              tooltip={t.resetCode}
              onClick={resetCode}
              disabled={isRunning}
              tooltipAlign="right"
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md"
            />
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md md:hidden"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Monaco Editor */}
        <div className={`absolute inset-0 ${activeTab === 'code' ? 'block' : 'hidden'}`}>
          <Editor
            height="100%"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || '')}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: settings.minimap },
              fontSize: settings.fontSize,
              wordWrap: settings.wordWrap ? 'on' : 'off',
              readOnly: isRunning,
              padding: { top: 16 },
              scrollBeyondLastLine: true,
              lineNumbers: settings.lineNumbers ? 'on' : 'off',
              lineNumbersMinChars: 3,
              folding: settings.folding,
              cursorBlinking: settings.cursorBlinking,
              cursorStyle: settings.cursorStyle,
              tabSize: settings.tabSize,
              bracketPairColorization: { enabled: settings.bracketPairColorization },
              formatOnType: settings.formatOnType,
              cursorSmoothCaretAnimation: 'on',
            }}
          />
        </div>

        {/* Console Output */}
        <div className={`absolute inset-0 bg-slate-950 flex flex-col ${activeTab === 'console' ? 'block' : 'hidden'}`}>
          <div className="flex-1 p-4 overflow-y-auto font-mono text-sm flex flex-col gap-2 text-slate-300 select-text">
            {error && (
              <div className="flex items-start gap-2 text-red-400 bg-red-950/30 p-3 rounded border border-red-900/50">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span className="break-all">{error}</span>
              </div>
            )}
            {isSuccess && (
              <div className="flex flex-col gap-3 bg-emerald-950/40 p-4 rounded border border-emerald-900/50">
                <div className="flex items-start gap-2 text-emerald-400">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                  <span className="font-semibold">{t.success}</span>
                </div>
                {hasNextLevel && (
                  <button
                    onClick={() => {
                      setActiveTab('code');
                      goToNextLevel();
                    }}
                    className="self-start px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded shadow transition-colors"
                  >
                    {t.nextLevel}
                  </button>
                )}
              </div>
            )}
            {logs.map((log, i) => (
              <div key={i} className="text-slate-300 py-1 border-b border-slate-800/50 last:border-0">
                <span className="text-slate-500 mr-2 select-none">&gt;</span>{log}
              </div>
            ))}
            {!error && !isSuccess && logs.length === 0 && (
              <div className="text-slate-500 italic flex items-center justify-center h-full">
                {t.noOutput}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
