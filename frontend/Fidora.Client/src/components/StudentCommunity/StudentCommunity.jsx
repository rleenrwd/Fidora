import { Link } from "react-router-dom";

import avatar1 from "../../assets/community/avatar-1.png";
import avatar2 from "../../assets/community/avatar-2.png";
import avatar3 from "../../assets/community/avatar-3.png";
import avatar4 from "../../assets/community/avatar-4.png";
import avatar5 from "../../assets/community/avatar-5.png";

import "./StudentCommunity.css";

function StudentCommunity() {
  const communityBenefits = [
    {
      icon: "bi-people-fill",
      title: "Meet motivated students",
      description: "Find your people and build your crew."
    },
    {
      icon: "bi-chat-dots-fill",
      title: "Share the experience",
      description:
        "Study, connect, stay accountable, and celebrate your wins."
    },
    {
      icon: "bi-lightning-charge-fill",
      title: "Study your way, together",
      description: "Come solo or with friends — all are welcome."
    }
  ];

  const communityMembers = [
    { src: avatar1, alt: "Fidora community member" },
    { src: avatar2, alt: "Fidora community member" },
    { src: avatar3, alt: "Fidora community member" },
    { src: avatar4, alt: "Fidora community member" },
    { src: avatar5, alt: "Fidora community member" }
  ];

  return (
    <section className="student-community">
      <div className="student-community-container">

        <div className="community-card">

          <div className="community-avatars">
            {communityMembers.map((member, index) => (
              <div
                key={member.src}
                className={`community-avatar community-avatar-${index + 1}`}
              >
                <img
                  src={member.src}
                  alt={member.alt}
                />
              </div>
            ))}

            <div className="community-avatar community-avatar-more">
              +
            </div>
          </div>


          <div className="community-benefits">
            {communityBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="community-benefit"
              >
                <div className="community-benefit-icon">
                  <i className={`bi ${benefit.icon}`}></i>
                </div>

                <div className="community-benefit-content">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/book"
            className="community-cta"
          >
            Get Started
            <i className="bi bi-arrow-right"></i>
          </Link>

        </div>

        <div className="community-content">

          <div className="community-eyebrow">
            <i className="bi bi-people-fill"></i>
            <span>THE FIDORA COMMUNITY.</span>
          </div>

          <h2 className="community-title">
            Join 500+ Students 
            <br /> Already Studying
            <br />
            <span>At Fidora</span>
          </h2>

          <p className="community-description">
            Come solo or with your crew, meet motivated students, and make studying
            feel more connected. Fidora gives you a place to focus, collaborate,
            and enjoy the night.
          </p>

        </div>

      </div>
    </section>
  );
}

export default StudentCommunity;