import type { Match, Profile } from "./types";

const STOPWORDS = new Set([
  "a", "an", "and", "the", "with", "for", "to", "of", "in", "on", "at", "is", "are", "am", "my",
  "me", "i", "we", "you", "it", "that", "this", "as", "be", "by", "or", "from", "help", "need",
  "needs", "want", "looking", "someone", "anyone", "people", "person", "can", "do", "does", "how",
]);

function tokens(...values: string[]): Set<string> {
  const out = new Set<string>();
  for (const value of values) {
    for (const raw of value.toLowerCase().split(/[^a-z0-9+#.]+/)) {
      const word = raw.replace(/^[.]+|[.]+$/g, "");
      if (word.length < 2 || STOPWORDS.has(word)) continue;
      out.add(word);
      if (word.endsWith("s") && word.length > 3) out.add(word.slice(0, -1));
    }
  }
  return out;
}

function overlap(a: Set<string>, b: Set<string>): string[] {
  return [...a].filter((token) => b.has(token));
}

function pct(raw: number): number {
  return Math.max(5, Math.min(99, Math.round(raw)));
}

function label(words: string[], max = 4): string {
  return words.slice(0, max).join(", ");
}

export function collaborateMatches(me: Profile, others: Profile[]): Match[] {
  const myInterests = tokens(me.interests, me.building);
  const mySkills = tokens(me.skills, me.canHelpWith, me.experience);
  const myNeeds = tokens(me.needsHelpWith, me.lookingFor);

  return others
    .map((them) => {
      const theirInterests = tokens(them.interests, them.building);
      const theirSkills = tokens(them.skills, them.canHelpWith, them.experience);
      const theirNeeds = tokens(them.needsHelpWith, them.lookingFor);

      const shared = overlap(myInterests, theirInterests);
      const theyHelpMe = overlap(myNeeds, theirSkills);
      const iHelpThem = overlap(theirNeeds, mySkills);
      const projectFit = overlap(tokens(me.building), theirSkills);

      const score = pct(
        shared.length * 12 + theyHelpMe.length * 18 + iHelpThem.length * 16 + projectFit.length * 8,
      );

      const reasons: string[] = [];
      if (shared.length) reasons.push(`❤️ Shared interests: ${label(shared)}`);
      if (theyHelpMe.length) reasons.push(`🤲 ${them.name} can help you with ${label(theyHelpMe)}`);
      if (iHelpThem.length) reasons.push(`🛠️ You can help ${them.name} with ${label(iHelpThem)}`);
      if (projectFit.length) reasons.push(`🚀 Relevant to what you are building: ${label(projectFit)}`);
      if (!reasons.length) reasons.push("👋 Same community, no strong signal yet — worth a quick hello.");

      const complementary = [
        ...theyHelpMe.slice(0, 3).map((token) => ({ you: `needs ${token}`, them: `knows ${token}` })),
        ...iHelpThem.slice(0, 3).map((token) => ({ you: `knows ${token}`, them: `needs ${token}` })),
      ];

      const starter = shared.length
        ? `"You are both into ${label(shared, 2)} — what are you building with it?"`
        : theyHelpMe.length
          ? `"I'm stuck on ${label(theyHelpMe, 2)} — I heard that's your area."`
          : `"What are you building here at the event?"`;

      return { profile: them, score, reasons, complementary, starter };
    })
    .sort((a, b) => b.score - a.score);
}

export function helpMatches(requestText: string, me: Profile, others: Profile[]): Match[] {
  const need = tokens(requestText);

  return others
    .map((them) => {
      const theirSkills = tokens(them.skills, them.canHelpWith, them.experience, them.building);
      const hits = overlap(need, theirSkills);
      const interestHits = overlap(need, tokens(them.interests));
      const score = pct(hits.length * 22 + interestHits.length * 8);

      const reasons: string[] = [];
      if (hits.length) reasons.push(`🧠 Works with ${label(hits)}`);
      if (interestHits.length) reasons.push(`❤️ Interested in ${label(interestHits)}`);
      if (!reasons.length) reasons.push("👋 No direct signal, but they may know who to ask.");

      return {
        profile: them,
        score,
        reasons,
        complementary: hits.slice(0, 4).map((token) => ({ you: `needs ${token}`, them: `knows ${token}` })),
        starter: hits.length
          ? `"${me.name} here — I need a hand with ${label(hits, 2)}. Got five minutes?"`
          : `"${me.name} here — do you know anyone working on this?"`,
      };
    })
    .sort((a, b) => b.score - a.score);
}
