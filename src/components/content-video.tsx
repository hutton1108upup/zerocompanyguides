"use client";

import { ExternalLink, Play } from "lucide-react";
import { useState } from "react";
import type { VideoBlock } from "../content/types";
import { getHeadingId } from "../lib/content";

function VideoBody({ block }: { block: VideoBlock }) {
  const [loaded, setLoaded] = useState(false);
  const youtubeUrl = `https://www.youtube.com/watch?v=${block.videoId}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${block.videoId}?autoplay=1&rel=0`;

  return (
    <section className={`content-section video-brief video-brief--${block.evidence}`}>
      <div className="video-brief__heading-row">
        <div>
          <p className="video-brief__eyebrow">Visual briefing</p>
          <h2 id={getHeadingId(block.heading)}>{block.heading}</h2>
        </div>
        <span className={`media-badge media-badge--${block.evidence}`}>
          {block.evidence === "official" ? "Official" : "Community"}
        </span>
      </div>

      <div className="video-brief__stage">
        {loaded ? (
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            src={embedUrl}
            title={block.title}
          />
        ) : (
          <button
            aria-label={`Load video: ${block.title}`}
            className="video-brief__poster"
            onClick={() => setLoaded(true)}
            style={{ backgroundImage: `linear-gradient(180deg, rgba(5, 8, 14, 0.08), rgba(5, 8, 14, 0.82)), url(${block.posterSrc})` }}
            type="button"
          >
            <span className="video-brief__play"><Play aria-hidden="true" fill="currentColor" size={22} /></span>
            <span className="video-brief__load">Load video</span>
            <span className="video-brief__duration">{block.duration}</span>
          </button>
        )}
      </div>

      <div className="video-brief__body">
        <div>
          <h3>{block.title}</h3>
          <p>{block.description}</p>
        </div>
        <dl className="video-brief__meta">
          <div><dt>Channel</dt><dd>{block.publisher}</dd></div>
          <div><dt>Published</dt><dd>{block.publishedAt}</dd></div>
          {block.versionNote && <div><dt>Boundary</dt><dd>{block.versionNote}</dd></div>}
        </dl>
        <a className="media-source" href={youtubeUrl} rel="noreferrer" target="_blank">
          Watch on YouTube
          <ExternalLink aria-hidden="true" size={13} />
        </a>
      </div>
    </section>
  );
}

export function ContentVideo({ block }: { block: VideoBlock }) {
  if (!block.spoiler) return <VideoBody block={block} />;

  return (
    <details className="media-disclosure media-disclosure--video">
      <summary>Reveal spoiler video: {block.title}</summary>
      <VideoBody block={block} />
    </details>
  );
}
