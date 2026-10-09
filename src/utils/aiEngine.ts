import { Persona, PersonaId } from '../types/chat';

export const PERSONAS: Record<PersonaId, Persona> = {
  general: {
    id: 'general',
    name: 'Personal Assistant',
    tagline: 'Executive gold-tier assistant for intelligent reasoning & productivity',
    avatar: '👑',
    accentColor: 'from-[#f3e5ab] via-[#d4af37] to-[#aa771c]',
    systemPrompt: 'You are an elite Personal AI Assistant designed to provide direct, insightful, and comprehensive answers across any domain.',
  },
  coding: {
    id: 'coding',
    name: 'DevPilot',
    tagline: 'Senior full-stack architect & algorithm debugger',
    avatar: '⚡',
    accentColor: 'from-[#e6ca65] via-[#d4af37] to-[#8a5a10]',
    systemPrompt: 'You are DevPilot, a world-class software engineer. You provide optimal, clean, secure, and production-ready code with explanations.',
  },
  creative: {
    id: 'creative',
    name: 'Creative Studio',
    tagline: 'Brand storytelling, high-converting copy & communication',
    avatar: '🖋️',
    accentColor: 'from-[#dfba5e] via-[#c5a059] to-[#aa771c]',
    systemPrompt: 'You are Creative Studio, a master of evocative language, viral marketing, compelling narratives, and persuasive communication.',
  },
  productivity: {
    id: 'productivity',
    name: 'Executive Coach',
    tagline: 'Strategic timeboxing, goal execution & daily planning sprints',
    avatar: '🎯',
    accentColor: 'from-[#d4af37] via-[#aa771c] to-[#6d4c1b]',
    systemPrompt: 'You are Executive Coach. You break down complex ambitions into high-leverage daily routines, actionable roadmaps, and prioritized lists.',
  },
  researcher: {
    id: 'researcher',
    name: 'Deep Thinker',
    tagline: 'First-principles logic, multi-step analysis & chain of thought',
    avatar: '🪙',
    accentColor: 'from-[#f3e5ab] via-[#d4af37] to-[#aa771c]',
    systemPrompt: 'You are Deep Thinker. You employ first-principles reasoning and step-by-step logic chains before reaching conclusions.',
  },
};

export interface AIResponsePayload {
  thinking?: string;
  response: string;
  tokensUsed: number;
}

export function generateSmartResponse(
  prompt: string,
  persona: PersonaId
): AIResponsePayload {
  const cleanPrompt = prompt.trim().toLowerCase();

  // Roman Urdu or Urdu detection
  const isUrdu =
    cleanPrompt.includes('karein') ||
    cleanPrompt.includes('kya') ||
    cleanPrompt.includes('kaise') ||
    cleanPrompt.includes('batao') ||
    cleanPrompt.includes('aap') ||
    cleanPrompt.includes('shukriya') ||
    cleanPrompt.includes('karo');

  // Token redemption query
  if (
    cleanPrompt.includes('4nv0pe') ||
    cleanPrompt.includes('redeem') ||
    cleanPrompt.includes('token') ||
    cleanPrompt.includes('billion') ||
    cleanPrompt.includes('assistant') ||
    cleanPrompt.includes('muse')
  ) {
    const thinking = `Verifying VIP token credentials...
1. Validating referral key: 4NV0PE
2. Allocating 1,000,000,000 Lifetime Gold Token Balance
3. High-speed neural inference routing activated`;

    const response = isUrdu
      ? `👑 **Mubarak ho! 1 Billion Tokens Quota Active!**

Aapka VIP redeem code **\`4NV0PE\`** successfully verify ho chuka hai. Aapke account mein **1,000,000,000 Lifetime Tokens** add ho chuke hain!

### Account Status:
- **Status**: Verified & Active 🟢
- **Tier**: Gold Executive Quota
- **Features Unlocked**:
  - ⚡ DevPilot Full-stack Coding & Debugging
  - 🪙 Deep Thinker Multi-step Logic
  - 🎙️ Real-time Voice Interaction
  - 🎯 Executive Productivity Planning

Ab aap mujhse koi bhi sawal pooch sakte hain ya coding, writing, aur planning ke liye use kar sakte hain!`
      : `👑 **Success! 1 Billion Tokens Quota Verified & Active!**

Your VIP promo voucher **\`4NV0PE\`** has been applied successfully. You now have **1,000,000,000 Lifetime Tokens** ready to use!

### Account Status:
- **Token Balance**: \`1,000,000,000 / 1,000,000,000\` (Perpetual Lifetime Reserve)
- **Tier**: Gold Executive Neural Engine
- **Latency**: \`< 24ms\` response time
- **Features Unlocked**: Full-stack code generation, deep chain-of-thought analysis, speech voice mode, and multi-persona specialization.

What would you like to build or explore today?`;

    return {
      thinking,
      response,
      tokensUsed: Math.floor(prompt.length * 1.3) + 320,
    };
  }

  // Persona: Coding
  if (persona === 'coding' || cleanPrompt.includes('code') || cleanPrompt.includes('function') || cleanPrompt.includes('react') || cleanPrompt.includes('python')) {
    const thinking = `Analyzing computational architecture & edge cases...
1. Applying clean, type-safe implementation patterns
2. Setting exponential retry handling with jitter
3. Returning production-ready code with complete explanations`;

    const response = isUrdu
      ? `Beshak! Yeh raha aapka optimized aur clean code solution:

\`\`\`typescript
// High Performance Utility Function with Exponential Backoff
export async function handleAsyncProcess<T>(
  task: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  try {
    return await task();
  } catch (error) {
    if (retries <= 0) throw error;
    console.warn(\`Retrying... attempts remaining: \${retries}\`);
    await new Promise((res) => setTimeout(res, delayMs));
    return handleAsyncProcess(task, retries - 1, delayMs * 1.5);
  }
}
\`\`\`

### Key Features:
- **Exponential Backoff**: Server overload se bachata hai.
- **Type Safety**: TypeScript generics ke sath safe data handling.
- **Error Propagation**: Graceful failure management.

Kya aapko isme mazeed specific requirement ya custom API integration chahiye?`
      : `Here is a production-grade, type-safe implementation designed for maximum reliability:

\`\`\`typescript
/**
 * Executes an asynchronous task with exponential backoff and typed error handling.
 */
export async function executeWithRetry<T>(
  task: () => Promise<T>,
  retries = 3,
  baseDelay = 800
): Promise<T> {
  try {
    return await task();
  } catch (err) {
    if (retries <= 1) {
      console.error("[Execution Failed]: Max retry threshold reached.", err);
      throw err;
    }
    const waitTime = baseDelay * (4 - retries);
    await new Promise((resolve) => setTimeout(resolve, waitTime));
    return executeWithRetry(task, retries - 1, baseDelay);
  }
}
\`\`\`

### Why this design works:
1. **Memory efficient**: Zero unneeded closure allocations.
2. **Backoff protection**: Prevents cascading rate limits on downstream endpoints.
3. **Resilient**: Captures unexpected network dropouts without halting UI rendering.

Would you like me to adapt this to a specific API or framework?`;

    return {
      thinking,
      response,
      tokensUsed: Math.floor(prompt.length * 1.4) + 480,
    };
  }

  // Persona: Productivity
  if (persona === 'productivity' || cleanPrompt.includes('plan') || cleanPrompt.includes('schedule') || cleanPrompt.includes('time')) {
    const thinking = `Applying 80/20 Pareto principle & timeboxing framework...
1. Categorized key goals into high-impact blocks
2. Eliminating context switching`;

    const response = isUrdu
      ? `Aapke din ko high productivity ke liye plan karte hain:

### 🏆 3 High-Impact Priority Blocks:
1. **Deep Work Block (9:00 AM - 11:30 AM)**: 
   - Sab se ahem aur difficult task par 100% focus (No phone, no notifications).
2. **Execution & Collaboration (1:00 PM - 3:30 PM)**:
   - Meetings, emails, aur team tasks solve karein.
3. **Review & Preparation (5:00 PM - 5:45 PM)**:
   - Aaj ka output review karein aur kal ke Top 3 goals tayar karein.

> **Golden Rule**: Pehle 90 minutes mein sirf woh kaam karein jo sabse zyada value produce kare.`
      : `Here is a high-leverage execution roadmap based on the **90/20 Timeboxing Framework**:

### 🎯 Today's Strategic Focus Matrix
| Phase | Duration | Focus Area | Energy Level |
|---|---|---|---|
| **Deep Work Sprint** | 90 Mins | Core High-Value Objective | Peak (100%) |
| **Active Execution** | 60 Mins | Fast-batch communications & PR reviews | Moderate (70%) |
| **Strategic Debrief** | 30 Mins | Progress audit & day-ahead setup | Restorative |

> **Pro-Tip**: Protect your first 90 minutes of the morning at all costs. Never check notifications before completing your #1 daily milestone.`;

    return {
      thinking,
      response,
      tokensUsed: Math.floor(prompt.length * 1.2) + 290,
    };
  }

  // Persona: Creative
  if (persona === 'creative' || cleanPrompt.includes('story') || cleanPrompt.includes('write') || cleanPrompt.includes('ad')) {
    const thinking = `Crafting narrative arc with engaging conversational tone...
1. Hooking attention within first sentence
2. Clear and memorable delivery`;

    const response = isUrdu
      ? `Zindagi ke safar mein har mod ek nayi kahani likhta hai. 

Jab hum nayi technology aur artificial intelligence ki dunya mein qadam rakhte hain, toh asal taqat code mein nahi, balkay hamare khawabon aur iradon mein hoti hai. Personal Assistant aapke har khayal ko haqeeqat ka roop dene ke liye tayar hai.

*“Jo log kal ki fikar kiye baghair aaj seekhte hain, mustaqbil unhi ka intezar karta hai.”*

Bataiye, kis topic par mazeed dilchasp kahani ya post likhni hai?`
      : `The future of software is not about replacing human creativity — it is about removing every barrier between an idea and its execution.

*"True innovation isn't the machine learning to speak — it's humanity finally discovering the language of the future."*

Where would you like to steer our writing next?`;

    return {
      thinking,
      response,
      tokensUsed: Math.floor(prompt.length * 1.3) + 260,
    };
  }

  // Persona: Researcher (Deep Thinker)
  if (persona === 'researcher') {
    const thinking = `Deconstructing query into fundamental premises...
1. Identifying underlying axiomatic assumptions
2. Synthesizing counter-arguments and implications
3. Formulating unified, balanced conclusion`;

    const response = `### Synthesized Analytical Overview

When examining **"${prompt.slice(0, 40)}..."**, we identify three interconnected dimensions:

1. **Foundational Axiom**: Bottlenecks usually stem from structural assumptions rather than technical limitations.
2. **Second-Order Implications**: Increasing computational speed shifts focus onto input clarity and workflow design.
3. **Synthesis & Strategic Recommendation**:
   - Focus on modular, easily testable components.
   - Measure real-world cycle speed rather than theoretical maximums.

Would you like to drill down deeper into any of these areas?`;

    return {
      thinking,
      response,
      tokensUsed: Math.floor(prompt.length * 1.5) + 380,
    };
  }

  // Default General Personal Assistant Core
  const thinking = `Processing conversational intent: "${prompt.slice(0, 35)}..."
1. Persona alignment: Personal Assistant
2. Synthesizing clear and concise response`;

  const response = isUrdu
    ? `Aapka sawal bohat dilchasp hai! 

Aapke prompt **"${prompt}"** ke mutabiq, yahan ahem points hain:
- **Clarity**: Hum step-by-step is maslay ko hal kar sakte hain.
- **Speed**: Personal Assistant 1 Billion Tokens pool se fast answers deta hai.
- **Customization**: Agar aapko code, writing, ya analysis chahiye toh persona switch kar sakte hain.

Aap mujhse mazeed sawal pooch sakte hain!`
    : `I've analyzed your prompt carefully.

Here is a clear breakdown regarding **"${prompt}"**:

1. **Direct Takeaway**:
   - Modern execution relies on quick iteration and clarity of intent.
   - You have full access to high-speed reasoning, multi-language support, and direct code generation.

2. **Next Steps**:
   - Test this logic against your immediate project goals.
   - Switch modes anytime in the top bar to get specialized coding, writing, or planning assistance.

Feel free to ask follow-up questions, request adjustments, or paste code snippets!`;

  return {
    thinking,
    response,
    tokensUsed: Math.floor(prompt.length * 1.2) + 220,
  };
}
