'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, Linkedin, Twitter, Mail, ExternalLink } from 'lucide-react';

export default function AboutApp() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              AN
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">Ahsan Nayaz</h1>
              <p className="text-xl text-muted-foreground mb-4">AI Engineer</p>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" asChild>
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href="mailto:ahsan@example.com">
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Card>
        
        {/* About Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">About Me</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              I am a passionate AI Engineer with expertise in developing cutting-edge artificial intelligence solutions. 
              My work focuses on leveraging machine learning, deep learning, and natural language processing to solve 
              complex real-world problems.
            </p>
            <p>
              With a strong foundation in computer science and mathematics, I specialize in building scalable AI systems, 
              from conceptualization to deployment. I'm particularly interested in the intersection of AI and human-computer 
              interaction, creating intelligent systems that enhance human capabilities.
            </p>
            <p>
              When I'm not training models or optimizing algorithms, you can find me exploring the latest AI research papers, 
              contributing to open-source projects, or sharing my knowledge through technical writing and speaking engagements.
            </p>
          </div>
        </Card>
        
        {/* Quick Stats */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Quick Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">5+</div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">20+</div>
              <div className="text-sm text-muted-foreground">AI Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">15+</div>
              <div className="text-sm text-muted-foreground">Publications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </Card>
        
        {/* Interests */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Interests</h2>
          <div className="flex flex-wrap gap-2">
            {[
              'Machine Learning',
              'Deep Learning',
              'Natural Language Processing',
              'Computer Vision',
              'Reinforcement Learning',
              'AI Ethics',
              'Edge AI',
              'MLOps',
              'Generative AI',
              'Robotics',
            ].map((interest) => (
              <span
                key={interest}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
} 