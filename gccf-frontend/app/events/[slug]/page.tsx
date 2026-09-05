"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEventBySlug } from "@/lib/hooks";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaUser, FaArrowLeft, FaClock } from "react-icons/fa";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: event, isLoading, error } = useEventBySlug(params.slug as string);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
        <p style={{ marginTop: "1.5rem", color: "#666", fontSize: "1rem" }}>Loading event...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#fafafa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#333" }}>Event Not Found</h1>
        <p style={{ color: "#666", marginBottom: "2rem" }}>The requested event could not be found.</p>
        <button
          onClick={() => router.push("/events")}
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
          <FaArrowLeft /> Back to Events
        </button>
      </div>
    );
  }

  const eventDate = new Date(event.eventDate);
  const isPast = eventDate < new Date();

  return (
    <div className="event-detail-page">
      <style>{`
        .event-detail-page { min-height: 100vh; background: #fafafa; }
        .event-hero { position: relative; height: 50vh; min-height: 400px; overflow: hidden; }
        .event-hero img { width: 100%; height: 100%; object-fit: cover; }
        .event-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%); display: flex; align-items: flex-end; padding: 3rem; }
        .event-hero-content { max-width: 900px; margin: 0 auto; width: 100%; }
        .event-status { display: inline-block; padding: 8px 20px; border-radius: 25px; font-size: 0.9rem; font-weight: 600; margin-bottom: 1rem; }
        .event-status.upcoming { background: #e3f2fd; color: #0d47a1; }
        .event-status.completed { background: #e8f5e9; color: #2e7d32; }
        .event-hero h1 { font-size: 3rem; color: white; margin: 0 0 1rem 0; line-height: 1.2; }
        .event-hero-excerpt { font-size: 1.25rem; color: rgba(255,255,255,0.9); margin: 0; line-height: 1.5; }
        .event-content-wrapper { max-width: 900px; margin: 0 auto; padding: 3rem 2rem; }
        .back-button { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: white; border: 1px solid #e0e0e0; border-radius: 6px; color: #333; font-weight: 500; cursor: pointer; transition: all 0.3s ease; margin-bottom: 2rem; }
        .back-button:hover { background: #0d47a1; color: white; border-color: #0d47a1; }
        .event-info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .event-info-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 20px rgba(0,0,0,0.08); display: flex; align-items: center; gap: 1rem; }
        .event-info-icon { width: 50px; height: 50px; background: #e3f2fd; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #0d47a1; font-size: 1.25rem; }
        .event-info-text h4 { margin: 0 0 4px 0; font-size: 0.85rem; color: #666; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; }
        .event-info-text p { margin: 0; font-size: 1.1rem; color: #333; font-weight: 600; }
        .event-content-card { background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow: hidden; margin-bottom: 2rem; }
        .event-content-header { padding: 1.5rem 2rem; border-bottom: 1px solid #e0e0e0; }
        .event-content-header h2 { margin: 0; color: #333; font-size: 1.5rem; }
        .event-content { padding: 2rem; font-size: 1.1rem; line-height: 1.8; color: #333; }
        .event-content p { margin-bottom: 1.5rem; }
        .event-gallery { padding: 2rem; border-top: 1px solid #e0e0e0; }
        .event-gallery h3 { margin: 0 0 1.5rem 0; color: #333; }
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 1rem; }
        .gallery-item { position: relative; aspect-ratio: 1; border-radius: 8px; overflow: hidden; cursor: pointer; }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .gallery-item:hover img { transform: scale(1.1); }
        .lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .lightbox img { max-width: 100%; max-height: 90vh; object-fit: contain; border-radius: 8px; }
        .lightbox-close { position: absolute; top: 2rem; right: 2rem; width: 50px; height: 50px; background: rgba(255,255,255,0.1); border: none; border-radius: 50%; color: white; font-size: 1.5rem; cursor: pointer; transition: all 0.3s ease; }
        .lightbox-close:hover { background: rgba(255,255,255,0.2); transform: rotate(90deg); }
        .cta-section { background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); padding: 2rem; text-align: center; }
        .cta-section h3 { margin: 0 0 1rem 0; color: #333; }
        .cta-section p { margin: 0 0 1.5rem 0; color: #666; }
        .cta-button { padding: 14px 32px; background: linear-gradient(135deg, #0d47a1, #2196f3); color: white; border: none; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .cta-button:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3); }
        @media (max-width: 768px) { .event-hero { height: 40vh; min-height: 300px; } .event-hero h1 { font-size: 1.75rem; } .event-hero-excerpt { font-size: 1rem; } .event-content { padding: 1.5rem; } .event-info-grid { grid-template-columns: 1fr; } }
      `}</style>

      <section className="event-hero">
        <img src={event.mainImage} alt={event.title} />
        <div className="event-hero-overlay">
          <div className="event-hero-content">
            <span className={`event-status ${event.status}`}>
              {event.status === "upcoming" ? "Upcoming Event" : "Completed Event"}
            </span>
            <h1>{event.title}</h1>
            <p className="event-hero-excerpt">{event.shortDescription}</p>
          </div>
        </div>
      </section>

      <div className="event-content-wrapper">
        <button className="back-button" onClick={() => router.push("/events")}>
          <FaArrowLeft /> Back to Events
        </button>

        <div className="event-info-grid">
          <div className="event-info-card">
            <div className="event-info-icon"><FaCalendarAlt /></div>
            <div className="event-info-text">
              <h4>Date</h4>
              <p>{eventDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="event-info-card">
            <div className="event-info-icon"><FaClock /></div>
            <div className="event-info-text">
              <h4>Time</h4>
              <p>{eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          <div className="event-info-card">
            <div className="event-info-icon"><FaMapMarkerAlt /></div>
            <div className="event-info-text">
              <h4>Location</h4>
              <p>{event.location}</p>
            </div>
          </div>

          {event.attendees !== undefined && event.attendees > 0 && (
            <div className="event-info-card">
              <div className="event-info-icon"><FaUsers /></div>
              <div className="event-info-text">
                <h4>Attendees</h4>
                <p>{event.attendees} people</p>
              </div>
            </div>
          )}
        </div>

        <div className="event-content-card">
          <div className="event-content-header">
            <h2>About This Event</h2>
          </div>
          <div className="event-content">
            {event.description.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {event.galleryImages && event.galleryImages.length > 0 && (
            <div className="event-gallery">
              <h3>Event Gallery</h3>
              <div className="gallery-grid">
                {event.galleryImages.map((image, index) => (
                  <div key={index} className="gallery-item" onClick={() => setSelectedImage(image)}>
                    <img src={image} alt={`${event.title} - Image ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {event.organizer && (
          <div className="event-content-card" style={{ padding: "1.5rem 2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div className="event-info-icon"><FaUser /></div>
              <div>
                <h4 style={{ margin: "0 0 4px 0", color: "#666", fontWeight: "500" }}>Organized by</h4>
                <p style={{ margin: 0, fontWeight: "600", color: "#333" }}>{event.organizer}</p>
              </div>
            </div>
          </div>
        )}

        {event.status === "upcoming" && !isPast && (
          <div className="cta-section">
            <h3>Interested in attending?</h3>
            <p>Join us for this exciting event. Registration may be required.</p>
            <button className="cta-button">Register Now</button>
          </div>
        )}

        {event.status === "completed" && (
          <div className="cta-section">
            <h3>This event has concluded</h3>
            <p>Thank you to everyone who attended! Check out our upcoming events.</p>
            <button className="cta-button" onClick={() => router.push("/events")}>View Upcoming Events</button>
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <button className="lightbox-close" onClick={() => setSelectedImage(null)}>×</button>
          <img src={selectedImage} alt="Gallery image" />
        </div>
      )}
    </div>
  );
}