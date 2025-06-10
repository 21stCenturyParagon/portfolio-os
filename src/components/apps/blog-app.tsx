'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Tag, ChevronRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  featured: boolean;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Understanding Transformer Architecture: A Deep Dive',
    excerpt: 'Explore the revolutionary architecture that powers modern NLP models like GPT and BERT.',
    content: 'Full article content here...',
    date: '2024-01-15',
    readTime: '12 min read',
    tags: ['Deep Learning', 'NLP', 'Transformers'],
    featured: true,
  },
  {
    id: '2',
    title: 'Building Production-Ready ML Pipelines',
    excerpt: 'Learn best practices for deploying machine learning models at scale with proper monitoring.',
    content: 'Full article content here...',
    date: '2024-01-10',
    readTime: '8 min read',
    tags: ['MLOps', 'DevOps', 'Best Practices'],
    featured: false,
  },
  {
    id: '3',
    title: 'The Future of AI: Trends and Predictions for 2024',
    excerpt: 'A comprehensive look at emerging AI technologies and their potential impact.',
    content: 'Full article content here...',
    date: '2024-01-05',
    readTime: '10 min read',
    tags: ['AI Trends', 'Future Tech', 'Industry'],
    featured: true,
  },
  {
    id: '4',
    title: 'Implementing RAG Systems with LangChain',
    excerpt: 'Step-by-step guide to building Retrieval-Augmented Generation systems.',
    content: 'Full article content here...',
    date: '2023-12-28',
    readTime: '15 min read',
    tags: ['LLMs', 'RAG', 'LangChain'],
    featured: false,
  },
  {
    id: '5',
    title: 'Ethics in AI: Navigating Bias and Fairness',
    excerpt: 'Discussing the importance of ethical considerations in AI development.',
    content: 'Full article content here...',
    date: '2023-12-20',
    readTime: '7 min read',
    tags: ['AI Ethics', 'Bias', 'Fairness'],
    featured: false,
  },
];

export default function BlogApp() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  const allTags = [...new Set(blogPosts.flatMap(post => post.tags))];
  const filteredPosts = selectedTag
    ? blogPosts.filter(post => post.tags.includes(selectedTag))
    : blogPosts;
  
  if (selectedPost) {
    return (
      <div className="p-6 h-full overflow-auto">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setSelectedPost(null)}
            className="mb-4"
          >
            ← Back to Articles
          </Button>
          
          <article className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">{selectedPost.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedPost.date).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {selectedPost.readTime}
                </div>
              </div>
              <div className="flex gap-2 mb-6">
                {selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed">{selectedPost.excerpt}</p>
              <p className="mt-6">
                {/* This would be replaced with actual markdown content */}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu 
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </div>
          </article>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Blog & Articles</h1>
        
        {/* Tags Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={selectedTag === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTag(null)}
            >
              All Posts
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Featured Posts */}
        {!selectedTag && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {blogPosts
                .filter((post) => post.featured)
                .map((post) => (
                  <Card
                    key={post.id}
                    className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedPost(post)}
                  >
                    <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <span>{post.readTime}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        )}
        
        {/* All Posts */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {selectedTag ? `Articles tagged with "${selectedTag}"` : 'Recent Articles'}
          </h2>
          <div className="space-y-4">
            {filteredPosts
              .filter((post) => !post.featured || selectedTag)
              .map((post) => (
                <Card
                  key={post.id}
                  className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <span>{post.readTime}</span>
                        <div className="flex gap-1">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-primary">#{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 