import type { TopicDefinition, ArticleContent, GenerationPromptContext } from "./types";

const STYLE_GUIDELINES = `
WRITING STYLE:
- Didactic, professional, clear tone
- Schematic and organized — use headings, short paragraphs, bullet points
- Dense with useful information — no filler, no fluff
- Explain complex concepts simply without being condescending
- Use precise definitions where appropriate
- Clearly distinguish facts from examples and pedagogical simplifications
- Do NOT invent data or statistics
- Do NOT include country-specific tax or regulatory advice without clearly marking it as general
- Do NOT use SEO stuffing phrases
- Do NOT sound auto-generated — write naturally
- Do NOT start with "Throughout history..." or "It is important to note..."
- Do NOT repeat the same idea in different words
- Use active voice when possible
- Use concrete examples when they add clarity

GLOBAL AUDIENCE:
- Write for a worldwide readership — avoid assuming Western-only context
- When giving market examples, include diverse regions (e.g. Shanghai Gold Exchange, Indian demand, Middle East, Turkey, alongside COMEX and LBMA)
- Mention multiple central banks where relevant (PBoC, RBI, CBRT, alongside the Fed and ECB)
- Use neutral or multi-currency references (e.g. "USD/local currency") rather than only USD or EUR
- Avoid framing precious metals markets solely through a US/European lens
- Keep cultural examples balanced across regions when possible
`.trim();

const STRUCTURE_RULES = `
STRUCTURE:
Return a valid JSON object with this exact schema:
{
  "title": "Clear, informative title (50-70 chars)",
  "seoTitle": "SEO-optimized title (50-60 chars) designed to maximize click-through rate on Google. Use one of these proven CTR patterns — pick the best fit for the topic: (1) Question: 'Why Does Gold Rise When Inflation Spikes?', (2) Comparison/vs: 'NGC vs PCGS: Which Grading Service Is Better for Gold?', (3) Number/data: 'All the Gold Ever Mined: 197,576 Tonnes and Where It Is Now', (4) How-to: 'How to Read a COT Report to Predict Gold Price Moves', (5) Benefit/outcome: 'Gold ETFs in Europe: Lowest-Fee Options Compared'. MUST include the exact keyword people search for. NEVER use 'Introduction to', 'Overview of', or 'Understanding' as openers.",
  "metaDescription": "Meta description (140-155 chars) designed for clicks. Start with what the reader will specifically discover or be able to do. Include 1-2 concrete facts, numbers, or named examples. End with a hook that creates curiosity or urgency. BAD example: 'Learn about moving averages in precious metals markets.' GOOD example: 'Discover how the 50-day and 200-day moving averages signal gold trend reversals. See real examples of golden crosses that predicted major gold rallies.'",
  "summary": "2-3 sentence summary of what the reader will learn",
  "keyIdea": "One sentence capturing the core concept or takeaway",
  "sections": [
    { "heading": "Section Title", "level": 2, "content": "Section content..." },
    { "heading": "Subsection", "level": 3, "content": "..." }
  ],
  "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
  "faq": [{ "question": "Q?", "answer": "A." }]
}
`.trim();

function buildPromptForType(ctx: GenerationPromptContext): string {
  const { topic, clusterName, subclusterName, relatedTopicTitles, glossaryTerms } = ctx;

  const metalContext = topic.metals?.length
    ? `Focus metals: ${topic.metals.join(", ")}.`
    : "Cover precious metals in general where relevant.";

  const relatedContext = relatedTopicTitles.length
    ? `Related articles (reference but don't duplicate): ${relatedTopicTitles.join("; ")}.`
    : "";

  const glossaryContext = glossaryTerms.length
    ? `Glossary terms to define or reference: ${glossaryTerms.join(", ")}.`
    : "";

  const typeInstructions: Record<string, string> = {
    explainer: `Write an EXPLAINER article that thoroughly explains the topic. Include:
- Clear definition or introduction
- Why it matters
- How it works (mechanism/process)
- Key factors or components
- Practical implications
- At least 4 sections with ## headings
- 2-3 FAQ items
Length: 800-1200 words of content.`,

    guide: `Write a PRACTICAL GUIDE that helps the reader take action. Include:
- What they'll learn
- Prerequisites or context needed
- Step-by-step instructions or framework
- Tips and best practices
- Common pitfalls to avoid
- At least 5 sections with ## headings
- 2-3 FAQ items
Length: 900-1400 words of content.`,

    glossary: `Write a GLOSSARY ENTRY — concise but complete. Include:
- Precise definition (1-2 sentences)
- Why it matters in precious metals context
- How it's used in practice
- A concrete example
- Related terms
- 3 sections with ## headings
- 1-2 FAQ items
Length: 400-600 words of content.`,

    comparison: `Write a COMPARISON article that objectively analyzes both sides. Include:
- Clear framing of what's being compared
- Key differences table (describe in text)
- Advantages and disadvantages of each
- When to choose one over the other
- At least 4 sections with ## headings
- 2-3 FAQ items
Length: 800-1200 words of content.`,

    faq: `Write a FAQ article that directly answers the question posed. Include:
- Direct answer upfront
- Context and explanation
- Nuances and caveats
- Practical advice
- 3-4 sections with ## headings
- 3-4 additional FAQ items
Length: 600-900 words of content.`,

    historical: `Write a HISTORICAL article that tells the story with educational value. Include:
- Historical context and timeline
- Key events and their significance
- Impact on precious metals markets
- Lessons for today
- At least 4 sections with ## headings
- 2-3 FAQ items
Length: 800-1200 words of content.`,

    practical: `Write a PRACTICAL article focused on real-world application. Include:
- The practical problem or scenario
- Step-by-step approach
- Tools, resources or techniques needed
- Common mistakes and how to avoid them
- At least 4 sections with ## headings
- 2-3 FAQ items
Length: 800-1200 words of content.`,

    macro: `Write a MACROECONOMIC article explaining the economic concept and its relationship with precious metals. Include:
- Clear explanation of the economic concept
- The mechanism linking it to precious metals
- Historical examples
- Current relevance
- At least 4 sections with ## headings
- 2-3 FAQ items
Length: 800-1200 words of content.`,

    investment: `Write an INVESTMENT article with educational focus (not financial advice). Include:
- Clear disclaimer: educational content, not financial advice
- The investment concept or vehicle explained
- Pros and cons
- Risk factors
- Practical considerations
- At least 4 sections with ## headings
- 2-3 FAQ items
Length: 800-1200 words of content.`,

    industry: `Write an INDUSTRY article about the industrial or commercial aspect. Include:
- Industry overview
- How precious metals are involved
- Scale and significance
- Key players or processes
- Future outlook
- At least 4 sections with ## headings
- 2-3 FAQ items
Length: 800-1200 words of content.`,

    pillar: `Write a comprehensive PILLAR article that serves as the definitive overview of this topic. Include:
- Broad introduction and context
- All key subtopics covered at a high level
- Clear structure that could serve as a table of contents for deeper articles
- Links context for related articles
- At least 6 sections with ## headings
- 3-5 FAQ items
Length: 1200-1800 words of content.`,
  };

  const typeInstruction = typeInstructions[topic.articleType] || typeInstructions.explainer;

  return `You are writing an educational article for Metalorix Learn, a precious metals education platform.

TOPIC: "${topic.titleEn}"
SUMMARY: ${topic.summaryEn}
CLUSTER: ${clusterName} > ${subclusterName}
DIFFICULTY: ${topic.difficulty}
TYPE: ${topic.articleType}
${metalContext}
${relatedContext}
${glossaryContext}

${typeInstruction}

DIFFICULTY LEVEL "${topic.difficulty}":
${topic.difficulty === "beginner" ? "- Assume NO prior knowledge of precious metals\n- Define all technical terms\n- Use analogies and everyday examples\n- Keep sentences short and clear" : ""}${topic.difficulty === "intermediate" ? "- Assume basic knowledge of what precious metals are\n- Can use standard market terminology\n- Include more detail and nuance\n- Reference concepts the reader should already know" : ""}${topic.difficulty === "advanced" ? "- Assume solid understanding of metals markets\n- Can discuss complex mechanisms\n- Include quantitative reasoning where relevant\n- Reference advanced concepts directly" : ""}

${STYLE_GUIDELINES}

${STRUCTURE_RULES}

Return ONLY the JSON. No markdown code blocks. No text before or after.`;
}

export function buildGenerationPrompt(ctx: GenerationPromptContext): string {
  return buildPromptForType(ctx);
}

export function parseArticleContent(raw: string): ArticleContent | null {
  try {
    const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : raw.trim();
    const parsed = JSON.parse(jsonStr);

    if (!parsed.title || !parsed.summary || !parsed.keyIdea || !parsed.sections?.length) {
      return null;
    }

    return {
      title: parsed.title,
      seoTitle: parsed.seoTitle || parsed.title,
      metaDescription: parsed.metaDescription || parsed.summary.slice(0, 155),
      summary: parsed.summary,
      keyIdea: parsed.keyIdea,
      sections: parsed.sections.map((s: { heading: string; level?: number; content: string }) => ({
        heading: s.heading,
        level: s.level === 3 ? 3 : 2,
        content: s.content,
      })),
      keyTakeaways: parsed.keyTakeaways || [],
      faq: parsed.faq || [],
    };
  } catch {
    return null;
  }
}

export function articleContentToMarkdown(content: ArticleContent): string {
  const parts: string[] = [];

  for (const section of content.sections) {
    const prefix = section.level === 3 ? "### " : "## ";
    parts.push(`${prefix}${section.heading}`);
    parts.push(section.content);
    parts.push("");
  }

  if (content.keyTakeaways.length > 0) {
    parts.push("## Key Takeaways");
    for (const t of content.keyTakeaways) {
      parts.push(`- ${t}`);
    }
    parts.push("");
  }

  if (content.faq && content.faq.length > 0) {
    parts.push("## Frequently Asked Questions");
    for (const item of content.faq) {
      parts.push(`### ${item.question}`);
      parts.push(item.answer);
      parts.push("");
    }
  }

  return parts.join("\n");
}

export function articleContentToHtml(content: ArticleContent): string {
  const parts: string[] = [];

  for (const section of content.sections) {
    const tag = section.level === 3 ? "h3" : "h2";
    parts.push(`<${tag}>${escapeHtml(section.heading)}</${tag}>`);
    const paragraphs = section.content.split("\n").filter((p) => p.trim());
    for (const p of paragraphs) {
      if (p.startsWith("- ") || p.startsWith("* ")) {
        parts.push(`<ul><li>${escapeHtml(p.slice(2))}</li></ul>`);
      } else {
        parts.push(`<p>${escapeHtml(p)}</p>`);
      }
    }
  }

  if (content.keyTakeaways.length > 0) {
    parts.push("<h2>Key Takeaways</h2>");
    parts.push("<ul>");
    for (const t of content.keyTakeaways) {
      parts.push(`<li>${escapeHtml(t)}</li>`);
    }
    parts.push("</ul>");
  }

  return parts.join("\n");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
