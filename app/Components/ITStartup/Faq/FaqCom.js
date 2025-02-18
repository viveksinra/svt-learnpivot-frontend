import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from "react-accessible-accordion";

const courseFaqData = [
  {
      id: "1",
      question: "What subjects are covered in the courses?",
      answer: `<p>Our courses cover core subjects like Mathematics and English.</p>
      <p>Each course is designed to help students develop a strong foundation and prepare for exams effectively.</p>`
  },
  {
      id: "2",
      question: "When and how will I receive course materials?",
      answer: `<p>Course materials, including notes and practice exercises, will be shared weekly.</p>
      <p>They will be sent via email and uploaded to our online learning platform.</p>`
  },
  {
      id: "3",
      question: "Are the classes online or in-person?",
      answer: `<p>All classes are conducted online via Zoom.</p>
      <p>Students will receive Zoom links before each class session.</p>`
  },
  {
      id: "4",
      question: "What should students bring for the classes?",
      answer: `<p>Students should have the following items ready:</p>
      <ul>
        <li>A notebook and pen/pencil</li>
        <li>A stable internet connection</li>
        <li>A device with Zoom installed</li>
      </ul>`
  },
  {
      id: "5",
      question: "Is there a refund policy?",
      answer: `<p>We have a <strong>strict no-refund policy</strong>.</p>
      <p>Once payment is made, no cancellations or refunds will be processed.</p>`
  },
  {
      id: "6",
      question: "Are the sessions recorded?",
      answer: `<p>Yes, all sessions are recorded and will be available for students to review.</p>
      <p>Recordings will be accessible for a limited time after each session.</p>`
  },
  {
      id: "7",
      question: "How is student progress tracked?",
      answer: `<p>Regular assessments and quizzes will be conducted.</p>
      <p>Feedback and performance reports will be provided periodically.</p>`
  },
  {
      id: "8",
      question: "What if a student misses a class?",
      answer: `<p>If a student misses a class, they can access the recorded session later.</p>
      <p>No make-up classes will be offered.</p>`
  },
  {
      id: "9",
      question: "How can I contact the instructor?",
      answer: `<p>Students and parents can reach out via email or WhatsApp for any queries.</p>
      <p>Office hours for queries will be shared at the beginning of the course.</p>`
  },
  {
      id: "10",
      question: "What is the course schedule and duration?",
      answer: `<p>Each course follows a structured schedule, with specific start and end dates.</p>
      <p>Classes are held once a week for a set number of weeks.</p>`
  },
  {
      id: "11",
      question: "When is the payment due?",
      answer: `<p>Payments must be made before the course begins.</p>
      <p>Specific payment deadlines will be communicated during enrollment.</p>`
  },
  {
      id: "12",
      question: "Do you provide special accommodations?",
      answer: `<p>We strive to accommodate students with special needs.</p>
      <p>Please contact us in advance to discuss any required adjustments.</p>`
  },
  {
      id: "13",
      question: "What if I have further questions?",
      answer: `<p>For any additional questions, feel free to reach out via email or WhatsApp.</p>`
  }
];

const csseMockFaqData = [
  {
      id: "1",
      question: "What test papers are covered in each mock test?",
      answer: `<p>Each mock test includes two papers:</p>
      <ul>
        <li><strong>Mathematics:</strong> 60 minutes</li>
        <li><strong>English:</strong> 70 minutes</li>
      </ul>
      <p>There is a 15-minute break in between.</p>`
  },
  {
      id: "2",
      question: "When and how will I receive the results?",
      answer: `<p>Results are typically sent within a few hours of the test but may take up to 2 days.</p>
      <p>Detailed results will be posted to your private WhatsApp number.</p>`
  },
  {
      id: "3",
      question: "Will I receive the test papers?",
      answer: `<p>Marked papers are sent via first-class signed delivery on Mondays.</p>
      <p>They typically arrive the next day (Tuesday), but it may take up to 10 working days as per Royal Mail's service level agreement (SLA).</p>`
  },
  {
      id: "4",
      question: "What should children bring for the test?",
      answer: `<p>Children should bring the following items for the test:</p>
      <ul>
        <li>Two sharpened pencils or black biro pens</li>
        <li>An eraser</li>
        <li>A water bottle</li>
        <li>A small snack for the break</li>
      </ul>`
  },
  {
      id: "5",
      question: "Is parking available at the venue?",
      answer: `<p>Yes, free parking is available on-site. Please drive slowly in the parking lot and be considerate towards others.</p>
      <p>Parents are welcome to stay in the parking area during the test.</p>`
  },
  {
      id: "6",
      question: "Are there facilities for parents at the venue?",
      answer: `<p>There is no waiting room for parents. However, parents can use the restroom except during break time.</p>
      <p>Parents are welcome to stay in the parking area during the test.</p>`
  },
  {
      id: "7",
      question: "Do you provide refreshments?",
      answer: `<p>We do not provide refreshments. However, children are welcome to bring their own light snacks and a water bottle.</p>`
  },
  {
      id: "8",
      question: "What is your late arrival policy?",
      answer: `<p>Our late arrival policy is strict. Late arrivals will not be permitted.</p>
      <p>Please plan your journey in advance to avoid any disappointment.</p>`
  },
  {
      id: "9",
      question: "Do you accommodate children with special needs?",
      answer: `<p>We welcome all children and provide accommodations for those with special needs.</p>
      <p>Extra time can be arranged with an exam board letter to ensure every child has the support they need to succeed.</p>`
  },
  {
      id: "10",
      question: "What post-test support is available?",
      answer: `<p>We offer a paid revision session 5 days after the test to help children understand difficult questions.</p>
      <p>An overall anonymous result showing marks is shared.</p>
      <p>While we don't usually offer one-to-one feedback, we strive to cater to individual needs as much as possible.</p>`
  },
  {
      id: "11",
      question: "What is your booking and CANCELLATION policy?",
      answer: `<p>We have a <strong>strict no-cancellation policy</strong>, and no changes are allowed after booking.</p>
      <p>Only pre-booked children are permitted on the day of the test, and we do not accept cash payments at the venue.</p>`
  },
  {
      id: "12",
      question: "How difficult are the tests?",
      answer: `<p>All our mock tests are designed to align with the real CSSE standard, ensuring that students are well-prepared for the actual exam.</p>`
  },
  {
      id: "13",
      question: "What if I don't receive my CSSE marked papers?",
      answer: `<p>Usually, the post arrives within 2 days after the test. However, please allow up to 10 working days for Royal Mail delivery.</p>
      <p>If you haven't received your papers after 10 days, please contact us.</p>`
  }
];

const fsseMockFaqData = [
  {
      id: "1",
      question: "What test papers are covered in each mock test?",
      answer: `<p>Each mock test includes three papers:</p>
      <ul>
        <li><strong>Paper 1:</strong> Maths/English/Verbal Reasoning (30-40 minutes)</li>
        <li><strong>Paper 2:</strong> Maths/English/Verbal Reasoning (30-40 minutes)</li>
        <li><strong>Paper 3:</strong> Creative Writing (20 minutes)</li>
      </ul>
      <p>There is a 15-minute break between the papers.</p>`
  },
  {
      id: "2",
      question: "When and how will I receive the results?",
      answer: `<p>Results are typically sent within a few hours of the test, but it may take up to 2 days.</p>
      <p>Detailed results will be posted to your private WhatsApp number.</p>`
  },
  {
      id: "3",
      question: "Will I receive the test papers?",
      answer: `<p>A PDF file containing the incorrect questions, scanned answer sheets, and creative writing will be sent via WhatsApp within 3 days of the test.</p>`
  },
  {
      id: "4",
      question: "What should children bring for the test?",
      answer: `<p>Children should bring the following items for the test:</p>
      <ul>
        <li>Two black biro pens</li>
        <li>A water bottle</li>
        <li>Snacks</li>
      </ul>`
  },
  {
      id: "5",
      question: "Is parking available at the venue?",
      answer: `<p>Yes, free parking is available on-site. Please drive slowly in the parking lot and be considerate towards others.</p>
      <p>Parents are welcome to stay in the parking area during the test.</p>`
  },
  {
      id: "6",
      question: "Are there facilities for parents at the venue?",
      answer: `<p>There is no waiting room for parents. However, parents can use the restroom, except during break time.</p>
      <p>Parents are welcome to stay in the parking area during the test.</p>`
  },
  {
      id: "7",
      question: "Do you provide refreshments?",
      answer: `<p>We do not provide refreshments. However, children are welcome to bring their own light snacks and a water bottle.</p>`
  },
  {
      id: "8",
      question: "What is your late arrival policy?",
      answer: `<p>Our late arrival policy is strict. Late arrivals will not be permitted.</p>
      <p>Please plan your journey in advance to avoid any disappointment.</p>`
  },
  {
      id: "9",
      question: "Do you accommodate children with special needs?",
      answer: `<p>We welcome all children and provide accommodations for those with special needs.</p>
      <p>Extra time can be arranged with an exam board letter to ensure every child has the support they need to succeed.</p>`
  },
  {
      id: "10",
      question: "What post-test support is available?",
      answer: `<p>We offer a paid revision session 5 days after the test to help children understand difficult questions.</p>
      <p>An overall anonymous result showing marks is shared.</p>
      <p>While we don't usually offer one-to-one feedback, we strive to cater to individual needs as much as possible.</p>`
  },
  {
      id: "11",
      question: "What is your booking and CANCELLATION policy?",
      answer: `<p>We have a <strong>strict no-cancellation policy</strong>, and no changes are allowed after booking.</p>
      <p>Only pre-booked children are permitted on the day of the test, and we do not accept cash payments at the venue.</p>`
  },
  {
      id: "12",
      question: "How difficult are the tests?",
      answer: `<p>We strive to maintain a challenging level in our mock tests, although we do not have access to actual FSCE papers.</p>`
  }
];


const faqData = [
  {
    id: "1",
    question: "What services do you provide for 11+ preparation?",
    answer: `<p>We provide expert tuition for students preparing for the 11+ exams, covering all exam formats, including CSSE and FSCE. Our services include:</p>
    <ul>
      <li>Comprehensive group courses</li>
      <li>Realistic mock exams</li>
      <li>Tailored support for parents</li>
    </ul>
    <p>Ensuring a well-rounded approach to exam success.</p>`
  },
  {
    id: "2",
    question: "Who are your tutors?",
    answer: `<p>Our tutors are highly experienced professionals with a deep understanding of 11+ requirements and years of experience helping students succeed.</p>`
  },
  {
    id: "3",
    question: "What areas do your services cover?",
    answer: `<p>We specialise in preparing students for grammar schools in and around Essex. However, our Maths and English courses cover schools all around the country.</p>`
  },
  {
    id: "4",
    question: "How does your tuition work?",
    answer: `<p>We offer the following:</p>
    <ul>
      <li><strong>Group Courses:</strong> Focused groups where every child is involved.</li>
      <li><strong>Mock Exams:</strong> Realistic practice under timed conditions, with detailed feedback within 24-48 hours.</li>
      <li><strong>Practice Materials:</strong> Custom resources aligned with 11+ formats to help your child practice outside of our courses.</li>
    </ul>`
  },
  {
    id: "5",
    question: "When should my child start preparing?",
    answer: `<p>Every child and situation is unique. While we recommend starting intensive preparation 12-18 months in advance, our courses are designed to support students from Year 4 through to the summer before the exam, ensuring your child remains confident throughout the process.</p>
    <p><strong>Early preparation at home is crucial for success:</strong></p>
    <ul>
      <li>Encourage reading books</li>
      <li>Practice writing</li>
      <li>Memorize times tables</li>
    </ul>
    <p>These activities help build a solid foundation for their learning journey.</p>`
  },
  {
    id: "6",
    question: "Do you offer mock exams?",
    answer: `<p>We conduct mock exams throughout the year to help students experience real exam conditions. These exams provide detailed feedback, allowing students to identify areas for improvement and build confidence.</p>`
  },
  {
    id: "7",
    question: "How do you tailor your services to my child's needs?",
    answer: `<p>We start with an initial assessment to identify your child's strengths and areas for improvement. This helps us determine their current level and place them in the most suitable class for their needs.</p>`
  },
  {
    id: "8",
    question: "Where are your courses held?",
    answer: `<p>Our courses are conducted online via the Zoom platform. During each class, children will answer questions and have the opportunity to communicate directly with our tutor through private messaging. This setup ensures personalized attention and support for every student.</p>`
  },
  {
    id: "9",
    question: "How do I enrol my child in your program?",
    answer: `<p>You can enrol by contacting us through our website or by booking a course online. We will guide you through the process and ensure your satisfaction every step of the way.</p>`
  },
  {
    id: "10",
    question: "What makes your services unique?",
    answer: `<p>We take pride in offering:</p>
    <ul>
      <li>Expert tutors with a track record of proven results</li>
      <li>An adaptive approach to learning that caters to each student's unique needs</li>
      <li>Comprehensive resources specifically tailored to FSCE and CSSE formats</li>
      <li>A supportive and nurturing environment designed to help your child thrive and succeed</li>
    </ul>`
  },
  {
    id: "11",
    question: "Do you provide support for parents?",
    answer: `<p>Absolutely! We keep parents informed about their child's progress through regular updates and assigned homework tasks. Additionally, we provide guidance on how to support 11+ preparation outside of our courses, ensuring a comprehensive approach to your child's success.</p>`
  },
  {
    id: "12",
    question: "How do I find out more?",
    answer: `<p>Feel free to reach out to us directly through our website or by emailing us at <a href="mailto:support@chelmsford11plus.com">support@chelmsford11plus.com</a>. We're here to discuss your child's needs and how we can support them in their 11+ journey to success.</p>`
  },
  {
      id: "13",
      question: "Privacy & Data Protection",
      answer: `<p>At Chelmsford 11 Plus, we take your privacy seriously. Any personal information you provide is kept strictly confidential and used only for the purpose of delivering our services.</p>
      <p>We do not share, sell, or disclose your data to third parties without your consent, except where required by law.</p>
      <p>We implement industry-standard security measures to protect your information from unauthorized access, misuse, or disclosure.</p>
      <p>For more details on how we handle your data, please refer to our <a href='/policy/privacyPolicy'>Privacy Policy</a>.</p>`
  }
];
  

const FaqCom = ({dataType}) => {
  return (
    <div className="faq-area ptb-100">
      <div className="container">
      <div className="section-title">
  {/* <span className="sub-title">Answers to Common Questions</span> */}
  <h2>Frequently Asked Questions</h2>
  <p>
    Have questions about our { dataType === "csseMockFaqData" ? "CSSE Mock Test" : dataType === "fsseMockFaqData" ? "FSSE Mock Test" : "teaching services"}. Find answers below. We believe
    that clear communication and understanding are vital for successful
    learning experiences.
  </p>
</div>

        <div className="row">
          <div className="col-lg-12">
            <div className="faq-accordion">
              <Accordion allowZeroExpanded preExpanded={["a"]}>
                {dataType === "courseFaqData" && courseFaqData.map((faq) => (
                  <AccordionItem key={faq.id} uuid={faq.id}>
                    <AccordionItemHeading>
                      <AccordionItemButton>{faq.question}</AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                    <p className="accordion-content" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>

                    </AccordionItemPanel>
                  </AccordionItem>
                ))}
                {dataType === "faqData" && faqData.map((faq) => (
                  <AccordionItem key={faq.id} uuid={faq.id}>
                    <AccordionItemHeading>
                      <AccordionItemButton>{faq.question}</AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                    <p className="accordion-content" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>

                    </AccordionItemPanel>
                  </AccordionItem>
                ))}
                {dataType === "csseMockFaqData" && csseMockFaqData.map((faq) => (
                  <AccordionItem key={faq.id} uuid={faq.id}>
                    <AccordionItemHeading>
                      <AccordionItemButton>{faq.question}</AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <p className="accordion-content" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                    </AccordionItemPanel>
                  </AccordionItem>
                ))}
                {dataType === "fsseMockFaqData" && fsseMockFaqData.map((faq) => (
                  <AccordionItem key={faq.id} uuid={faq.id}>
                    <AccordionItemHeading>
                      <AccordionItemButton>{faq.question}</AccordionItemButton>
                    </AccordionItemHeading>
                    <AccordionItemPanel>
                      <p className="accordion-content" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                    </AccordionItemPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqCom;
