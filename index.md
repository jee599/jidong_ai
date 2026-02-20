---
layout: default
title: 홈
---

<section class="hero">
  <p class="eyebrow">jidong-ai</p>
  <h1>작업 배치 기반 기술 로그</h1>
  <p>날짜 일기장이 아니라, <strong>의사결정과 실행 단위</strong>로 정리하는 개발 기록.</p>
</section>

<section class="card">
  <h2>이 블로그를 보는 방법</h2>
  <ul>
    <li>한 포스트 = 하나의 작업 배치</li>
    <li>문제 → 선택지 → 결정 → 결과 → 체크리스트 순서</li>
    <li>나중에 다시 봐도 바로 재현 가능하게 기록</li>
  </ul>
</section>

<section class="card">
  <h2>디자인 톤 비교 (A/B)</h2>
  <p class="muted">A: Ocean(기본, 선명한 블루) / B: Mono(차분한 뉴트럴)</p>
  <div class="tone-actions">
    <button type="button" data-tone="ocean">A안 Ocean</button>
    <button type="button" data-tone="mono">B안 Mono</button>
  </div>
</section>

<section class="posts-grid">
  {% for post in site.posts %}
  <article class="post-card">
    <p class="post-meta">{{ post.date | date: "%Y-%m-%d" }}</p>
    <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
    <p>{{ post.excerpt | strip_html | truncate: 120 }}</p>
  </article>
  {% endfor %}
</section>
