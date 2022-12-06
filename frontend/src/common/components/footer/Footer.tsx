import React from "react";
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
            <a href="https://www2.gov.bc.ca/gov/content/home/disclaimer">
              Disclaimer
            </a>
          </li>
          <li>
            <a href="https://www2.gov.bc.ca/gov/content/home/privacy">
              Privacy
            </a>
          </li>
          <li>
            <a href="https://www2.gov.bc.ca/gov/content/home/accessibility">
              Accessibility
            </a>
          </li>
          <li>
            <a href="https://www2.gov.bc.ca/gov/content/home/copyright">
              Copyright
            </a>
          </li>
          <li>
            <a href="https://www2.gov.bc.ca/gov/content/home/get-help-with-government-services">
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};
