import { ONROUTE_WEBPAGE_LINKS } from "../../../routes/constants";
import "./Footer.scss";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <ul>
          <li>
            <a href={ONROUTE_WEBPAGE_LINKS.HOME}>
              Home
            </a>
          </li>
          <li>
            <a href={ONROUTE_WEBPAGE_LINKS.DISCLAIMER}>
              Disclaimer
            </a>
          </li>
          <li>
            <a href={ONROUTE_WEBPAGE_LINKS.PRIVACY}>
              Privacy
            </a>
          </li>
          <li>
            <a href={ONROUTE_WEBPAGE_LINKS.ACCESSIBILITY}>
              Accessibility
            </a>
          </li>
          <li>
            <a href={ONROUTE_WEBPAGE_LINKS.COPYRIGHT}>
              Copyright
            </a>
          </li>
          <li>
            <a href={ONROUTE_WEBPAGE_LINKS.CONTACT_US}>
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
