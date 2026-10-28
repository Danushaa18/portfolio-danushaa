import { site } from "@/content/site";

export function About() {
  const { education } = site;
  return (
    <section id="about" className="about section-dark" aria-labelledby="about-title">
      <h2 id="about-title" className="about__title display">
        About
      </h2>
      <div className="about__body">
        <p className="about__lede serif">{site.summary}</p>
        <p className="serif">
          I studied Electronics and Communication, which is how my first job ended up beside servo motors and
          sensor modules. The habit that stayed with me from that work is checking software against something
          real. Today that something is a client&rsquo;s campaign numbers, a payroll run or an invoice.
        </p>
        <h3 className="about__sub mono">How I work</h3>
        <ul className="about__approach serif">
          {site.approach.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
      <aside className="about__edu" aria-label="Education">
        <p className="mono">Education</p>
        <p className="about__edu-degree serif">{education.degree}</p>
        <p className="serif">{education.school}</p>
        <p className="mono">
          {education.years} / {education.grade}
        </p>
      </aside>
    </section>
  );
}
