import { useEffect, useState } from "react";

import sacramentoBeeLogo from "../../assets/press/sacramento-bee-black.svg";
import capRadioLogo from "../../assets/press/capradio_logo.svg";
import kcraLogo from "../../assets/press/kcra_logo.svg";
import fox40Logo from "../../assets/press/fox_40_logo.png";

import "./LocalPress.css";

function LocalPress() {
  const logos = [
    {
      src: sacramentoBeeLogo,
      alt: "The Sacramento Bee Logo",
      className: "bee-logo"
    },
    {
      src: capRadioLogo,
      alt: "CapRadio Logo"
    },
    {
      src: kcraLogo,
      alt: "KCRA 3 Logo"
    },
    {
      src: fox40Logo,
      alt: "FOX40 Logo"
    },
    {
      src: "https://static.wixstatic.com/media/071282_56422174ae564889a4881ef06508df03~mv2.png/v1/fill/w_419,h_139,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/sacramento-magazine-logo-white.png",
      alt: "Sacramento Magazine Logo"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((currIdx) => (currIdx + 1) % logos.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [logos.length]);

  return (
    <section className="local-press">
      <div className="local-press-container">

        <p className="local-press-label">
          AS SEEN & HEARD AROUND SACRAMENTO
        </p>

        {/* DESKTOP MARQUEE */}
        <div className="local-press-logos">
          <div className="local-press-track">

            <div className="local-press-group">
              {logos.map((logo) => (
                <img
                  key={`first-${logo.alt}`}
                  src={logo.src}
                  alt={logo.alt}
                  className={logo.className || ""}
                />
              ))}
            </div>

            <div
              className="local-press-group"
              aria-hidden="true"
            >
              {logos.map((logo) => (
                <img
                  key={`second-${logo.alt}`}
                  src={logo.src}
                  alt=""
                  className={logo.className || ""}
                />
              ))}
            </div>

          </div>
        </div>

        {/* MOBILE / TABLET ROTATION */}
        <div className="local-press-mobile">
          <img
            src={logos[activeIndex].src}
            alt={logos[activeIndex].alt}
            className={logos[activeIndex].className || ""}
          />
        </div>

      </div>
    </section>
  );
}

export default LocalPress;