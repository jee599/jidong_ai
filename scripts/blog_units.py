#!/usr/bin/env python3
import argparse
import datetime as dt
import json
import os
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BLOG = ROOT / "blog"
UNITS_FILE = BLOG / "units.json"
POSTS_DIR = BLOG / "posts"


def now_iso():
    return dt.datetime.now(dt.timezone.utc).astimezone().isoformat(timespec="seconds")


def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9가-힣\s-]", "", text)
    text = re.sub(r"\s+", "-", text)
    return text[:60] or "work-log"


def load_units():
    if not UNITS_FILE.exists():
        return []
    with open(UNITS_FILE, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
            return data if isinstance(data, list) else []
        except json.JSONDecodeError:
            return []


def save_units(units):
    UNITS_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(UNITS_FILE, "w", encoding="utf-8") as f:
        json.dump(units, f, ensure_ascii=False, indent=2)


def add_unit(args):
    units = load_units()
    units.append(
        {
            "id": len(units) + 1,
            "createdAt": now_iso(),
            "title": args.title,
            "problem": args.problem,
            "approach": args.approach,
            "result": args.result,
            "tags": [t.strip() for t in args.tags.split(",") if t.strip()],
            "published": False,
            "post": None,
        }
    )
    save_units(units)
    print(f"added unit #{len(units)}")


def next_post_index():
    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    existing = sorted(POSTS_DIR.glob("*.md"))
    if not existing:
        return 1
    nums = []
    for p in existing:
        m = re.match(r"(\d+)-", p.name)
        if m:
            nums.append(int(m.group(1)))
    return (max(nums) + 1) if nums else 1


def render_post(units, post_title):
    lines = [
        f"# {post_title}",
        "",
        "## 이번 배치에서 다룬 작업",
    ]
    for i, u in enumerate(units, 1):
        lines += [
            "",
            f"### {i}. {u['title']}",
            f"- 문제: {u['problem']}",
            f"- 접근: {u['approach']}",
            f"- 결과: {u['result']}",
            f"- 태그: {', '.join(u['tags']) if u['tags'] else '-'}",
        ]

    lines += [
        "",
        "## 배치 회고",
        "- 공통 패턴: 문제를 작은 단위로 나눌수록 해결 속도가 빨라짐",
        "- 다음 액션: 반복되는 작업은 스크립트/템플릿으로 자동화",
    ]
    return "\n".join(lines) + "\n"


def publish_units(args):
    units = load_units()
    pending = [u for u in units if not u.get("published")]

    if len(pending) < args.min_units:
        print(f"skip: pending units {len(pending)} < min {args.min_units}")
        return

    batch = pending[: args.min_units]
    first_title = batch[0]["title"]
    idx = next_post_index()
    post_name = f"{idx:03d}-{slugify(first_title)}.md"
    post_path = POSTS_DIR / post_name

    post_title = f"작업 배치 #{idx}: {first_title} 외 {len(batch)-1}건"
    content = render_post(batch, post_title)
    post_path.write_text(content, encoding="utf-8")

    batch_ids = {u["id"] for u in batch}
    for u in units:
        if u["id"] in batch_ids:
            u["published"] = True
            u["post"] = post_name

    save_units(units)

    if not args.no_commit:
        subprocess.run(["git", "add", "blog"], cwd=ROOT, check=False)
        subprocess.run(
            ["git", "commit", "-m", f"docs(blog): publish {post_name}"],
            cwd=ROOT,
            check=False,
        )

    print(f"published: {post_path}")


def init_files():
    BLOG.mkdir(parents=True, exist_ok=True)
    POSTS_DIR.mkdir(parents=True, exist_ok=True)
    if not UNITS_FILE.exists():
        save_units([])


def main():
    init_files()
    p = argparse.ArgumentParser(description="Work-unit based blog publisher")
    sub = p.add_subparsers(dest="cmd", required=True)

    add = sub.add_parser("add")
    add.add_argument("--title", required=True)
    add.add_argument("--problem", required=True)
    add.add_argument("--approach", required=True)
    add.add_argument("--result", required=True)
    add.add_argument("--tags", default="")
    add.set_defaults(func=add_unit)

    pub = sub.add_parser("publish")
    pub.add_argument("--min-units", type=int, default=5)
    pub.add_argument("--no-commit", action="store_true")
    pub.set_defaults(func=publish_units)

    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
