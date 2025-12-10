import { log } from "../index";

interface GeneratedArticle {
  title: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  readingTime: number;
}

const ARTICLE_TOPICS = [
  { category: "Technology", topics: ["artificial intelligence", "cloud computing", "cybersecurity", "blockchain", "software development", "quantum computing", "edge computing", "5G networks"] },
  { category: "Science", topics: ["space exploration", "climate science", "biotechnology", "renewable energy", "neuroscience", "particle physics", "genetics", "marine biology"] },
  { category: "Innovation", topics: ["startup ecosystem", "sustainable technology", "smart cities", "digital transformation", "automation", "internet of things", "robotics", "augmented reality"] },
  { category: "Business", topics: ["future of work", "digital marketing", "e-commerce trends", "venture capital", "remote collaboration", "business analytics", "supply chain innovation", "fintech"] },
  { category: "Health", topics: ["personalized medicine", "mental health technology", "telemedicine", "wearable health devices", "genomic medicine", "health data analytics", "drug discovery", "preventive healthcare"] },
];

const TAG_POOL = {
  Technology: ["AI", "Machine Learning", "Cloud", "DevOps", "Security", "Data", "APIs", "Programming", "Infrastructure", "Automation"],
  Science: ["Research", "Discovery", "Environment", "Physics", "Biology", "Chemistry", "Space", "Climate", "Innovation", "Sustainability"],
  Innovation: ["Startups", "Disruption", "Future Tech", "Smart Solutions", "IoT", "Digital", "Transformation", "Trends", "Emerging Tech", "R&D"],
  Business: ["Strategy", "Growth", "Leadership", "Analytics", "Finance", "Marketing", "Enterprise", "Productivity", "Remote Work", "E-commerce"],
  Health: ["Wellness", "Medical Tech", "Healthcare", "Biotech", "Fitness", "Mental Health", "Diagnostics", "Treatment", "Prevention", "Research"],
};

function getRandomTopic(): { category: string; topic: string } {
  const categoryData = ARTICLE_TOPICS[Math.floor(Math.random() * ARTICLE_TOPICS.length)];
  const topic = categoryData.topics[Math.floor(Math.random() * categoryData.topics.length)];
  return { category: categoryData.category, topic };
}

function getRandomTags(category: string, count: number = 3): string[] {
  const categoryTags = TAG_POOL[category as keyof typeof TAG_POOL] || TAG_POOL.Technology;
  const shuffled = [...categoryTags].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

async function generateWithHuggingFace(prompt: string): Promise<string> {
  // Use the correct HuggingFace router API endpoint for chat completions
  const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
  
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!apiKey) {
    throw new Error("HuggingFace API key is required for AI generation");
  }
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${apiKey}`,
  };
  
  try {
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [
          { role: "user", content: prompt }
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HuggingFace API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data?.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    }
    
    throw new Error("Unexpected response format from HuggingFace API");
  } catch (error) {
    log(`HuggingFace API error: ${error}`, "ai");
    throw error;
  }
}

function generateFallbackArticle(topic: string, category: string): GeneratedArticle {
  const templates = [
    {
      titlePattern: `The Future of ${topic}: Trends and Insights for ${new Date().getFullYear()}`,
      content: `In today's rapidly evolving landscape, ${topic} stands at the forefront of innovation and change. As we navigate through ${new Date().getFullYear()}, several key developments are reshaping how we understand and implement ${topic} across various industries.

The transformation we're witnessing in ${topic} is unprecedented. Organizations worldwide are recognizing the potential of these advancements to drive efficiency, improve outcomes, and create new possibilities. From startups to enterprise corporations, the adoption of ${topic} solutions continues to accelerate.

One of the most significant trends in ${topic} is the increasing focus on sustainability and responsible implementation. Leaders in the field are prioritizing approaches that balance innovation with ethical considerations, ensuring that progress benefits society as a whole.

The integration of ${topic} with other emerging technologies is creating powerful synergies. These combinations are opening doors to applications that were previously unimaginable, enabling solutions that address complex challenges across healthcare, education, finance, and environmental protection.

Looking ahead, experts predict that ${topic} will continue to evolve at a rapid pace. The convergence of research, development, and practical application is creating a virtuous cycle of innovation. Organizations that embrace these changes early will be better positioned to thrive in an increasingly competitive landscape.

Investment in ${topic} has reached record levels, with both public and private sectors committing substantial resources to research and development. This influx of capital is accelerating the pace of discovery and bringing transformative solutions to market faster than ever before.

The workforce implications of ${topic} are significant. New roles are emerging that require specialized skills, while traditional positions are being augmented with advanced capabilities. Education and training programs are adapting to prepare the next generation of professionals for this evolving landscape.

Collaboration across borders and disciplines is proving essential for advancing ${topic}. International partnerships and cross-functional teams are tackling challenges that no single organization could address alone, demonstrating the power of collective effort in driving innovation.

As we look to the future, the potential of ${topic} to transform our world remains immense. While challenges exist, the momentum behind these developments suggests that the coming years will bring remarkable progress and unprecedented opportunities for those prepared to embrace change.`,
    },
    {
      titlePattern: `Understanding ${topic}: A Comprehensive Guide`,
      content: `${topic} has emerged as one of the most important areas of focus in the ${category.toLowerCase()} sector. This comprehensive exploration examines the key aspects, challenges, and opportunities that define this dynamic field.

At its core, ${topic} represents a fundamental shift in how we approach problem-solving and innovation. The principles underlying ${topic} have been refined over decades of research and practical application, leading to frameworks that are both robust and adaptable.

The applications of ${topic} span a remarkable range of domains. From improving operational efficiency to enabling entirely new products and services, the versatility of these approaches continues to surprise even seasoned observers. Industries that were once considered immune to disruption are now being transformed.

Understanding the technical foundations of ${topic} is essential for anyone seeking to leverage its potential. While the complexity can be daunting, the fundamental concepts are accessible to those willing to invest the time in learning. Resources for education and training have never been more abundant.

The ecosystem surrounding ${topic} has matured significantly in recent years. A rich network of vendors, consultants, researchers, and practitioners has emerged, creating a vibrant community that drives continuous improvement and innovation.

Challenges remain in the widespread adoption of ${topic}. Issues of cost, complexity, and skills availability continue to present barriers for many organizations. However, these obstacles are gradually being overcome as the technology matures and best practices become established.

The regulatory landscape for ${topic} is evolving rapidly. Policymakers are working to create frameworks that encourage innovation while protecting the interests of consumers and society. Navigating this environment requires awareness and adaptability.

Success stories from early adopters of ${topic} provide valuable lessons for those embarking on their own journeys. Common themes include the importance of leadership commitment, the value of starting with focused pilot projects, and the need for ongoing learning and adaptation.

The future trajectory of ${topic} points toward even greater integration with daily life and business operations. As capabilities expand and barriers to adoption decrease, the transformative potential of these approaches will be realized across ever-wider domains of human activity.`,
    },
  ];

  const template = templates[Math.floor(Math.random() * templates.length)];
  const title = template.titlePattern;
  const content = template.content;
  const summary = `An in-depth exploration of ${topic} and its impact on the ${category.toLowerCase()} landscape, examining current trends, challenges, and future opportunities.`;
  const tags = getRandomTags(category, 3);

  return {
    title,
    summary,
    content,
    category,
    tags,
    readingTime: calculateReadingTime(content),
  };
}

export async function generateArticle(): Promise<GeneratedArticle> {
  const { category, topic } = getRandomTopic();
  
  log(`Generating article about: ${topic} (${category})`, "ai");

  const prompt = `Write a professional blog article about "${topic}" in the ${category} sector.

Requirements:
- Title should be engaging and SEO-friendly
- Include 6-8 paragraphs of substantive content
- Be informative and well-structured
- Write in a professional but accessible tone

Format your response as:
TITLE: [Your title here]
SUMMARY: [A 1-2 sentence summary]
CONTENT:
[Your article content here]`;

  try {
    const response = await generateWithHuggingFace(prompt);
    
    // Try to parse the response
    const titleMatch = response.match(/TITLE:\s*(.+?)(?=\n|SUMMARY:)/i);
    const summaryMatch = response.match(/SUMMARY:\s*(.+?)(?=\n|CONTENT:)/is);
    const contentMatch = response.match(/CONTENT:\s*([\s\S]+)/i);

    if (titleMatch && summaryMatch && contentMatch) {
      const title = titleMatch[1].trim();
      const summary = summaryMatch[1].trim();
      const content = contentMatch[1].trim();
      const tags = getRandomTags(category, 3);

      return {
        title,
        summary,
        content,
        category,
        tags,
        readingTime: calculateReadingTime(content),
      };
    }

    log("Could not parse AI response, using fallback", "ai");
    return generateFallbackArticle(topic, category);
  } catch (error) {
    log(`AI generation failed, using fallback: ${error}`, "ai");
    return generateFallbackArticle(topic, category);
  }
}

export function getAIModelName(): string {
  return "HuggingFace";
}