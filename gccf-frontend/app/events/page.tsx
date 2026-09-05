"use client";

import { useState } from "react";
import { useEvents } from "@/lib/hooks";
import Link from "next/link";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaArrowRight } from "react-icons/fa";

export default function EventsPage() {
  const { data: eventsList = [], isLoading, error } = useEvents();
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

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
        <p style={{ marginTop: "1.5rem", color: "#666", fontSize: "1rem" }}>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#fafafa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#dc2626", marginBottom: "1rem" }}>Failed to load events. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 24px",
              background: "#0d47a1",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredEvents = filter === "all" 
    ? eventsList 
    : eventsList.filter(e => e.status === filter);

  return (
    <div className="events-page">
      <style>{`
        .events-page { min-height: 100vh; background: #fafafa; }
        .events-hero { background: linear-gradient(135deg, #0d47a1 0%, #2196f3 100%); padding: 120px 2rem 60px; text-align: center; }
        .events-hero h1 { font-size: 3.5rem; color: white; margin: 0 0 1rem 0; }
        .events-hero p { font-size: 1.2rem; color: rgba(255,255,255,0.9); max-width: 600px; margin: 0 auto; }
        .events-container { max-width: 1200px; margin: 0 auto; padding: 3rem 2rem; }
        .filter-section { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .filter-btn { padding: 12px 28px; border: 2px solid #e0e0e0; background: white; color: #666; font-size: 0.95rem; font-weight: 600; border-radius: 30px; cursor: pointer; transition: all 0.3s ease; }
        .filter-btn:hover { border-color: #0d47a1; color: #0d47a1; }
        .filter-btn.active { background: linear-gradient(135deg, #0d47a1, #2196f3); color: white; border-color: #0d47a1; }
        .events-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem; }
        .event-card { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s ease; display: flex; flex-direction: column; text-decoration: none; color: inherit; }
        .event-card:hover { transform: translateY(-8px); box-shadow: 0 12px 40px rgba(13, 71, 161, 0.15); }
        .event-card-image { position: relative; height: 200px; overflow: hidden; }
        .event-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .event-card:hover .event-card-image img { transform: scale(1.1); }
        .event-status-badge { position: absolute; top: 16px; right: 16px; padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; text-transform: capitalize; }
        .event-status-badge.upcoming { background: #e3f2fd; color: #0d47a1; }
        .event-status-badge.completed { background: #e8f5e9; color: #2e7d32; }
        .event-card-content { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
        .event-card-title { font-size: 1.35rem; font-weight: 600; color: #1a1a1a; margin: 0 0 0.75rem 0; line-height: 1.4; }
        .event-card-description { font-size: 0.95rem; color: #666; line-height: 1.6; margin: 0 0 1rem 0; flex: 1; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .event-card-details { display: flex; flex-direction: column; gap: 8px; margin-bottom: 1rem; }
        .event-card-detail { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #666; }
        .event-card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #e8eaed; }
        .event-card-link { display: flex; align-items: center; gap: 6px; color: #0d47a1; font-weight: 600; font-size: 0.9rem; }
        .event-card:hover .event-card-link { gap: 10px; }
        .empty-state { text-align: center; padding: 4rem 2rem; background: white; border-radius: 12px; grid-column: 1 / -1; }
        .empty-state h3 { color: #333; margin: 0 0 0.5rem 0; }
        .empty-state p { color: #666; margin: 0; }
        @media (max-width: 768px) {
          .events-hero { padding: 80px 1rem 40px; }
          .events-hero h1 { font-size: 2.5rem; }
          .events-container { padding: 2rem 1rem; }
          .events-grid { grid-template-columns: 1fr; }
          .filter-section { justify-content: center; }
        }
      `}</style>

      <section className="events-hero">
        <h1>Events</h1>
        <p>Discover upcoming and past events from our community. Join us for workshops, conferences, and more.</p>
      </section>

      <div className="events-container">
        <div className="filter-section">
          <button className={`filter-btn ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>All Events</button>
          <button className={`filter-btn ${filter === "upcoming" ? "active" : ""}`} onClick={() => setFilter("upcoming")}>Upcoming</button>
          <button className={`filter-btn ${filter === "completed" ? "active" : ""}`} onClick={() => setFilter("completed")}>Completed</button>
        </div>

        <div className="events-grid">
          {filteredEvents.length === 0 ? (
            <div className="empty-state">
              <h3>No Events Found</h3>
              <p>No events match the selected filter.</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <Link key={event.id} href={`/events/${event.slug}`} className="event-card">
                <div className="event-card-image">
                  <img src={event.mainImage} alt={event.title} />
                  <span className={`event-status-badge ${event.status}`}>{event.status}</span>
                </div>
                <div className="event-card-content">
                  <h2 className="event-card-title">{event.title}</h2>
                  <p className="event-card-description">{event.shortDescription}</p>
                  <div className="event-card-details">
                    <span className="event-card-detail">
                      <FaCalendarAlt /> {new Date(event.eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="event-card-detail">
                      <FaMapMarkerAlt /> {event.location}
                    </span>
                    {event.attendees !== undefined && event.attendees > 0 && (
                      <span className="event-card-detail">
                        <FaUsers /> {event.attendees} attendees
                      </span>
                    )}
                  </div>
                  <div className="event-card-footer">
                    <span className="event-card-link">View Details <FaArrowRight /></span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}