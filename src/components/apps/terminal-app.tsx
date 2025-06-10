'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Command {
  input: string;
  output: string | React.ReactNode;
  directory: string;
}

interface FileSystemItem {
  type: 'file' | 'directory';
  name: string;
  content?: string;
  children?: { [key: string]: FileSystemItem };
  permissions?: string;
  owner?: string;
  size?: number;
  modified?: Date;
}

// Virtual file system
const fileSystem: FileSystemItem = {
  type: 'directory',
  name: '/',
  children: {
    home: {
      type: 'directory',
      name: 'home',
      children: {
        ahsan: {
          type: 'directory',
          name: 'ahsan',
          children: {
            '.bashrc': {
              type: 'file',
              name: '.bashrc',
              content: '# Portfolio OS bash configuration\nexport PS1="\\u@portfolio-os:\\w\\$ "\nalias ll="ls -la"\nalias cls="clear"',
              size: 256,
              modified: new Date('2024-01-01')
            },
            'readme.txt': {
              type: 'file',
              name: 'readme.txt',
              content: 'Welcome to my Portfolio OS!\n\nThis is a simulated terminal environment showcasing my skills and projects.\nFeel free to explore using standard Unix commands.\n\nFor a list of available commands, type "help".',
              size: 215,
              modified: new Date('2024-12-01')
            },
            projects: {
              type: 'directory',
              name: 'projects',
              children: {
                'ai-assistant.md': {
                  type: 'file',
                  name: 'ai-assistant.md',
                  content: '# AI Code Assistant\n\nAn intelligent coding assistant powered by GPT-4.\n\n## Features\n- Code completion\n- Bug detection\n- Refactoring suggestions\n- Documentation generation\n\n## Tech Stack\n- Python\n- OpenAI API\n- FastAPI\n- React',
                  size: 512,
                  modified: new Date('2024-11-15')
                },
                'neural-style.md': {
                  type: 'file',
                  name: 'neural-style.md',
                  content: '# Neural Style Transfer\n\nDeep learning application for artistic style transfer.\n\n## Features\n- Real-time style transfer\n- Multiple artistic styles\n- Custom style training\n\n## Tech Stack\n- PyTorch\n- Flask\n- React\n- Docker',
                  size: 489,
                  modified: new Date('2024-10-20')
                }
              }
            },
            skills: {
              type: 'directory',
              name: 'skills',
              children: {
                'languages.txt': {
                  type: 'file',
                  name: 'languages.txt',
                  content: 'Programming Languages:\n- Python (Expert)\n- JavaScript/TypeScript (Advanced)\n- Go (Intermediate)\n- Rust (Learning)\n- SQL (Advanced)',
                  size: 256,
                  modified: new Date('2024-12-10')
                },
                'frameworks.txt': {
                  type: 'file',
                  name: 'frameworks.txt',
                  content: 'Frameworks & Libraries:\n- TensorFlow/PyTorch\n- React/Next.js\n- FastAPI/Django\n- Docker/Kubernetes\n- Apache Spark',
                  size: 312,
                  modified: new Date('2024-12-10')
                }
              }
            }
          }
        }
      }
    },
    etc: {
      type: 'directory',
      name: 'etc',
      children: {
        'motd': {
          type: 'file',
          name: 'motd',
          content: '\n _____           _    __       _ _         _____ _____ \n|  __ \\         | |  / _|     | (_)       |  _  /  ___|  \n| |__) |__  _ __| |_| |_ ___  | |_  ___   | | | \\ `--. \n|  ___/ _ \\| \'__| __|  _/ _ \\ | | |/ _ \\  | | | |`--. \\\n| |  | (_) | |  | |_| || (_) || | | (_) | \\ \\_/ /\\__/ /\n|_|   \\___/|_|   \\__|_| \\___/ |_|_|\\___/   \\___/\\____/ \n\nWelcome to Portfolio OS v1.0\n',
          size: 512,
          modified: new Date('2024-01-01')
        }
      }
    },
    usr: {
      type: 'directory',
      name: 'usr',
      children: {
        bin: {
          type: 'directory',
          name: 'bin',
          children: {}
        }
      }
    }
  }
};

export default function TerminalApp() {
  const [commands, setCommands] = useState<Command[]>([
    { 
      input: '', 
      output: (
        <div className="text-gray-300">
          <pre className="text-green-400 text-xs mb-2">
{` _____           _    __       _ _         _____ _____ 
|  __ \\         | |  / _|     | (_)       |  _  /  ___|  
| |__) |__  _ __| |_| |_ ___  | |_  ___   | | | \\ \`--. 
|  ___/ _ \\| '__| __|  _/ _ \\ | | |/ _ \\  | | | |\`--. \\
| |  | (_) | |  | |_| || (_) || | | (_) | \\ \\_/ /\\__/ /
|_|   \\___/|_|   \\__|_| \\___/ |_|_|\\___/   \\___/\\____/ `}
          </pre>
          <div>Welcome to Portfolio OS Terminal v1.0</div>
          <div>Type <span className="text-yellow-400">"help"</span> for available commands.</div>
        </div>
      ),
      directory: '/home/ahsan' 
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentDirectory, setCurrentDirectory] = useState('/home/ahsan');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tabCompletionIndex, setTabCompletionIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [commands]);

  // Navigate file system
  const navigateToPath = (path: string): FileSystemItem | null => {
    if (path === '/') {
      return fileSystem;
    }
    
    const parts = path.split('/').filter(p => p);
    let current = fileSystem;
    
    for (const part of parts) {
      if (current.type === 'directory' && current.children && part in current.children) {
        current = current.children[part];
      } else {
        return null;
      }
    }
    
    return current;
  };

  // Resolve relative paths
  const resolvePath = (path: string): string => {
    if (path.startsWith('/')) {
      return path;
    }
    
    const parts = currentDirectory.split('/').filter(p => p);
    const pathParts = path.split('/');
    
    for (const part of pathParts) {
      if (part === '..') {
        parts.pop();
      } else if (part === '.' || part === '') {
        // Skip
      } else {
        parts.push(part);
      }
    }
    
    return '/' + parts.join('/');
  };

  // Format file size
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'K';
    return (bytes / (1024 * 1024)).toFixed(1) + 'M';
  };

  // Format date
  const formatDate = (date: Date): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, ' ')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // Command implementations
  const commandImplementations = {
    help: () => (
      <div className="text-gray-300">
        <div className="mb-2 text-green-400">Available commands:</div>
        <div className="grid grid-cols-2 gap-x-8">
          <div><span className="text-yellow-400">help</span> - Show this help message</div>
          <div><span className="text-yellow-400">clear</span> - Clear the terminal</div>
          <div><span className="text-yellow-400">pwd</span> - Print working directory</div>
          <div><span className="text-yellow-400">ls</span> - List directory contents</div>
          <div><span className="text-yellow-400">cd</span> - Change directory</div>
          <div><span className="text-yellow-400">cat</span> - Display file contents</div>
          <div><span className="text-yellow-400">echo</span> - Display a line of text</div>
          <div><span className="text-yellow-400">whoami</span> - Display current user</div>
          <div><span className="text-yellow-400">date</span> - Display current date</div>
          <div><span className="text-yellow-400">uname</span> - Display system information</div>
          <div><span className="text-yellow-400">tree</span> - Display directory tree</div>
          <div><span className="text-yellow-400">history</span> - Show command history</div>
          <div><span className="text-yellow-400">about</span> - About Ahsan Nayaz</div>
          <div><span className="text-yellow-400">contact</span> - Contact information</div>
        </div>
        <div className="mt-2 text-sm text-gray-400">
          Use TAB for command/path completion. Use ↑/↓ to navigate history.
        </div>
      </div>
    ),
    
    pwd: () => currentDirectory,
    
    whoami: () => 'ahsan',
    
    date: () => new Date().toString(),
    
    uname: (args: string[]) => {
      if (args.includes('-a')) {
        return 'PortfolioOS 1.0.0 portfolio-kernel 6.5.0-portfolio x86_64 GNU/Linux';
      }
      return 'PortfolioOS';
    },
    
    echo: (args: string[]) => args.join(' '),
    
    ls: (args: string[]) => {
      const showHidden = args.includes('-a') || args.includes('-la');
      const longFormat = args.includes('-l') || args.includes('-la');
      const targetPath = args.find(arg => !arg.startsWith('-')) || '.';
      const resolvedPath = resolvePath(targetPath);
      const target = navigateToPath(resolvedPath);
      
      if (!target) {
        return <span className="text-red-400">ls: cannot access '{targetPath}': No such file or directory</span>;
      }
      
      if (target.type === 'file') {
        return target.name;
      }
      
      if (!target.children) {
        return '';
      }
      
      const items = Object.entries(target.children)
        .filter(([name]) => showHidden || !name.startsWith('.'))
        .sort(([a], [b]) => a.localeCompare(b));
      
      if (longFormat) {
        return (
          <div className="font-mono text-sm">
            <div className="text-gray-400 mb-1">total {items.length}</div>
            {items.map(([name, item]) => (
              <div key={name} className="flex gap-4">
                <span className="text-gray-400">
                  {item.type === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--'}
                </span>
                <span className="text-gray-400">ahsan</span>
                <span className="text-gray-400 w-12 text-right">
                  {item.size ? formatSize(item.size) : '4.0K'}
                </span>
                <span className="text-gray-400">
                  {item.modified ? formatDate(item.modified) : 'Dec 15 12:00'}
                </span>
                <span className={item.type === 'directory' ? 'text-blue-400' : 'text-gray-300'}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        );
      }
      
      return (
        <div className="flex flex-wrap gap-4">
          {items.map(([name, item]) => (
            <span
              key={name}
              className={item.type === 'directory' ? 'text-blue-400' : 'text-gray-300'}
            >
              {name}
            </span>
          ))}
        </div>
      );
    },
    
    cd: (args: string[]) => {
      if (args.length === 0 || args[0] === '~') {
        setCurrentDirectory('/home/ahsan');
        return '';
      }
      
      const targetPath = args[0];
      const resolvedPath = resolvePath(targetPath);
      const target = navigateToPath(resolvedPath);
      
      if (!target) {
        return <span className="text-red-400">cd: {targetPath}: No such file or directory</span>;
      }
      
      if (target.type !== 'directory') {
        return <span className="text-red-400">cd: {targetPath}: Not a directory</span>;
      }
      
      setCurrentDirectory(resolvedPath);
      return '';
    },
    
    cat: (args: string[]) => {
      if (args.length === 0) {
        return <span className="text-red-400">cat: missing operand</span>;
      }
      
      const results = args.map(arg => {
        const resolvedPath = resolvePath(arg);
        const target = navigateToPath(resolvedPath);
        
        if (!target) {
          return <span className="text-red-400">cat: {arg}: No such file or directory</span>;
        }
        
        if (target.type === 'directory') {
          return <span className="text-red-400">cat: {arg}: Is a directory</span>;
        }
        
        return target.content || '';
      });
      
      return <div>{results.map((r, i) => <div key={i}>{r}</div>)}</div>;
    },
    
    tree: (args: string[]) => {
      const targetPath = args[0] || '.';
      const resolvedPath = resolvePath(targetPath);
      const target = navigateToPath(resolvedPath);
      
      if (!target) {
        return <span className="text-red-400">tree: {targetPath}: No such file or directory</span>;
      }
      
      const renderTree = (item: FileSystemItem, prefix = '', isLast = true): React.ReactNode => {
        const connector = isLast ? '└── ' : '├── ';
        const extension = isLast ? '    ' : '│   ';
        
        const result: React.ReactNode[] = [];
        
        if (item.type === 'directory' && item.children) {
          const children = Object.entries(item.children);
          children.forEach(([name, child], index) => {
            const isLastChild = index === children.length - 1;
            result.push(
              <div key={name}>
                <span className="text-gray-400">{prefix}{connector}</span>
                <span className={child.type === 'directory' ? 'text-blue-400' : 'text-gray-300'}>
                  {name}
                </span>
                {child.type === 'directory' && child.children && 
                  renderTree(child, prefix + extension, isLastChild)}
              </div>
            );
          });
        }
        
        return result;
      };
      
      return (
        <div className="font-mono text-sm">
          <div className="text-blue-400">{target.name}</div>
          {renderTree(target)}
        </div>
      );
    },
    
    history: () => {
      const commandHistory = commands.filter(cmd => cmd.input).map((cmd, i) => ({
        index: i + 1,
        command: cmd.input
      }));
      
      return (
        <div>
          {commandHistory.map(({ index, command }) => (
            <div key={index} className="text-gray-300">
              <span className="text-gray-400 mr-4">{index.toString().padStart(4, ' ')}</span>
              {command}
            </div>
          ))}
        </div>
      );
    },
    
    about: () => (
      <div className="text-gray-300">
        <div className="text-green-400 text-xl mb-2">Ahsan Nayaz - AI Engineer</div>
        <div className="mb-4">
          Passionate about developing cutting-edge AI solutions that solve real-world problems.
          Specializing in machine learning, deep learning, and natural language processing.
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-yellow-400">Experience</div>
            <div>5+ years in AI/ML</div>
          </div>
          <div>
            <div className="text-yellow-400">Focus Areas</div>
            <div>LLMs, Computer Vision, MLOps</div>
          </div>
          <div>
            <div className="text-yellow-400">Education</div>
            <div>MS Computer Science</div>
          </div>
          <div>
            <div className="text-yellow-400">Location</div>
            <div>San Francisco, CA</div>
          </div>
        </div>
      </div>
    ),
    
    contact: () => (
      <div className="text-gray-300">
        <div className="text-green-400 mb-2">Contact Information</div>
        <div><span className="text-yellow-400">Email:</span> ahsan@example.com</div>
        <div><span className="text-yellow-400">LinkedIn:</span> linkedin.com/in/ahsannayaz</div>
        <div><span className="text-yellow-400">GitHub:</span> github.com/ahsannayaz</div>
        <div><span className="text-yellow-400">Twitter:</span> @ahsannayaz</div>
      </div>
    ),
  };
  
  const executeCommand = (input: string) => {
    const trimmedInput = input.trim();
    const [command, ...args] = trimmedInput.split(' ').filter(s => s);
    
    let output: string | React.ReactNode = '';
    
    if (command === 'clear') {
      setCommands([]);
      setCurrentInput('');
      return;
    }
    
    if (command in commandImplementations) {
      output = commandImplementations[command as keyof typeof commandImplementations](args);
    } else if (trimmedInput === '') {
      output = '';
    } else {
      output = <span className="text-red-400">-bash: {command}: command not found</span>;
    }
    
    setCommands([...commands, { input: trimmedInput, output, directory: currentDirectory }]);
    setCurrentInput('');
    setHistoryIndex(-1);
    setSuggestions([]);
    setTabCompletionIndex(-1);
  };
  
  const handleTabCompletion = useCallback(() => {
    const parts = currentInput.split(' ');
    const isCommand = parts.length === 1;
    const partial = parts[parts.length - 1];
    
    let completions: string[] = [];
    
    if (isCommand) {
      // Complete commands
      completions = Object.keys(commandImplementations).filter(cmd => 
        cmd.startsWith(partial)
      );
    } else {
      // Complete file paths
      const pathParts = partial.split('/');
      const dirPath = pathParts.slice(0, -1).join('/') || '.';
      const filePartial = pathParts[pathParts.length - 1];
      
      const resolvedPath = resolvePath(dirPath);
      const dir = navigateToPath(resolvedPath);
      
      if (dir && dir.type === 'directory' && dir.children) {
        completions = Object.keys(dir.children)
          .filter(name => name.startsWith(filePartial))
          .map(name => {
            const prefix = pathParts.slice(0, -1).join('/');
            return prefix ? `${prefix}/${name}` : name;
          });
      }
    }
    
    if (completions.length === 0) return;
    
    if (completions.length === 1) {
      // Single completion - apply it
      const newParts = [...parts];
      newParts[newParts.length - 1] = completions[0];
      setCurrentInput(newParts.join(' '));
      setSuggestions([]);
      setTabCompletionIndex(-1);
    } else {
      // Multiple completions - cycle through them
      if (tabCompletionIndex === -1) {
        setSuggestions(completions);
      }
      const newIndex = (tabCompletionIndex + 1) % completions.length;
      setTabCompletionIndex(newIndex);
      
      const newParts = [...parts];
      newParts[newParts.length - 1] = completions[newIndex];
      setCurrentInput(newParts.join(' '));
    }
  }, [currentInput, tabCompletionIndex]);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commandHistory = commands.filter(cmd => cmd.input).map(cmd => cmd.input);
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
        setSuggestions([]);
        setTabCompletionIndex(-1);
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
        setSuggestions([]);
        setTabCompletionIndex(-1);
      }
    } else if (e.key !== 'Tab') {
      // Reset tab completion on any other key
      setSuggestions([]);
      setTabCompletionIndex(-1);
    }
  };
  
  const getPrompt = () => {
    const user = 'ahsan';
    const host = 'portfolio-os';
    const dir = currentDirectory === '/home/ahsan' ? '~' : currentDirectory;
    
    return (
      <>
        <span className="text-green-400">{user}@{host}</span>
        <span className="text-gray-400">:</span>
        <span className="text-blue-400">{dir}</span>
        <span className="text-gray-400">$ </span>
      </>
    );
  };
  
  return (
    <div 
      className="h-full bg-black text-gray-300 p-4 flex flex-col"
      style={{ fontFamily: '"Cascadia Code", "Fira Code", "Consolas", "Monaco", monospace' }}
    >
      <div
        ref={terminalRef}
        className="flex-1 overflow-auto mb-2 text-sm leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {commands.map((cmd, index) => (
          <div key={index} className="mb-1">
            {cmd.input !== '' && (
              <div className="flex items-start">
                {getPrompt()}
                <span className="text-gray-300">{cmd.input}</span>
              </div>
            )}
            {cmd.output && (
              <div className="ml-0">{cmd.output}</div>
            )}
          </div>
        ))}
        
        {suggestions.length > 1 && (
          <div className="mt-2 mb-2 flex flex-wrap gap-4 text-sm">
            {suggestions.map((sug, i) => (
              <span 
                key={sug} 
                className={i === tabCompletionIndex ? 'text-yellow-400' : 'text-gray-400'}
              >
                {sug}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-start">
        {getPrompt()}
        <input
          ref={inputRef}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none text-gray-300 focus:ring-0 focus:outline-none"
          style={{ fontFamily: 'inherit' }}
          spellCheck={false}
          autoComplete="off"
          autoFocus
        />
      </div>
    </div>
  );
} 