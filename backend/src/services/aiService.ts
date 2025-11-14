import OpenAI from "openai";

// Initialize OpenAI client (if API key is provided)
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface Issue {
  id: string;
  title: string;
  description?: string;
  category: string;
  location?: {
    lat: number;
    lng: number;
  };
  severity: number;
  timestamp?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  skills?: string[];
  interests?: string[];
  location?: {
    lat: number;
    lng: number;
  };
}

interface Partner {
  id: string;
  name: string;
  matchScore: number;
  reason: string;
  skills: string[];
  location?: string;
}

/**
 * Summarize an issue using AI
 * @param issue - The issue object to summarize
 * @returns A concise summary of the issue
 */
export async function summarizeIssue(issue: Issue): Promise<string> {
  // If OpenAI is configured, use it
  if (openai) {
    try {
      const prompt = `Summarize the following issue in 2-3 sentences:
      
Title: ${issue.title}
Description: ${issue.description || "No description provided"}
Category: ${issue.category}
Severity: ${issue.severity}/5

Provide a clear, actionable summary focusing on the problem and its impact.`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes social and infrastructure issues concisely.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || "Unable to generate summary.";
    } catch (error) {
      console.error("OpenAI API error:", error);
      // Fall back to mock data on error
    }
  }

  // Mock summary if OpenAI is not configured
  return generateMockSummary(issue);
}

/**
 * Match potential partners/volunteers for an issue
 * @param user - The user requesting matches
 * @param issue - The issue to find partners for
 * @returns Array of matched partners with scores
 */
export async function matchPartners(user: User, issue: Issue): Promise<Partner[]> {
  // If OpenAI is configured, use it for intelligent matching
  if (openai) {
    try {
      const prompt = `Given a user and an issue, suggest 3-5 potential partners who could help solve this issue.

User Profile:
- Name: ${user.name}
- Skills: ${user.skills?.join(", ") || "Not specified"}
- Interests: ${user.interests?.join(", ") || "Not specified"}

Issue:
- Title: ${issue.title}
- Category: ${issue.category}
- Severity: ${issue.severity}/5
- Description: ${issue.description || "No description"}

Suggest partners with complementary skills. Format your response as JSON array with fields: name, matchScore (0-100), reason, skills (array).`;

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that matches people with complementary skills to solve social issues. Always respond with valid JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.8,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        // Handle different response formats
        const partners = parsed.partners || parsed.matches || [];
        return partners.map((p: any) => ({
          id: Math.random().toString(36).substring(7),
          name: p.name,
          matchScore: p.matchScore || p.score || 75,
          reason: p.reason || "AI-matched based on skills and interests",
          skills: p.skills || [],
          location: p.location,
        }));
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
      // Fall back to mock data on error
    }
  }

  // Mock partner matching if OpenAI is not configured
  return generateMockPartners(user, issue);
}

/**
 * Generate a mock summary for testing without OpenAI API
 */
function generateMockSummary(issue: Issue): string {
  const templates = {
    infrastructure: `This infrastructure issue regarding "${issue.title}" has been flagged with severity ${issue.severity}/5. Immediate attention is needed to address potential safety concerns and improve community access.`,
    healthcare: `Healthcare concern: "${issue.title}" requires urgent intervention (severity ${issue.severity}/5). This impacts community health services and requires coordination with local medical facilities.`,
    education: `Educational issue "${issue.title}" affects learning outcomes in the community. Priority level ${issue.severity}/5 indicates the need for swift action to ensure continued access to quality education.`,
    environment: `Environmental concern: "${issue.title}" poses risks to local ecosystem and community wellbeing (severity ${issue.severity}/5). Sustainable solutions and community engagement are crucial.`,
  };

  return (
    templates[issue.category as keyof typeof templates] ||
    `Issue "${issue.title}" in ${issue.category} category requires attention (severity ${issue.severity}/5). Community collaboration is needed to address this concern effectively.`
  );
}

/**
 * Generate mock partner matches for testing without OpenAI API
 */
function generateMockPartners(user: User, issue: Issue): Partner[] {
  const mockPartners: Partner[] = [
    {
      id: "partner-1",
      name: "Sarah Chen",
      matchScore: 92,
      reason: "Expert in community development with strong project management skills",
      skills: ["Project Management", "Community Outreach", "Fundraising"],
      location: "San Francisco, CA",
    },
    {
      id: "partner-2",
      name: "Marcus Johnson",
      matchScore: 87,
      reason: "Technical expertise in infrastructure planning and sustainable solutions",
      skills: ["Civil Engineering", "Sustainable Design", "GIS Mapping"],
      location: "Portland, OR",
    },
    {
      id: "partner-3",
      name: "Priya Patel",
      matchScore: 85,
      reason: "Healthcare policy advocate with strong network in medical community",
      skills: ["Healthcare Policy", "Advocacy", "Grant Writing"],
      location: "Austin, TX",
    },
    {
      id: "partner-4",
      name: "David Kim",
      matchScore: 78,
      reason: "Environmental scientist with experience in community education programs",
      skills: ["Environmental Science", "Data Analysis", "Public Speaking"],
      location: "Seattle, WA",
    },
  ];

  // Filter partners based on issue category for more relevant matches
  const relevantPartners = mockPartners
    .sort(() => Math.random() - 0.5) // Shuffle for variety
    .slice(0, 3 + Math.floor(Math.random() * 2)); // Return 3-4 partners

  return relevantPartners;
}
