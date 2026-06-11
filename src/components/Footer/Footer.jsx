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
            style={{ color: "var(--color-bg)" }}
          >
            <span
              className="flex items-center justify-center w-10 h-10 rounded-xl"
              style={{ backgroundColor: "var(--color-accent)", color: "var(--color-primary)" }}
            >
              <HeartHandshake size={24} />
            </span>
            CitySync
          </Link>
          <p className="mt-2 text-sm opacity-80" style={{ color: "var(--color-bg)" }}>
            Making cities better,<br />one reported issue at a time.
          </p>
        </aside>

        <nav>
          <h6 className="footer-title" style={{ color: "var(--color-accent)", opacity: 0.9 }}>Services</h6>
          <Link to='/submitIssue'><a className="link link-hover">Report Issue</a></Link>
          <a className="link link-hover">Track Status</a>
          <a className="link link-hover">Premium Boost</a>
        </nav>

        <nav>
          <h6 className="footer-title" style={{ color: "var(--color-accent)", opacity: 0.9 }}>Company</h6>
          <a className="link link-hover">About us</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Jobs</a>
        </nav>

        <nav>
          <h6 className="footer-title" style={{ color: "var(--color-accent)", opacity: 0.9 }}>Legal</h6>
          <a className="link link-hover">Terms of use</a>
          <a className="link link-hover">Privacy policy</a>
          <a className="link link-hover">Cookie policy</a>
        </nav>
      </div>

      <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm opacity-80" style={{ color: "var(--color-bg)" }}>
        <p>© {new Date().getFullYear()} CitySync. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;