import Link from "next/link";
import { StatCounter } from "./StatCounter";
import ParticleButton from "@/components/kokonutui/particle-button";

const Arrow = () => <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">→</span>;

const Icon = ({ children }: { children: React.ReactNode }) => (
  <span className="quickIcon" aria-hidden="true">{children}</span>
);

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Utility Contact & Portal Bar */}
      <div className="utility">
        <div className="wrap utilityInner">
          <div className="utilityItem">
            <span>☎</span>
            <a href="tel:+911145678900">+91 11 4567 8900</a>
          </div>
          <div className="utilityItem">
            <span>✉</span>
            <a href="mailto:info@sunshineps.edu.in">info@sunshineps.edu.in</a>
          </div>
          <div className="utilityItem">
            <span>⌖</span>
            <span>Sector 45, Gurugram, Haryana</span>
          </div>
          <nav aria-label="Portal links">
            <Link href="/login" style={{ color: "var(--gold-400)", fontWeight: 700 }}>
              🔒 Staff & Student Portal Login
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Header & Brand Bar */}
      <header>
        <div className="wrap brandRow">
          <Link className="brand" href="/" aria-label="Sunshine Public School home">
            <span className="crest" aria-hidden="true">S</span>
            <div className="brandText">
              <strong>SUNSHINE PUBLIC SCHOOL</strong>
              <small>Learning <b>•</b> Leadership <b>•</b> Character</small>
            </div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link className="admissionTop" href="/enquire">
              ADMISSIONS OPEN 2026–27
            </Link>
            <Link href="/login" style={{ textDecoration: "none" }}>
              <ParticleButton variant="default" size="sm">
                Portal Login
              </ParticleButton>
            </Link>
          </div>
        </div>
        <nav id="navigation" className="mainNav" aria-label="Main navigation">
          <div className="wrap">
            <Link className="active" href="/">Home</Link>
            <a href="#about">About Us</a>
            <a href="#principal">Principal&apos;s Message</a>
            <a href="#academics">Academics</a>
            <a href="#facilities">Facilities</a>
            <a href="#faculty">Faculty</a>
            <Link href="/enquire">Enquire Now</Link>
            <a href="#life">Student Life</a>
            <a href="#contact">Contact</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="heroCopy">
          <div className="heroCopyInner">
            <div className="badgePill">
              <span className="badgeDot"></span>
              EST. 1998 • CBSE AFFILIATED (NO. 1234567)
            </div>
            <h1>
              Where Bright <span>Minds Rise.</span>
            </h1>
            <p className="lede">
              A future-ready education rooted in timeless values, intellectual curiosity, and confident student leadership. Nurturing over 2,400 students across 15 acres of modern campus.
            </p>
            <div className="heroActions">
              <Link href="/enquire" style={{ textDecoration: "none" }}>
                <ParticleButton variant="default" size="lg">
                  Submit Admission Enquiry
                </ParticleButton>
              </Link>
              <Link href="/login" style={{ textDecoration: "none" }}>
                <ParticleButton variant="outline" size="lg">
                  Staff & Student Login
                </ParticleButton>
              </Link>
            </div>
            <div className="stats">
              <div>
                <StatCounter value="25+" />
                <small>Years of Excellence</small>
              </div>
              <div>
                <StatCounter value="2,400+" />
                <small>Active Students</small>
              </div>
              <div>
                <StatCounter value="100%" />
                <small>CBSE Pass Rate</small>
              </div>
            </div>
          </div>
        </div>
        <div className="heroVisual">
          <div className="imageWrapper">
            <img
              src="/hero-school.webp"
              alt="Sunshine Public School Students"
              width={700}
              height={500}
            />
          </div>
          <div className="floatingBadge">
            <span className="star">★</span>
            <div>
              <strong>Top 10 CBSE School</strong>
              <small>Gurugram District Ranking 2025</small>
            </div>
          </div>
        </div>
      </section>

      {/* Principal's Message Section */}
      <section id="principal" className="wrap news" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "clamp(1.5rem, 4vw, 3rem)", boxShadow: "var(--shadow-md)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: "100%", height: "360px", borderRadius: "var(--radius-md)", overflow: "hidden", border: "2px solid var(--gold-400)" }}>
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop"
                  alt="Principal Dr. Meenakshi Sundaram"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ position: "absolute", bottom: "1rem", left: "1rem", right: "1rem", background: "rgba(7,25,47,0.9)", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--gold-400)" }}>
                <strong style={{ color: "#fff", display: "block" }}>Dr. Meenakshi Sundaram</strong>
                <small style={{ color: "var(--gold-400)" }}>Principal & Academic Director (Ph.D. Education)</small>
              </div>
            </div>

            <div>
              <p className="sectionTag">LEADERSHIP VISION</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-3xl)", color: "var(--navy-900)", marginBottom: "1rem" }}>
                Principal&apos;s Message
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-base)", lineHeight: 1.7, marginBottom: "1rem" }}>
                &quot;At Sunshine Public School, education transcends textbooks. We empower young minds to ask bold questions, embrace scientific rigor, and lead with empathy. Our holistic curriculum blends academic rigor with athletic and creative expression.&quot;
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-base)", lineHeight: 1.7 }}>
                We invite parents to partner with us in preparing your children for global opportunities and lifelong leadership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* School Facilities */}
      <section id="facilities" className="features" style={{ background: "var(--cream-50)" }}>
        <div className="wrap">
          <div className="sectionHead">
            <div>
              <p className="sectionTag">CAMPUS INFRASTRUCTURE</p>
              <h2>World-class learning facilities</h2>
            </div>
            <p>Designed to ignite curiosity, physical fitness, and technological mastery.</p>
          </div>

          <div className="cardGrid">
            <div className="featureCard">
              <Icon>🔬</Icon>
              <h3>Advanced STEM & Robotics Labs</h3>
              <p>State-of-the-art Physics, Chemistry, Biology, and AI Robotics laboratories equipped with modern experimental apparatus.</p>
            </div>
            <div className="featureCard">
              <Icon>🏀</Icon>
              <h3>15-Acre Sports Complex</h3>
              <p>Olympic-standard basketball courts, synthetic running tracks, indoor badminton arena, and trained athletic coaches.</p>
            </div>
            <div className="featureCard">
              <Icon>📚</Icon>
              <h3>Digital Resource Library</h3>
              <p>Over 25,000 physical titles, e-book archives, quiet study pods, and online research databases for student projects.</p>
            </div>
            <div className="featureCard">
              <Icon>🎭</Icon>
              <h3>Auditorium & Arts Guild</h3>
              <p>600-seater acoustic auditorium hosting dramatics, music recitals, inter-house debates, and cultural showcases.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Showcase */}
      <section id="faculty" className="wrap news" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
        <div className="sectionHead">
          <div>
            <p className="sectionTag">DISTINGUISHED FACULTY</p>
            <h2>Meet our department leaders</h2>
          </div>
          <p>Dedicated educators fostering academic excellence and personal mentorship.</p>
        </div>

        <div className="newsGrid">
          <div className="newsCard" style={{ background: "#ffffff" }}>
            <div style={{ height: "200px", overflow: "hidden", borderRadius: "var(--radius-sm)", marginBottom: "1rem" }}>
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop"
                alt="Dr. Ananya Sharma"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-500)", fontWeight: 700 }}>
              Head of Science
            </span>
            <h3 style={{ margin: "0.25rem 0" }}>Dr. Ananya Sharma</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Ph.D. Physics • 14 Years Teaching Experience • Olympiad Mentor
            </p>
          </div>

          <div className="newsCard" style={{ background: "#ffffff" }}>
            <div style={{ height: "200px", overflow: "hidden", borderRadius: "var(--radius-sm)", marginBottom: "1rem" }}>
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop"
                alt="Prof. Rajesh Malhotra"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-500)", fontWeight: 700 }}>
              Mathematics Chair
            </span>
            <h3 style={{ margin: "0.25rem 0" }}>Prof. Rajesh Malhotra</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              M.Sc. Mathematics • Calculus & Competitive Exam Specialist
            </p>
          </div>

          <div className="newsCard" style={{ background: "#ffffff" }}>
            <div style={{ height: "200px", overflow: "hidden", borderRadius: "var(--radius-sm)", marginBottom: "1rem" }}>
              <img
                src="https://images.unsplash.com/photo-1580894732468-918939c4f1c9?q=80&w=400&auto=format&fit=crop"
                alt="Priya Nair"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <span style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--gold-500)", fontWeight: 700 }}>
              English & Humanities
            </span>
            <h3 style={{ margin: "0.25rem 0" }}>Priya Nair</h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              M.A. English Literature • Debating Society Director & Literary Editor
            </p>
          </div>
        </div>
      </section>

      {/* Admissions Callout */}
      <section id="admissions" className="admissions">
        <div className="wrap">
          <div>
            <p className="sectionTag">ADMISSIONS 2026–27</p>
            <h2>Give your child a bright beginning.</h2>
            <p>Schedule a personal campus tour, interact with our academic coordinators, and experience our learning environment.</p>
          </div>
          <div className="admissionButtons" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link href="/enquire" style={{ textDecoration: "none" }}>
              <ParticleButton variant="default" size="lg">
                Submit Online Enquiry
              </ParticleButton>
            </Link>
            <a href="mailto:admissions@sunshineps.edu.in" style={{ textDecoration: "none" }}>
              <ParticleButton variant="default" size="lg">
                Email Admissions
              </ParticleButton>
            </a>
            <a href="tel:+911145678900" style={{ textDecoration: "none" }}>
              <ParticleButton variant="outline" size="lg">
                Book a Campus Visit
              </ParticleButton>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact">
        <div className="wrap footerGrid">
          <div className="footerBrand">
            <span className="crest">S</span>
            <h3>SUNSHINE<br />PUBLIC SCHOOL</h3>
            <p>Learning • Leadership • Character</p>
          </div>
          <div>
            <h4>Explore</h4>
            <a href="#about">About Us</a>
            <a href="#academics">Academic Programs</a>
            <a href="#facilities">Campus Facilities</a>
            <a href="#faculty">Faculty</a>
            <Link href="/enquire">Online Enquiry</Link>
            <Link href="/login">Portal Sign In</Link>
          </div>
          <div>
            <h4>Admissions</h4>
            <p>Sector 45, Gurugram<br />Haryana 122003</p>
            <p style={{ marginTop: "1rem" }}>
              Phone: +91 11 4567 8900<br />
              Email: admissions@sunshineps.edu.in
            </p>
          </div>
          <div>
            <h4>CBSE Affiliation</h4>
            <p>Affiliation No. 1234567<br />School Code: 54321</p>
            <p style={{ marginTop: "1rem" }}>
              Hours: Mon – Sat<br />
              8:00 AM – 3:30 PM
            </p>
          </div>
        </div>
        <div className="wrap copyright">
          <span>© 2026 Sunshine Public School. All rights reserved.</span>
          <span>CBSE Affiliated Institution</span>
        </div>
      </footer>
    </main>
  );
}
