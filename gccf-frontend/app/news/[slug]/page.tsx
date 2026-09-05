"use client";

import { useParams, useRouter } from "next/navigation";
import { useNewsBySlug } from "@/lib/hooks";
import { FaCalendarAlt, FaUser, FaTag, FaExternalLinkAlt, FaArrowLeft } from "react-icons/fa";

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: news, isLoading, error } = useNewsBySlug(params.slug as string);

  if (isLoading) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        background: "#fafafa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
      }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{
          width: "50px",
          height: "50px",
          border: "4px solid #e0e0e0",
          borderTopColor: "#0d47a1",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <p style={{ marginTop: "1.5rem", color: "#666", fontSize: "1rem" }}>Loading article...</p>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#fafafa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#333" }}>Article Not Found</h1>
        <p style={{ color: "#666", marginBottom: "2rem" }}>The requested article could not be found.</p>
        <button
          onClick={() => router.push("/news")}
          style={{
            padding: "12px 24px",
            background: "#0d47a1",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <FaArrowLeft /> Back to News
        </button>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      <style>{`
        .news-detail-page { min-height: 100vh; background: #fafafa; }
        .news-hero { position: relative; height: 50vh; min-height: 400px; overflow: hidden; }
        .news-hero img { width: 100%; height: 100%; object-fit: cover; }
        .news-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%); display: flex; align-items: flex-end; padding: 3rem; }
        .news-hero-content { max-width: 900px; margin: 0 auto; width: 100%; }
        .news-category { display: inline-block; padding: 6px 16px; background: #0d47a1; color: white; border-radius: 20px; font-size: 0.85rem; font-weight: 600; margin-bottom: 1rem; }
        .news-hero h1 { font-size: 3rem; color: white; margin: 0 0 1rem 0; line-height: 1.2; }
        .news-meta { display: flex; flex-wrap: wrap; gap: 1.5rem; color: rgba(255,255,255,0.9); font-size: 0.95rem; }
        .news-meta-item { display: flex; align-items: center; gap: 8px; }
        .news-content-wrapper { max-width: 900px; margin: 0 auto; padding: 3rem 2rem; }
        .back-button { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: white; border: 1px solid #e0e0e0; border-radius: 6px; color: #333; font-weight: 500; cursor: pointer; transition: all 0.3s ease; margin-bottom: 2rem; }
        .back-button:hover { background: #0d47a1; color: white; border-color: #0d47a1; }
        .news-content-card { background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; }
        .news-content { padding: 3rem; font-size: 1.1rem; line-height: 1.8; color: #333; }
        .news-content p { margin-bottom: 1.5rem; }
        .news-tags { padding: 1.5rem 3rem; border-top: 1px solid #e0e0e0; display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
        .news-tags span { color: #666; font-weight: 600; }
        .tag { padding: 6px 14px; background: #e3f2fd; color: #0d47a1; border-radius: 20px; font-size: 0.85rem; font-weight: 500; }
        .news-source { padding: 1.5rem 3rem; border-top: 1px solid #e0e0e0; background: #f5f7fa; display: flex; align-items: center; gap: 12px; }
        .news-source a { color: #0d47a1; font-weight: 500; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; }
        .news-source a:hover { text-decoration: underline; }
        .share-section { margin-top: 2rem; padding: 2rem; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .share-section h3 { margin: 0 0 1rem 0; color: #333; }
        .share-buttons { display: flex; gap: 12px; }
        .share-btn { padding: 10px 20px; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; }
        .share-btn.copy { background: #e0e0e0; color: #333; }
        .share-btn.copy:hover { background: #0d47a1; color: white; }
        @media (max-width: 768px) { .news-hero { height: 40vh; min-height: 300px; } .news-hero h1 { font-size: 1.75rem; } .news-content { padding: 1.5rem; } .news-tags, .news-source { padding: 1rem 1.5rem; } .news-meta { flex-direction: column; gap: 0.5rem; } }
      `}</style>

      <section className="news-hero">
        <img src={news.featuredImage} alt={news.title} />
        <div className="news-hero-overlay">
          <div className="news-hero-content">
            {news.category && <span className="news-category">{news.category}</span>}
            <h1>{news.title}</h1>
            <div className="news-meta">
              {news.author && <div className="news-meta-item"><FaUser /> {news.author}</div>}
              <div className="news-meta-item">
                <FaCalendarAlt /> {new Date(news.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="news-content-wrapper">
        <button className="back-button" onClick={() => router.push("/news")}>
          <FaArrowLeft /> Back to News
        </button>

        <div className="news-content-card">
          <div className="news-content">
            <p style={{ fontSize: "1.25rem", color: "#666", marginBottom: "2rem" }}>{news.excerpt}</p>
            {news.content.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {news.tags && news.tags.length > 0 && (
            <div className="news-tags">
              <span><FaTag /> Tags:</span>
              {news.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          )}

          {news.source && (
            <div className="news-source">
              <span>Source:</span>
              {news.sourceUrl ? (
                <a href={news.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {news.source} <FaExternalLinkAlt />
                </a>
              ) : (
                <span>{news.source}</span>
              )}
            </div>
          )}
        </div>

        <div className="share-section">
          <h3>Share this article</h3>
          <div className="share-buttons">
            <button
              className="share-btn copy"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}