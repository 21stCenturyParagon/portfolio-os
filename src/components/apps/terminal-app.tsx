'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';

interface Command {
  input: string;
  output: string;
}

const COMMANDS = {
  help: `Available commands:
  help     - Show this help message
  about    - Display information about Ahsan Nayaz
  skills   - List technical skills
  projects - Show recent projects
  contact  - Display contact information
  clear    - Clear the terminal
  echo     - Echo back the input
  date     - Show current date and time`,
  
  about: `Ahsan Nayaz - AI Engineer
  
Passionate about developing cutting-edge AI solutions.
Specializing in machine learning, deep learning, and NLP.
5+ years of experience in the field.`,
  
  skills: `Technical Skills:
- Machine Learning & Deep Learning
- Natural Language Processing
- Computer Vision
- Python, TensorFlow, PyTorch
- MLOps & Model Deployment
- Cloud Platforms (AWS, GCP)`,
  
  projects: `Recent Projects:
1. AI-Powered Code Assistant
2. Neural Style Transfer App
3. Sentiment Analysis API
4. Computer Vision Dashboard
5. Chatbot Framework`,
  
  contact: `Contact Information:
Email: ahsan@example.com
LinkedIn: linkedin.com/in/ahsannayaz
GitHub: github.com/ahsannayaz
Location: San Francisco, CA`,
  
  date: () => new Date().toString(),
  echo: (args: string[]) => args.join(' '),
};

export default function TerminalApp() {
  const [commands, setCommands] = useState<Command[]>([
    { input: '', output: 'Welcome to Portfolio OS Terminal v1.0\nType "help" for available commands.\n' }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);
  
  const executeCommand = (input: string) => {
    const trimmedInput = input.trim();
    const [command, ...args] = trimmedInput.split(' ');
    
    let output = '';
    
    if (command === 'clear') {
      setCommands([]);
      setCurrentInput('');
      return;
    }
    
    if (command in COMMANDS) {
      const cmd = COMMANDS[command as keyof typeof COMMANDS];
      if (typeof cmd === 'function') {
        output = cmd(args);
      } else {
        output = cmd;
      }
    } else if (trimmedInput === '') {
      output = '';
    } else {
      output = `Command not found: ${command}\nType "help" for available commands.`;
    }
    
    setCommands([...commands, { input: trimmedInput, output }]);
    setCurrentInput('');
    setHistoryIndex(-1);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commandHistory = commands.filter(cmd => cmd.input).map(cmd => cmd.input);
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const commandHistory = commands.filter(cmd => cmd.input).map(cmd => cmd.input);
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
  };
  
  return (
    <div className="h-full bg-black text-green-400 font-mono p-4 flex flex-col">
      <div
        ref={terminalRef}
        className="flex-1 overflow-auto mb-2 scrollbar-minimal"
        onClick={() => inputRef.current?.focus()}
      >
        {commands.map((cmd, index) => (
          <div key={index} className="mb-2">
            {cmd.input && (
              <div className="flex items-center gap-2">
                <span className="text-blue-400">portfolio-os</span>
                <span className="text-gray-400">$</span>
                <span>{cmd.input}</span>
              </div>
            )}
            {cmd.output && (
              <div className="whitespace-pre-wrap text-gray-300">{cmd.output}</div>
            )}
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-blue-400">portfolio-os</span>
        <span className="text-gray-400">$</span>
        <Input
          ref={inputRef}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none text-green-400 focus:ring-0 focus:outline-none p-0"
          placeholder="Type a command..."
          autoFocus
        />
      </div>
    </div>
  );
} 