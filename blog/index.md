---
layout: default
title: 글 목록
permalink: /blog/
---

<section class="card">
  <h1 style="margin-top:0;">글 목록</h1>
  <p class="muted">작업 배치 단위로 정리한 기술 회고</p>
</section>

<section class="posts-grid">
  {% assign pages_with_post = site.pages | where_exp: "p", "p.path contains 'blog/posts/'" %}
  {% for p in pages_with_post %}
  <article class="post-card">
    <h3><a href="{{ p.url | relative_url }}">{{ p.title }}</a></h3>
    <p>{{ p.content | strip_html | truncate: 120 }}</p>
  </article>
  {% endfor %}
</section>
