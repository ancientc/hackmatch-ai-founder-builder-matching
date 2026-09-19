"""Deterministic token-overlap matching, mirroring the client-side spec."""

import re
from typing import Any

STOPWORDS = {
    "a", "an", "and", "the", "with", "for", "to", "of", "in", "on", "at", "is", "are", "am", "my",
    "me", "i", "we", "you", "it", "that", "this", "as", "be", "by", "or", "from", "help", "need",
    "needs", "want", "looking", "someone", "anyone", "people", "person", "can", "do", "does", "how",
}

SPLIT = re.compile(r"[^a-z0-9+#.]+")


def tokens(*values: str) -> set[str]:
    out: set[str] = set()
    for value in values:
        for raw in SPLIT.split((value or "").lower()):
            word = raw.strip(".")
            if len(word) < 2 or word in STOPWORDS:
                continue
            out.add(word)
            if word.endswith("s") and len(word) > 3:
                out.add(word[:-1])
    return out


def overlap(a: set[str], b: set[str]) -> list[str]:
    return sorted(a & b)


def pct(raw: int) -> int:
    return max(5, min(99, raw))


def label(words: list[str], maximum: int = 4) -> str:
    return ", ".join(words[:maximum])


def collaborate_matches(me: dict[str, Any], others: list[dict[str, Any]]) -> list[dict[str, Any]]:
    my_interests = tokens(me["interests"], me["building"])
    my_skills = tokens(me["skills"], me["canHelpWith"], me["experience"])
    my_needs = tokens(me["needsHelpWith"], me["lookingFor"])

    results = []
    for them in others:
        their_interests = tokens(them["interests"], them["building"])
        their_skills = tokens(them["skills"], them["canHelpWith"], them["experience"])
        their_needs = tokens(them["needsHelpWith"], them["lookingFor"])

        shared = overlap(my_interests, their_interests)
        they_help_me = overlap(my_needs, their_skills)
        i_help_them = overlap(their_needs, my_skills)
        project_fit = overlap(tokens(me["building"]), their_skills)

        score = pct(
            len(shared) * 12 + len(they_help_me) * 18 + len(i_help_them) * 16 + len(project_fit) * 8
        )

        reasons = []
        if shared:
            reasons.append(f"❤️ Shared interests: {label(shared)}")
        if they_help_me:
            reasons.append(f"🤲 {them['name']} can help you with {label(they_help_me)}")
        if i_help_them:
            reasons.append(f"🛠️ You can help {them['name']} with {label(i_help_them)}")
        if project_fit:
            reasons.append(f"🚀 Relevant to what you are building: {label(project_fit)}")
        if not reasons:
            reasons.append("👋 Same community, no strong signal yet — worth a quick hello.")

        complementary = [{"you": f"needs {t}", "them": f"knows {t}"} for t in they_help_me[:3]]
        complementary += [{"you": f"knows {t}", "them": f"needs {t}"} for t in i_help_them[:3]]

        if shared:
            starter = f'"You are both into {label(shared, 2)} — what are you building with it?"'
        elif they_help_me:
            starter = f'"I\'m stuck on {label(they_help_me, 2)} — I heard that\'s your area."'
        else:
            starter = '"What are you building here at the event?"'

        results.append(
            {
                "profile": them,
                "score": score,
                "reasons": reasons,
                "complementary": complementary,
                "starter": starter,
            }
        )

    return sorted(results, key=lambda item: item["score"], reverse=True)


def help_matches(
    request_text: str, me: dict[str, Any], others: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    need = tokens(request_text)

    results = []
    for them in others:
        their_skills = tokens(them["skills"], them["canHelpWith"], them["experience"], them["building"])
        hits = overlap(need, their_skills)
        interest_hits = overlap(need, tokens(them["interests"]))
        score = pct(len(hits) * 22 + len(interest_hits) * 8)

        reasons = []
        if hits:
            reasons.append(f"🧠 Works with {label(hits)}")
        if interest_hits:
            reasons.append(f"❤️ Interested in {label(interest_hits)}")
        if not reasons:
            reasons.append("👋 No direct signal, but they may know who to ask.")

        starter = (
            f'"{me["name"]} here — I need a hand with {label(hits, 2)}. Got five minutes?"'
            if hits
            else f'"{me["name"]} here — do you know anyone working on this?"'
        )

        results.append(
            {
                "profile": them,
                "score": score,
                "reasons": reasons,
                "complementary": [{"you": f"needs {t}", "them": f"knows {t}"} for t in hits[:4]],
                "starter": starter,
            }
        )

    return sorted(results, key=lambda item: item["score"], reverse=True)
