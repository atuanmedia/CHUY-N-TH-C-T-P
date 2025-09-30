import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="site-footer-compact">
      <div className="footer-container-compact">
        <p className="copyright-text-compact">
          &copy; {new Date().getFullYear()} Quản Lý Chung Cư. Phát triển bởi NGUYEN DUY ANH TUAN.
        </p>
        <ul className="social-icons-compact">
          <li><a className="facebook" href="#"><FaFacebook /></a></li>
          <li><a className="twitter" href="#"><FaTwitter /></a></li>
          <li><a className="instagram" href="#"><FaInstagram /></a></li>
          <li><a className="linkedin" href="#"><FaLinkedin /></a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;