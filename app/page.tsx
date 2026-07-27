import { StatCounter } from "./StatCounter";

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
            <a href="#portal">Alumni</a>
            <a href="#portal">Parent Portal</a>
            <a href="#portal">Student Login</a>
          </nav>
        </div>
      </div>

      {/* Main Header & Brand Bar */}
      <header>
        <div className="wrap brandRow">
          <a className="brand" href="#home" aria-label="Sunshine Public School home">
            <span className="crest" aria-hidden="true">S</span>
            <div className="brandText">
              <strong>SUNSHINE PUBLIC SCHOOL</strong>
              <small>Learning <b>•</b> Leadership <b>•</b> Character</small>
            </div>
          </a>
          <a className="admissionTop" href="#admissions">
            ADMISSIONS OPEN 2026–27
          </a>
          <a className="menu" href="#navigation" aria-label="Open navigation">
            ☰
          </a>
        </div>
        <nav id="navigation" className="mainNav" aria-label="Main navigation">
          <div className="wrap">
            <a className="active" href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#academics">Academics</a>
            <a href="#admissions">Admissions</a>
            <a href="#life">Student Life</a>
            <a href="#achievements">Achievements</a>
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
              <a className="goldButton group" href="#admissions">
                <span>Explore Admissions</span>
                <Arrow />
              </a>
              <a className="textLink group" href="#about">
                <span>Discover Our School</span>
                <Arrow />
              </a>
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
                <small>CBSE Board Success</small>
              </div>
            </div>
          </div>
        </div>
        <div className="heroImage" role="img" aria-label="Sunshine Public School campus and students" />
      </section>

      {/* Live Announcement Bar */}
      <a className="notice" href="#notices">
        <div className="wrap noticeInner">
          <span className="noticeTitle">◉ LATEST ANNOUNCEMENT</span>
          <span className="noticeText">
            Admissions open for Nursery to Grade XI (Session 2026–27) &nbsp;•&nbsp; Campus tours every Saturday at 10:00 AM
          </span>
          <Arrow />
        </div>
      </a>

      {/* Quick Access Services */}
      <section className="wrap" aria-label="Quick links">
        <div className="quickGrid">
          <a href="#admissions" className="quickCard">
            <Icon>▤</Icon>
            <span>Apply Online</span>
            <Arrow />
          </a>
          <a href="#academics" className="quickCard">
            <Icon>▦</Icon>
            <span>Academic Calendar</span>
            <Arrow />
          </a>
          <a href="#contact" className="quickCard">
            <Icon>▣</Icon>
            <span>School Transport</span>
            <Arrow />
          </a>
          <a href="#contact" className="quickCard">
            <Icon>☎</Icon>
            <span>Contact Helpdesk</span>
            <Arrow />
          </a>
        </div>
      </section>

      {/* Editorial About Section */}
      <section id="about" className="wrap intro">
        <div>
          <p className="sectionTag">WELCOME TO SUNSHINE</p>
          <h2>Education that builds character—and a future.</h2>
        </div>
        <div>
          <p>
            For over 25 years, Sunshine Public School has empowered children to discover their authentic strengths through rigorous academic pathways, holistic co-curricular immersion, and individualized educator mentoring.
          </p>
          <a className="textLinkDark group" href="#academics">
            <span>Meet our leadership &amp; faculty</span>
            <Arrow />
          </a>
        </div>
      </section>

      {/* Academic Journey */}
      <section id="academics" className="programs">
        <div className="wrap">
          <div className="sectionHead">
            <div>
              <p className="sectionTag">ACADEMIC PATHWAYS</p>
              <h2>Learning tailored for every stage</h2>
            </div>
            <p>
              Purpose-built CBSE programmes foster conceptual depth, collaborative inquiry, and critical thinking from early childhood through senior secondary.
            </p>
          </div>
          <div className="cardGrid">
            <article className="programCard">
              <span className="numeralAnchor">01</span>
              <h3>Foundational Years</h3>
              <p>Joyful, experiential play-led curriculum nurturing sensory discovery, literacy, and social confidence for Nursery to Grade II.</p>
              <a href="#contact">
                <span>Explore Foundational Stage</span>
                <Arrow />
              </a>
            </article>
            <article className="programCard">
              <span className="numeralAnchor">02</span>
              <h3>Middle School</h3>
              <p>Conceptual mastery, STEM exploration, humanities, and creative project inquiry for Grades III–VIII.</p>
              <a href="#contact">
                <span>Explore Middle School</span>
                <Arrow />
              </a>
            </article>
            <article className="programCard">
              <span className="numeralAnchor">03</span>
              <h3>Senior Secondary</h3>
              <p>Future-focused CBSE streams (Science, Commerce, Humanities) paired with career mentoring and competitive exam guidance.</p>
              <a href="#contact">
                <span>Explore Senior School</span>
                <Arrow />
              </a>
            </article>
          </div>
        </div>
      </section>

      {/* Excellence & Statistics */}
      <section id="achievements" className="wrap achievement">
        <div>
          <p className="sectionTag">EXCELLENCE IN ACTION</p>
          <h2>Big ambitions.<br />Remarkable outcomes.</h2>
          <p>
            Our scholars consistently excel in national board exams, Olympiads, robotics showcases, state sports meets, and performing arts festivals—guided by experienced educators in a vibrant environment.
          </p>
          <a className="goldButton group" href="#notices">
            <span>View Student Achievements</span>
            <Arrow />
          </a>
        </div>
        <div className="achievementStats">
          <div className="statBox">
            <StatCounter value="98.6%" />
            <span>School Topper Score (Grade XII)</span>
          </div>
          <div className="statBox">
            <StatCounter value="40+" />
            <span>National &amp; District Sports Awards</span>
          </div>
          <div className="statBox">
            <StatCounter value="18:1" />
            <span>Student–Teacher Learning Ratio</span>
          </div>
          <div className="statBox">
            <StatCounter value="30+" />
            <span>Clubs &amp; Student Societies</span>
          </div>
        </div>
      </section>

      {/* Beyond the Classroom */}
      <section id="life" className="life">
        <div className="wrap">
          <div className="sectionHead">
            <div>
              <p className="sectionTag">BEYOND THE CLASSROOM</p>
              <h2>A campus alive with possibility</h2>
            </div>
            <p>
              From athletic grounds and coding labs to music studios and community outreach, every student finds their voice.
            </p>
          </div>
          <div className="lifeGrid">
            <div className="lifePhoto one">
              <span>Sports &amp; Athletic Excellence</span>
            </div>
            <div className="lifePhoto two">
              <span>Robotics &amp; Innovation Labs</span>
            </div>
            <div className="lifePhoto three">
              <span>Performing Arts &amp; Cultural Guild</span>
            </div>
          </div>
        </div>
      </section>

      {/* School Updates */}
      <section id="notices" className="wrap news">
        <div className="sectionHead">
          <div>
            <p className="sectionTag">SCHOOL UPDATES</p>
            <h2>Latest news &amp; notices</h2>
          </div>
          <a className="textLinkDark group" href="#">
            <span>View All Notices</span>
            <Arrow />
          </a>
        </div>
        <div className="newsGrid">
          <article className="newsCard">
            <time>12 JUL 2026</time>
            <h3>Admissions for the 2026–27 Academic Session are now open</h3>
            <a href="#admissions">
              <span>Read Announcement</span>
              <Arrow />
            </a>
          </article>
          <article className="newsCard">
            <time>08 JUL 2026</time>
            <h3>Annual Inter-House Science &amp; Innovation Showcase 2026</h3>
            <a href="#">
              <span>Read Full Story</span>
              <Arrow />
            </a>
          </article>
          <article className="newsCard">
            <time>02 JUL 2026</time>
            <h3>Sunshine Athletics Team Triumphs at District Championship</h3>
            <a href="#">
              <span>Read Full Story</span>
              <Arrow />
            </a>
          </article>
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
          <div className="admissionButtons">
            <a className="goldButton group" href="mailto:admissions@sunshineps.edu.in">
              <span>Start Online Application</span>
              <Arrow />
            </a>
            <a className="outlineButton" href="tel:+911145678900">
              Book a Campus Visit
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
            <a href="#life">Student Life</a>
            <a href="#admissions">Admissions</a>
          </div>
          <div>
            <h4>Portals</h4>
            <a href="#">Parent Portal</a>
            <a href="#">Student Login</a>
            <a href="#notices">School Notices</a>
            <a href="#contact">Careers at Sunshine</a>
          </div>
          <div>
            <h4>Visit Us</h4>
            <p>Sector 45, Gurugram<br />Haryana 122003, India</p>
            <p>+91 11 4567 8900<br />info@sunshineps.edu.in</p>
          </div>
        </div>
        <div className="wrap copyright">
          <span>© 2026 Sunshine Public School. All Rights Reserved.</span>
          <span>CBSE Affiliation No. 1234567 | School Code: 54321</span>
        </div>
      </footer>
    </main>
  );
}
