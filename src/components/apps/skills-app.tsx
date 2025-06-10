'use client';

import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Briefcase, GraduationCap, Award } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  category: string;
}

const skills: Skill[] = [
  // AI/ML Skills
  { name: 'Machine Learning', level: 95, category: 'AI/ML' },
  { name: 'Deep Learning', level: 90, category: 'AI/ML' },
  { name: 'Natural Language Processing', level: 85, category: 'AI/ML' },
  { name: 'Computer Vision', level: 80, category: 'AI/ML' },
  { name: 'Reinforcement Learning', level: 75, category: 'AI/ML' },
  
  // Programming
  { name: 'Python', level: 95, category: 'Programming' },
  { name: 'JavaScript/TypeScript', level: 85, category: 'Programming' },
  { name: 'C++', level: 70, category: 'Programming' },
  { name: 'SQL', level: 80, category: 'Programming' },
  
  // Frameworks & Tools
  { name: 'TensorFlow', level: 90, category: 'Frameworks' },
  { name: 'PyTorch', level: 85, category: 'Frameworks' },
  { name: 'Scikit-learn', level: 90, category: 'Frameworks' },
  { name: 'Keras', level: 85, category: 'Frameworks' },
  { name: 'Docker', level: 80, category: 'Tools' },
  { name: 'Kubernetes', level: 75, category: 'Tools' },
];

const experience = [
  {
    title: 'Senior AI Engineer',
    company: 'Tech Innovations Inc.',
    period: '2022 - Present',
    description: 'Leading AI initiatives and developing cutting-edge ML solutions for enterprise clients.',
    achievements: [
      'Developed a real-time fraud detection system reducing false positives by 40%',
      'Led a team of 5 engineers in implementing MLOps practices',
      'Architected scalable AI infrastructure handling 1M+ predictions daily',
    ],
  },
  {
    title: 'Machine Learning Engineer',
    company: 'AI Solutions Ltd.',
    period: '2020 - 2022',
    description: 'Built and deployed machine learning models for various business applications.',
    achievements: [
      'Implemented NLP pipeline for customer sentiment analysis',
      'Reduced model training time by 60% through optimization',
      'Published 3 research papers on deep learning applications',
    ],
  },
  {
    title: 'AI Research Assistant',
    company: 'University Research Lab',
    period: '2018 - 2020',
    description: 'Conducted research in computer vision and deep learning applications.',
    achievements: [
      'Co-authored 5 peer-reviewed publications',
      'Developed novel architecture for image segmentation',
      'Presented research at 2 international conferences',
    ],
  },
];

const education = [
  {
    degree: 'Master of Science in Artificial Intelligence',
    institution: 'Stanford University',
    period: '2018 - 2020',
    gpa: '3.9/4.0',
  },
  {
    degree: 'Bachelor of Science in Computer Science',
    institution: 'MIT',
    period: '2014 - 2018',
    gpa: '3.8/4.0',
  },
];

const certifications = [
  'TensorFlow Developer Certificate',
  'AWS Certified Machine Learning - Specialty',
  'Google Cloud Professional ML Engineer',
  'Deep Learning Specialization (Coursera)',
];

export default function SkillsApp() {
  const skillCategories = [...new Set(skills.map(s => s.category))];
  
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-6">Skills & Experience</h1>
        
        {/* Skills Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Award className="h-6 w-6" />
            Technical Skills
          </h2>
          <div className="space-y-6">
            {skillCategories.map((category) => (
              <div key={category}>
                <h3 className="text-lg font-medium mb-3">{category}</h3>
                <div className="space-y-3">
                  {skills
                    .filter((skill) => skill.category === category)
                    .map((skill) => (
                      <div key={skill.name} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{skill.name}</span>
                          <span className="text-muted-foreground">{skill.level}%</span>
                        </div>
                        <Progress value={skill.level} className="h-2" />
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Experience Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-primary/20 pl-4">
                <h3 className="text-lg font-semibold">{exp.title}</h3>
                <p className="text-sm text-muted-foreground mb-1">
                  {exp.company} • {exp.period}
                </p>
                <p className="text-sm mb-2">{exp.description}</p>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Education Section */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <GraduationCap className="h-6 w-6" />
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold">{edu.degree}</h3>
                <p className="text-sm text-muted-foreground">
                  {edu.institution} • {edu.period}
                </p>
                <p className="text-sm">GPA: {edu.gpa}</p>
              </div>
            ))}
          </div>
        </Card>
        
        {/* Certifications */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
              >
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm">{cert}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
} 