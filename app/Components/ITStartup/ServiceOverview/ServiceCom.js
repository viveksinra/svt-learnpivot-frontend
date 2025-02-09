import React from "react";
import Link from "next/link";
import Image from "next/image";

const services = [
    {
      title: "Interactive Learning",
      description: "We believe student engagement is key to effective education. Real innovation and positive learning experiences are the heart of success.",
      features: [
        "Engaging Lessons",
        "Interactive Quizzes",
        "Creative Projects",
        "Personalized Feedback",
        "Collaborative Discussions",
        "Educational Games",
      ],
      image: {
        src: "/images/services/it-service1.png",
        alt: "Interactive Learning Image",
        width: 852,
        height: 580,
      },
    },
    {
      title: "Curriculum Development",
      description: "We believe in designing curricula that inspire and challenge students. Our approach focuses on fostering creativity, critical thinking, and a love for learning.",
      features: [
        "Customized Lesson Plans",
        "Integrated Technology",
        "Hands-on Activities",
        "Multimedia Resources",
        "Assessment Tools",
        "Differentiated Instruction",
      ],
      image: {
        src: "/images/services/it-service2.png",
        alt: "Curriculum Development Image",
        width: 770,
        height: 582,
      },
    },
    {
      title: "Student Support Services",
      description: "We believe in providing comprehensive support to students to ensure their success. Our services are designed to foster growth, resilience, and a positive learning environment.",
      features: [
        "Academic Counseling",
        "Mentorship Programs",
        "Peer Tutoring",
        "Parent-Teacher Communication",
        "Enrichment Programs",
        "Social-Emotional Learning",
      ],
      image: {
        src: "/images/services/it-service3.png",
        alt: "Student Support Services Image",
        width: 600,
        height: 463,
      },
    },
  ];
  

const ServiceCom = () => {
  return (
    <>
      <div className="overview-area ptb-100">
        <div className="container">
          {services.map((service, index) => (
            <div className="overview-box it-overview" key={index}>
              {index % 2 === 0 ? (
                <>
                  <div
                    className="overview-image"
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay="100"
                    data-aos-once="true"
                  >
                    <div className="image">
                      <Image
                        src={service.image.src}
                        alt={service.image.alt}
                        width={service.image.width}
                        height={service.image.height}
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="overview-content">
                    <div className="content">
                      <h2>{service.title}</h2>
                      <p>{service.description}</p>

                      <ul className="features-list">
                        {service.features.map((feature, index) => (
                          <li key={index}>
                            <span>
                              <i className="bx bxs-badge-check"></i> {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* <div className="rm-btn">
                        <Link href={`/services/${index + 1}`} className="default-btn">
                          Read More <span></span>
                        </Link>
                      </div> */}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="overview-content">
                    <div className="content">
                      <h2>{service.title}</h2>
                      <p>{service.description}</p>

                      <ul className="features-list">
                        {service.features.map((feature, index) => (
                          <li key={index}>
                            <span>
                              <i className="bx bxs-badge-check"></i> {feature}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* <div className="rm-btn">
                        <Link href={`/services/${index + 1}`} className="default-btn">
                          Read More <span></span>
                        </Link>
                      </div> */}
                    </div>
                  </div>

                  <div
                    className="overview-image"
                    data-aos="fade-up"
                    data-aos-duration="800"
                    data-aos-delay="100"
                    data-aos-once="true"
                  >
                    <div className="image">
                      <Image
                        src={service.image.src}
                        alt={service.image.alt}
                        width={service.image.width}
                        height={service.image.height}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ServiceCom;
