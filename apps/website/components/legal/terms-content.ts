export interface TermsSection {
  id: string;
  title: string;
  paragraphs: readonly string[];
  items?: readonly string[];
}

// Working copy only. Confirm the legal entity, contact details, jurisdiction,
// and service-specific terms before approving this document for publication.
export const termsDocument = {
  title: 'Terms of use',
  updatedAt: '2026-11-07',
  updatedLabel: 'November 7, 2026',
  status: 'Draft for review',
  introduction: 'A few things to know when exploring our website, using your account, or taking the first step toward a home project.',
};

export const termsSections: readonly TermsSection[] = [
  {
    id: 'preamble',
    title: 'Preamble',
    paragraphs: [
      'These draft terms describe the proposed conditions for using the Southern Home Services Group (SHSG) website and its account features. References to “we,” “us,” and “our” mean SHSG in relation to this website. References to “you” mean the person visiting or using it.',
      'This website helps you explore the Southern Home family and find a starting point for repairs, improvements, and renovation projects. A project itself is governed by the agreement you make with the business carrying out the work. These website terms do not replace that agreement.',
    ],
  },
  {
    id: 'our-services',
    title: 'Our services',
    paragraphs: [
      'SHSG brings together information about Southern Home Handyman and Boxwood. Service descriptions help you understand the kinds of work each business may offer. Availability, service areas, qualifications, and the suitability of a particular project must be confirmed directly with the relevant team.',
      'Website descriptions and illustrative images are general information. They are not a promise that a particular service, material, finish, or appointment is available for your property.',
    ],
  },
  {
    id: 'accounts',
    title: 'Your account',
    paragraphs: ['If you create an account, provide accurate information and keep your contact details up to date. Use an email address you control, choose a password you do not use elsewhere, and keep your login details private.', 'Use only an account you are authorized to access. If you believe someone has accessed your account without permission, stop using the affected credentials and contact the team through an established business contact channel.'],
  },
  {
    id: 'project-requests',
    title: 'Project requests & estimates',
    paragraphs: [
      'A project idea, saved planning brief, or initial conversation does not reserve an appointment or create an agreement to carry out work. An estimate, scope, schedule, and any acceptance requirements must be confirmed with the relevant business.',
      'The website’s project planner currently prepares a brief on your device for you to save or share. It does not send that brief to our team, produce a binding estimate, or book a service. Follow the instructions shown by a feature when deciding how to take the next step.',
    ],
  },
  {
    id: 'pricing-and-payments',
    title: 'Pricing & payments',
    paragraphs: [
      'The price of a project depends on its agreed scope, property conditions, materials, and other requirements. Confirm what is included, any taxes or fees, and the payment schedule in your project agreement before authorizing work.',
      'Deposits, invoices, cancellations, refunds, warranties, and changes to approved work should be addressed in that agreement. These website terms do not create a separate payment obligation or replace the terms supplied by the business doing the work.',
    ],
  },
  {
    id: 'acceptable-use',
    title: 'Acceptable use',
    paragraphs: ['Use the website respectfully and only for lawful purposes. In particular, do not:'],
    items: ['Attempt to access another person’s account, private information, or systems without permission.', 'Submit misleading information, impersonate another person, or misuse a business’s identity.', 'Upload malicious software, interfere with the website, or attempt to bypass security controls.', 'Use contact or account features to send spam, threats, or abusive material.'],
  },
  {
    id: 'content-and-ownership',
    title: 'Content & ownership',
    paragraphs: [
      'Website text, design, branding, and images may belong to SHSG, a business in the Southern Home family, or another rights holder. You may read and use information to consider a project, but must obtain permission before republishing protected content or using a brand in a way that suggests endorsement.',
      'You retain any rights you hold in your own project information and photographs. Share only material you own or have permission to share, and avoid including another person’s private information without authorization. Any additional permission needed to deliver a specific service should be explained when that service is offered.',
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy & personal information',
    paragraphs: [
      'Provide only information relevant to your account or project. Avoid sending passwords, payment-card details, access codes, or other sensitive information through a general project description or message.',
      'These website terms do not replace a privacy notice. Review the privacy information provided with a feature or by the business you contact before sharing personal information. The relevant privacy and consent wording must be confirmed before introducing new data-collection features.',
    ],
  },
  {
    id: 'third-party-links',
    title: 'Links to other websites',
    paragraphs: ['Some links take you to another website, including websites operated by businesses in the Southern Home family. Those websites may have their own terms, privacy notices, contact processes, and service agreements.', 'Check the destination and its policies before creating an account, sending information, or making a payment. A link on this website does not change the agreement you make with another business.'],
  },
  {
    id: 'availability',
    title: 'Website availability',
    paragraphs: ['We aim to keep the website useful and accurate. Features may be updated or temporarily unavailable during maintenance or when a technical issue occurs. Confirm time-sensitive project details directly with the relevant team.', 'Information on this website is general guidance and is not a substitute for an on-site assessment or advice from a qualified professional. For an emergency or an immediate danger to people or property, contact the appropriate emergency service.'],
  },
  {
    id: 'changes-to-terms',
    title: 'Changes to these terms',
    paragraphs: ['When these terms are approved, this page should identify their effective date and any later revision date. Material changes and any acceptance requirements should be communicated through an appropriate notice.', 'This version remains a working draft. It does not state a governing jurisdiction, dispute process, or limitation of liability; those provisions require review against the actual business arrangements and applicable requirements.'],
  },
  {
    id: 'contact',
    title: 'Questions & contact',
    paragraphs: [
      'If you have a question about a project, contact the Southern Home business you are working with using its established website or the contact details in your project documents. Include enough information for the team to identify the project without sharing unnecessary sensitive details.',
      'For questions about these draft website terms, ask that team to direct your enquiry to the appropriate SHSG contact. A confirmed legal entity and dedicated contact details will be added when this document is approved.',
    ],
  },
];
