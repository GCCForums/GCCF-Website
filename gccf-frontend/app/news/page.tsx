"use client";

import { useNews } from "@/lib/hooks";
import Link from "next/link";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";

export default function NewsPage() {
  const { data: newsList = [], isLoading, error } = useNews();

  if (isLoading) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#fafafa",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div
          style={{
            width: "50px",
            height: "50px",
            border: "4px solid #e0e0e0",
            borderTopColor: "#0d47a1",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <p style={{ marginTop: "1.5rem", color: "#666", fontSize: "1rem" }}>
          Loading news...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#dc2626", marginBottom: "1rem" }}>
            Failed to load news. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 24px",
              background: "#0d47a1",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <style>{`
        .news-page { min-height: 100vh; background: #fafafa; }
        .news-hero { background: linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%); padding: 120px 2rem 60px; text-align: center; }
        .news-hero h1 { font-size: 3.5rem; color: white; margin: 0 0 1rem 0; }
        .news-hero p { font-size: 1.2rem; color: rgba(255,255,255,0.9); max-width: 600px; margin: 0 auto; }
        .news-container { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; }
        .news-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
        .news-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s ease; display: flex; flex-direction: column; text-decoration: none; color: inherit; }
        .news-card:hover { transform: translateY(-8px); box-shadow: 0 12px 40px rgba(13, 71, 161, 0.15); }
        .news-card-image { position: relative; height: 220px; overflow: hidden; }
        .news-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .news-card:hover .news-card-image img { transform: scale(1.1); }
        .news-card-category { position: absolute; top: 16px; left: 16px; padding: 6px 14px; background: rgba(13, 71, 161, 0.9); color: white; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
        .news-card-content { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
        .news-card-title { font-size: 1.35rem; font-weight: 600; color: #1a1a1a; margin: 0 0 0.75rem 0; line-height: 1.4; }
        .news-card-excerpt { font-size: 0.95rem; color: #666; line-height: 1.6; margin: 0 0 1rem 0; flex: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .news-card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #e8eaed; }
        .news-card-meta { display: flex; flex-direction: column; gap: 4px; }
        .news-card-date { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #888; }
        .news-card-author { font-size: 0.85rem; color: #0d47a1; font-weight: 500; }
        .news-card-link { display: flex; align-items: center; gap: 6px; color: #0d47a1; font-weight: 600; font-size: 0.9rem; }
        .news-card:hover .news-card-link { gap: 10px; }
        .empty-state { text-align: center; padding: 4rem 2rem; background: white; border-radius: 12px; }
        .empty-state h3 { color: #333; margin: 0 0 0.5rem 0; }
        .empty-state p { color: #666; margin: 0; }
        @media (max-width: 768px) {
          .news-hero { padding: 80px 1rem 40px; }
          .news-hero h1 { font-size: 2.5rem; }
          .news-container { padding: 2rem 1rem; }
          .news-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section className="news-hero">
        <h1>Latest News</h1>
        <p>
          Stay updated with the latest news, announcements, and stories from our
          community.
        </p>
      </section>

      <div className="news-container">
        {newsList.length === 0 ? (
          <div className="empty-state">
            <h3>No News Articles</h3>
            <p>Check back later for the latest updates.</p>
          </div>
        ) : (
          <div className="news-grid">
            {newsList.map((news) => (
              <Link
                key={news.id}
                href={`/news/${news.slug}`}
                className="news-card"
              >
                <div className="news-card-image">
                  <img src={news.featuredImage} alt={news.title} />
                  {news.category && (
                    <span className="news-card-category">{news.category}</span>
                  )}
                </div>
                <div className="news-card-content">
                  <h2 className="news-card-title">{news.title}</h2>
                  <p className="news-card-excerpt">{news.excerpt}</p>
                  <div className="news-card-footer">
                    <div className="news-card-meta">
                      <span className="news-card-date">
                        <FaCalendarAlt />{" "}
                        {new Date(news.publishedDate).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </span>
                      {news.author && (
                        <span className="news-card-author">
                          By {news.author}
                        </span>
                      )}
                    </div>
                    <span className="news-card-link">
                      Read More <FaArrowRight />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
