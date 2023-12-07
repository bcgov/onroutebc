import "./Footer.scss";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <ul>
          <li>
            <a href=".">Home</a>
          </li>
          <li>
            <a
              href="https://www2.gov.bc.ca/gov/content/home/disclaimer"
              target="_blank"
              rel="noopener noreferrer"
            >
              Disclaimer
            </a>
          </li>
          <li>
            <a
              href="https://www2.gov.bc.ca/gov/content/home/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy
            </a>
          </li>
          <li>
            <a
              href="https://www2.gov.bc.ca/gov/content/home/accessible-government"
              target="_blank"
              rel="noopener noreferrer"
            >
              Accessibility
            </a>
          </li>
          <li>
            <a
              href="https://www2.gov.bc.ca/gov/content/home/copyright"
              target="_blank"
              rel="noopener noreferrer"
            >
              Copyright
            </a>
          </li>
          <li>
            <a
              href="https://onroutebc.gov.bc.ca"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
