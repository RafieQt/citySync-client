import { HeartHandshake } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="cs-footer p-10 mb-5">
      <div className="footer sm:footer-horizontal">
        <aside className="flex flex-col gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-2xl"
            style={{ color: "#f1f5f3" }}
          >
            <span
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ backgroundColor: "var(--color-accent)", color: "var(--color-primary)" }}
            >
              <HeartHandshake size={24} />
            </span>
            CitySync
          </Link>
          <p className="mt-2 text-sm" style={{ color: "rgba(241, 245, 243, 0.7)" }}>
            Making cities better,<br />one reported issue at a time.
          </p>
        </aside>

        <nav>
          <h6 className="footer-title" style={{ color: "var(--color-accent)", opacity: 0.9 }}>Services</h6>
          <Link to='/submitIssue' className="link link-hover" style={{ color: "rgba(241, 245, 243, 0.75)" }}>Report Issue</Link>
          <a className="link link-hover" style={{ color: "rgba(241, 245, 243, 0.75)" }}>Track Status</a>
          <a className="link link-hover" style={{ color: "rgba(241, 245, 243, 0.75)" }}>Premium Boost</a>
        </nav>

        <nav>
          <h6 className="footer-title" style={{ color: "var(--color-accent)", opacity: 0.9 }}>Company</h6>
          <Link to="/aboutUs" className="link link-hover" style={{ color: "rgba(241, 245, 243, 0.75)" }}>About us</Link>
          <Link to="/contactUs" className="link link-hover" style={{ color: "rgba(241, 245, 243, 0.75)" }}>Contact</Link>
          <a className="link link-hover" style={{ color: "rgba(241, 245, 243, 0.75)" }}>Jobs</a>
        </nav>

        <nav>
          <h6 className="footer-title" style={{ color: "var(--color-accent)", opacity: 0.9 }}>Legal</h6>
          <a className="link link-hover" style={{ color: "rgba(241, 245, 243, 0.75)" }}>Terms of use</a>
          <a className="link link-hover" style={{ color: "rgba(241, 245, 243, 0.75)" }}>Privacy policy</a>
          <a className="link link-hover" style={{ color: "rgba(241, 245, 243, 0.75)" }}>Cookie policy</a>
        </nav>

        <nav>
          <h6 className="footer-title" style={{ color: "var(--color-accent)", opacity: 0.9 }}>Socials</h6>
          <Link to="https://www.facebook.com/" className="link link-hover" style={{ color: "rgba(241, 245, 243, 0.75)" }}>Facebook</Link>
          <Link to="https://www.youtube.com/" className="link link-hover" style={{ color: "rgba(241, 245, 243, 0.75)" }}>Youtube</Link>
          <Link to="https://www.instagram.com/" className="link link-hover" style={{ color: "rgba(241, 245, 243, 0.75)" }}>Instagram</Link>
        </nav>
      </div>

      <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm" style={{ color: "rgba(241, 245, 243, 0.6)" }}>
        <p>© {new Date().getFullYear()} CitySync. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;