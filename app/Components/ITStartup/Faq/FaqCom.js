import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton
} from "react-accessible-accordion";

// courseFaqData = [{
  //     id: "1",
  //     question: "",
  //     answer: ``
  // },]
const courseFaqData = [ 
  {
      id: "1",
      question: "When are the courses held?",
      answer: `<p>Please refer to the course information for specific dates and times.</p>`
  },
  {
      id: "2",
      question: "Where are the courses held?",
      answer: `<p>All courses are conducted online via the Zoom platform.</p>
               <p>This ensures an interactive learning environment with personalized attention and support for every student.</p>`
  },
  {
      id: "3",
      question: "Can participants leave the course at any time?",
      answer: `<p><strong>Withdrawal Policy</strong></p>
               <p>Yes, participants can withdraw from the course at any time with a 6-working-day notice. 
               A refund will be issued for all remaining classes. However, breaks in between the course are not permitted.</p>`
  },
  {
      id: "4",
      question: "What are the rules for the courses?",
      answer: `<p>To maintain a productive and interactive learning environment, the following rules apply:</p>
               <ul>
                 <li><strong>Device Requirement:</strong> Students must log in using a laptop. Tablets and phones are strictly prohibited.</li>
                 <li><strong>Internet Connectivity:</strong> A stable and high-speed internet connection is required.</li>
                 <li><strong>Camera & Microphone:</strong> Both must be fully functional to ensure active participation.</li>
                 <li><strong>Quiet Environment:</strong> Students should be seated alone in a quiet room, free from background noise.</li>
                 <li><strong>Punctuality:</strong> Students must join on time as the Zoom classes will be locked after the scheduled start.</li>
               </ul>`
  },
  {
      id: "4.5",
      question: "Can my child continue with other tuitions?",
      answer: `<p>No. Children should not attend other tuition for the following reasons:</p>
               <ul>
                 <li><strong>Conflict in methods:</strong> Every tutor has a different style of teaching. Putting the child in multiple tuition would have a severe impact in learning ability as it will cause confusion.</li>
                 <li><strong>Excessive workload:</strong> You don't want to overload your child with work.</li>
                 <li><strong>Our confidence:</strong> We are very confident that our teaching methods, resources, guidance and support are more than enough for a child to excel to full potential.</li>
               </ul>`
  },
  {
      id: "5",
      question: "What are the weekly responsibilities for parents?",
      answer: `<p>To ensure a smooth learning experience, parents are responsible for:</p>
               <ul>
                 <li><strong>Checking Equipment:</strong> Ensure the laptop and internet connection are functioning properly.</li>
                 <li><strong>Printing Materials:</strong> Print the required worksheets posted in the WhatsApp group a day before class.</li>
                 <li><strong>Monitoring Homework:</strong> Ensure homework is completed on time and submit the child’s score within 3 days.</li>
                 <li><strong>Communication:</strong> General questions should be posted in the WhatsApp group; personal concerns should be directed to the tutor privately.</li>
               </ul>`
  },
  {
      id: "6",
      question: "Whom and where should I contact in case of questions related to the course?",
      answer: `<p>Once the course starts, parents will be added to a designated WhatsApp group where they can post questions.</p>
               <p>For personal concerns, parents can reach out to the tutor privately.</p>`
  },
  {
      id: "7",
      question: "Privacy & Data Protection",
      answer: `<p>At Chelmsford 11 Plus, we prioritize your privacy and the security of your personal information.</p>
               <ul>
                 <li>Any personal data collected is strictly confidential and used only for service delivery.</li>
                 <li>We do not share, sell, or disclose your data to third parties unless required by law.</li>
                 <li>Industry-standard security measures are in place to prevent unauthorized access, misuse, or disclosure.</li>
               </ul>
               <p>For further details, please refer to our <a href='/policy/privacyPolicy'>Privacy Policy</a>.</p>`
  },
  {
      id: "8",
      question: "Copyright Policy",
      answer: `<p>To protect our educational materials, all participants must sign a Copyright Agreement.</p>
               <p>Any violation of our copyright policies will result in legal action and severe penalties.</p>
               <p>A declaration form will be provided, which must be printed, signed, and returned before the course begins.</p>`
  }
];

// csseMockFaqData = [{
  //     id: "1",
  //     question: "",
  //     answer: ``
  // },]
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

// fsseMockFaqData = [{
  //     id: "1",
  //     question: "",
  //     answer: ``
  // },]
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

// faqData = [{
  //     id: "1",
  //     question: "",
  //     answer: ``
  // },]
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
