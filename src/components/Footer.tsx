import { site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <p className="footer__name display" aria-hidden="true">
        {site.firstName}
      </p>
      <div className="footer__row">
        <ul className="footer__links">
          <li>
            <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
          </li>
          {site.contact.showPhone ? (
            <li>
              <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`}>{site.contact.phone}</a>
            </li>
          ) : null}
          {site.links.linkedin ? (
            <li>
              <a href={site.links.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </li>
          ) : null}
          {site.links.github ? (
            <li>
              <a href={site.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </li>
          ) : null}
        </ul>
        <p className="mono">
          {site.name}, {year}.
        </p>
      </div>
    </footer>
  );
}
