'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Star, GitFork } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  stars?: number;
  forks?: number;
  image?: string;
}

const projects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Code Assistant',
    description: 'An intelligent code completion and suggestion system using transformer models. Supports multiple programming languages and provides context-aware recommendations.',
    technologies: ['Python', 'TensorFlow', 'Transformers', 'FastAPI'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    stars: 245,
    forks: 42,
  },
  {
    id: '2',
    title: 'Neural Style Transfer App',
    description: 'Web application that applies artistic styles to images using deep neural networks. Features real-time processing and multiple style options.',
    technologies: ['PyTorch', 'React', 'Node.js', 'WebGL'],
    githubUrl: 'https://github.com',
    stars: 189,
    forks: 31,
  },
  {
    id: '3',
    title: 'Sentiment Analysis API',
    description: 'RESTful API for analyzing sentiment in text using BERT-based models. Supports multiple languages and provides confidence scores.',
    technologies: ['Python', 'BERT', 'Docker', 'Kubernetes'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    stars: 156,
    forks: 28,
  },
  {
    id: '4',
    title: 'Computer Vision Dashboard',
    description: 'Real-time object detection and tracking system with a modern dashboard interface. Uses YOLO v8 for high-performance detection.',
    technologies: ['Python', 'YOLO', 'OpenCV', 'Streamlit'],
    githubUrl: 'https://github.com',
    stars: 312,
    forks: 67,
  },
  {
    id: '5',
    title: 'Chatbot Framework',
    description: 'Extensible framework for building conversational AI agents. Includes NLU, dialogue management, and integration capabilities.',
    technologies: ['Python', 'Rasa', 'spaCy', 'Redis'],
    githubUrl: 'https://github.com',
    liveUrl: 'https://example.com',
    stars: 423,
    forks: 89,
  },
  {
    id: '6',
    title: 'ML Model Monitor',
    description: 'Production monitoring system for machine learning models. Tracks performance metrics, data drift, and model degradation.',
    technologies: ['Python', 'MLflow', 'Prometheus', 'Grafana'],
    githubUrl: 'https://github.com',
    stars: 178,
    forks: 34,
  },
];

export default function ProjectsApp() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Projects</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedProject(project)}
            >
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="text-xs px-2 py-1 text-muted-foreground">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {project.stars && (
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {project.stars}
                    </div>
                  )}
                  {project.forks && (
                    <div className="flex items-center gap-1">
                      <GitFork className="h-3 w-3" />
                      {project.forks}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Project Detail Modal */}
        {selectedProject && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedProject(null)}
          >
            <Card
              className="max-w-2xl w-full max-h-[80vh] overflow-auto scrollbar-glass"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProject(null)}
                  >
                    ✕
                  </Button>
                </div>
                
                <p className="text-muted-foreground">{selectedProject.description}</p>
                
                <div>
                  <h3 className="font-semibold mb-2">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {selectedProject.githubUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="h-4 w-4 mr-2" />
                        View on GitHub
                      </a>
                    </Button>
                  )}
                  {selectedProject.liveUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 