export interface BlogSection {
  heading: string;
  paragraphs: string[];
  checklist?: string[];
}

export interface BlogArticle {
  slug: string;
  title: string;
  category: 'Planning' | 'Repairs' | 'Maintenance';
  description: string;
  image: string;
  imageAlt: string;
  published: string;
  sections: BlogSection[];
}

const planningImage = '/images/blog/repair-planning.webp';
const roomImage = '/images/blog/room-planning.webp';
const maintenanceImage = '/images/blog/home-maintenance.webp';

export const articles: BlogArticle[] = [
  {
    slug: 'how-to-plan-home-repairs',
    title: 'A shorter to-do list starts with a better home repair plan',
    category: 'Planning',
    description: 'Turn a collection of small repairs into a clear project brief. Learn what to photograph, how to group jobs, and what to ask before work begins.',
    image: planningImage,
    imageAlt: 'Illustration of a homeowner discussing a repair checklist with a craftsperson.',
    published: '2026-11-07',
    sections: [
      {
        heading: 'Start with what is happening, not a shopping list',
        paragraphs: [
          'A sticking door, a marked ceiling, and a loose shelf can feel like three unrelated problems. Before choosing materials or booking separate visits, write down what you have noticed in each room. Describe the symptom, when it began, and whether it has changed. A useful brief makes the first conversation more productive.',
          'Keep observations separate from a proposed fix. “The door catches along the top edge after rain” gives the team more to work with than “replace the door.” The right scope may only become clear after an assessment.',
        ],
      },
      {
        heading: 'Give each job a place in the plan',
        paragraphs: [
          'Group your list into issues that need assessment, maintenance you would like scheduled, and improvements that can wait. If something appears unsafe or is actively causing damage, seek appropriate professional help rather than waiting for a routine project visit.',
          'For the remaining work, think about dependencies. Resolving the cause of a wall mark comes before repainting it; wall preparation comes before mounting artwork. Ask the team which tasks can sensibly share a visit and which require a specialist.',
        ],
      },
      {
        heading: 'Make a brief someone else can use',
        paragraphs: ['Take a wide photograph that shows the room and a closer photograph of the affected area. Note access restrictions, parking, preferred dates, and whether the space needs to remain usable. Measurements can help with planning, but final quantities and suitability should be checked by the person doing the work.'],
        checklist: ['List each task and its location.', 'Attach context photos and close-ups.', 'State your preferred outcome and priorities.', 'Mention access, pets, furniture, and working hours.'],
      },
      {
        heading: 'Agree on the finish line',
        paragraphs: [
          'Before accepting a quote, check what is included: preparation, materials, protection, disposal, finishing, and cleanup. Ask how changes will be priced and approved if an inspection uncovers additional work.',
          'Keep the agreed scope and any later changes together. A clear record helps you compare proposals on the same basis and gives everyone a shared understanding of what completion looks like. Start with SHSG’s project planner to organize your notes, then confirm scope and availability with the relevant team.',
        ],
      },
    ],
  },
  {
    slug: 'drywall-repair-planning-checklist',
    title: 'Drywall repair: what to check before the patch and paint',
    category: 'Repairs',
    description: 'A practical planning checklist for damaged walls: document the problem, discuss the cause, and agree on texture, paint, and cleanup.',
    image: planningImage,
    imageAlt: 'Illustration of a homeowner and craftsperson reviewing a wall repair plan.',
    published: '2026-11-07',
    sections: [
      {
        heading: 'Look beyond the visible mark',
        paragraphs: [
          'A hole from a moved shelf and a recurring ceiling stain need different conversations. Tell the repair team what happened, how long the area has looked this way, and whether previous repairs have been made. Photographs taken over time can be useful when a mark or crack has changed.',
          'Avoid assuming that a cosmetic patch will resolve the underlying issue. Ask whether another assessment is needed before wall repairs begin, particularly where damage keeps returning. The aim is to agree on an appropriate sequence before spending time on the finish.',
        ],
      },
      {
        heading: 'Show the whole wall',
        paragraphs: ['Send a wide image of the wall, a close-up of the damage, and a view of nearby corners or trim. Note whether the surface is smooth, textured, wallpapered, or part of a decorative feature. Let the team know if you have leftover paint or a record of its brand, color, and sheen.', 'Do not open walls or disturb unfamiliar materials just to prepare a quote. Share what you can observe safely and let the team identify any inspection or specialist requirements.'],
      },
      {
        heading: 'Ask what “paint-ready” includes',
        paragraphs: ['A quote for patching may not include the same finish as a quote for a fully repainted wall. Discuss preparation, texture matching, primer, and painting explicitly. An older paint finish may not match a small touched-up area exactly; ask what outcome is realistic under your room’s lighting.'],
        checklist: ['Confirm which areas are being repaired.', 'Ask whether priming and painting are included.', 'Discuss furniture protection and dust management.', 'Agree on drying time, access, and cleanup.'],
      },
      { heading: 'Plan around the room', paragraphs: ['Tell the team how the room is used and whether furniture can be moved. Some repairs need more than one stage, so ask when the space can be used normally again and whether a return visit is expected.', 'A clear brief does not have to diagnose the wall. Its job is to capture the problem, your expectations, and the practical limits of the space so the repair can be scoped properly.'] },
    ],
  },
  {
    slug: 'tv-mounting-room-planning',
    title: 'Planning a TV wall that works for the whole room',
    category: 'Planning',
    description: 'Think through seating, screen position, cables, wall finishes, and equipment before arranging a professional TV mounting visit.',
    image: roomImage,
    imageAlt: 'Illustration of a room layout being planned with drawings and material samples.',
    published: '2026-11-07',
    sections: [
      {
        heading: 'Begin at the sofa',
        paragraphs: ['A TV wall should work from the places where you actually sit. Note the main seating position, nearby windows, and how the room is used during the day. A photograph taken from your seat can communicate the layout more clearly than a close-up of the blank wall.', 'Think about the equipment around the screen too: a soundbar, game console, streaming device, or cabinet can change how the finished wall needs to function. List what you already own and what you intend to add.'],
      },
      {
        heading: 'Share the exact equipment details',
        paragraphs: [
          'Record the television model and the mount model if you already have one. Keep the manufacturer’s instructions available. The installer needs to assess compatibility, the wall construction, and the fixing method; a mount that looks right is not enough to establish suitability.',
          'Mention fireplaces, built-in furniture, unusual wall finishes, and any restrictions on drilling. If you rent, check the permissions you need before agreeing to work. Avoid choosing a final position until the installer has assessed the site and the equipment.',
        ],
      },
      {
        heading: 'Make cable routing part of the brief',
        paragraphs: ['Decide which connections you need and where devices will live. Ask how cables will be managed and whether the proposed route requires separate electrical work. Concealed power and wall alterations should be assessed by appropriately qualified professionals.', 'Discuss future access as well as appearance. A tidy installation is more useful when you can still reach the connections needed for replacement equipment.'],
        checklist: ['Photograph the wall and seating arrangement.', 'Provide TV, mount, and soundbar model details.', 'List devices and required connections.', 'Confirm permissions, cable routing, and finish expectations.'],
      },
      { heading: 'Agree on a complete installation', paragraphs: ['Check whether the quote covers mounting only or also equipment positioning, connection checks, cable management, and wall finishing. Ask who supplies the mount and any additional materials.', 'Once the layout and scope are agreed, clear a practical working area and keep manuals and accessories together. That preparation helps the team spend the visit on the installation rather than searching for missing parts.'] },
    ],
  },
  {
    slug: 'gutter-cleaning-visit-checklist',
    title: 'Gutter cleaning: a homeowner’s visit-planning checklist',
    category: 'Maintenance',
    description: 'Prepare for a gutter cleaning assessment with useful observations, access details, and clear questions about the scope of the visit.',
    image: maintenanceImage,
    imageAlt: 'Illustration of seasonal home maintenance with a house, gutter, tools, and leaves.',
    published: '2026-11-07',
    sections: [
      {
        heading: 'Record what you notice from the ground',
        paragraphs: [
          'Before arranging gutter maintenance, write down where you have noticed overflowing water, visible debris, or marks on an exterior wall. Note when it happens and whether a particular corner is affected. Only take photographs from a safe, accessible position; there is no need to climb to prepare a useful brief.',
          'These observations help the team understand your concern, but they do not establish the cause. Ask whether the visit is for cleaning, inspection, repairs, or a combination, and how findings will be reported.',
        ],
      },
      { heading: 'Describe the property and access', paragraphs: ['Share an overview of the building and any access constraints. Extensions, narrow side passages, gates, conservatories, planting, and parked vehicles can affect how a team plans a visit. Mention areas that cannot be reached from your property.', 'If a managing agent or neighboring property is involved, clarify permissions before booking. The team should determine the equipment and access arrangements appropriate to the site.'] },
      {
        heading: 'Clarify the boundaries of the job',
        paragraphs: ['Cleaning and repairing are different scopes. Ask whether downspouts, debris removal, and a report of visible issues are included. If the team finds a damaged component, agree on how a repair proposal will be provided before extra work begins.'],
        checklist: ['Describe the locations of visible problems.', 'Send ground-level context photographs.', 'Explain access and permission requirements.', 'Confirm cleaning, reporting, disposal, and any exclusions.'],
      },
      {
        heading: 'Keep a simple maintenance record',
        paragraphs: ['After the visit, keep the service notes and any photographs together. Record areas the team could not access and any follow-up they recommend. Ask what factors should inform the next inspection rather than assuming every property needs the same schedule.', 'If the original concern continues after cleaning, share that with the team. A documented history makes a follow-up conversation clearer and avoids treating repeated symptoms as unrelated jobs.'],
      },
    ],
  },
  {
    slug: 'prepare-for-plumbing-visit',
    title: 'What to have ready before a plumbing visit',
    category: 'Repairs',
    description: 'Make a plumbing assessment easier with a clear symptom history, fixture details, photographs, and practical access information.',
    image: maintenanceImage,
    imageAlt: 'Illustrated home maintenance checklist with a wrench and water droplet.',
    published: '2026-11-07',
    sections: [
      {
        heading: 'Tell the story of the problem',
        paragraphs: [
          'For a planned plumbing visit, a short history is often more helpful than a guessed diagnosis. Describe which fixture is affected, when you first noticed the issue, and whether it is constant or intermittent. Mention any previous work or recent changes you know about.',
          'Do not wait for a routine appointment if there is an urgent safety issue or active damage. Contact the appropriate professional or emergency service for the situation. This guide is about preparing a visit, not troubleshooting or attempting a repair.',
        ],
      },
      {
        heading: 'Gather the details without dismantling anything',
        paragraphs: [
          'Take a context photograph and a close-up if you can do so safely. A fixture’s brand or model can help the team prepare, especially if you already have a manual or invoice. You do not need to remove covers or disconnect fittings to find information.',
          'If the issue happens only at certain times, note the circumstances in plain language. Avoid running equipment or repeating a problem just to demonstrate it if doing so could cause damage. Share existing photos or a description instead.',
        ],
      },
      {
        heading: 'Make access part of the conversation',
        paragraphs: ['Let the team know about occupied rooms, locked cupboards, parking, pets, and any building access arrangements. Ask what space needs to be cleared and whether the visit may affect normal use of the room.', 'Where a landlord or property manager is responsible for authorizing work, establish who can approve the scope and any additional costs before the appointment.'],
        checklist: ['Describe the symptom, location, and timing.', 'Share existing photos and fixture information.', 'Mention earlier repairs and access constraints.', 'Confirm who authorizes work and receives the quote.'],
      },
      { heading: 'Separate assessment from agreed work', paragraphs: ['Ask whether the initial visit covers assessment only or includes defined repairs. Clarify any call-out arrangements, parts ordering, and how additional work will be quoted.', 'Keep the agreed scope and service notes so you have a record if a follow-up is needed. Good preparation makes communication easier; the professional assessment still determines what work is appropriate.'] },
    ],
  },
  {
    slug: 'flooring-project-planning',
    title: 'New flooring? Plan the room before choosing the finish',
    category: 'Planning',
    description: 'Build a flooring project brief around room use, transitions, preparation, and the practical details that a sample alone cannot answer.',
    image: roomImage,
    imageAlt: 'Illustration of a flooring project with wood samples, a room drawing, and measuring tools.',
    published: '2026-11-07',
    sections: [
      {
        heading: 'Describe how the room needs to work',
        paragraphs: [
          'A flooring sample is only one part of the decision. Start with the room: how often it is used, how it connects to other spaces, and what furniture needs to return afterward. Mention pets, entryways, and your preferences for cleaning and maintenance.',
          'Bring a few reference images rather than a long list of products. Explain what you like about each one, such as the tone, pattern, or overall feel. That gives the team a starting point without locking the project into a material before suitability is assessed.',
        ],
      },
      {
        heading: 'Think about edges and transitions',
        paragraphs: ['Photograph doorways, steps, adjoining floor finishes, and built-in furniture. Note any areas that feel uneven or have a history of problems. The installer needs to assess the existing surface and preparation requirements before confirming the work.', 'Ask how transitions, trim, thresholds, and door clearances will be handled. These details affect the finished room and should be discussed alongside the main flooring area, rather than left to the final day.'],
      },
      {
        heading: 'Compare complete scopes',
        paragraphs: ['When reviewing proposals, check whether each includes removal of existing flooring, surface preparation, supply, installation, finishing, and disposal. Confirm who moves furniture and whether any appliances or fixtures need separate arrangements.', 'Ask how unexpected conditions will be communicated and priced. A measured assessment and written exclusions make proposals easier to compare than a headline area price alone.'],
        checklist: ['List rooms, connecting spaces, and priorities.', 'Photograph doorways, trim, and existing finishes.', 'Discuss preparation, removal, and disposal.', 'Agree on furniture access and the return-to-use plan.'],
      },
      { heading: 'Plan the days around the work', paragraphs: ['Ask about the sequence and any product-specific waiting periods before installation or normal use. Establish which routes through the home will remain available and where materials can be stored.', 'Keep the selected product details, care instructions, and agreed finish together. A well-planned flooring job considers both the installation and how the room will be lived in afterward.'] },
    ],
  },
];

export const blogCategories = ['All', 'Planning', 'Repairs', 'Maintenance'] as const;
export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}
export function getReadingTime(article: BlogArticle) {
  const words = article.sections
    .flatMap((section) => [section.heading, ...section.paragraphs, ...(section.checklist ?? [])])
    .join(' ')
    .split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}
export function formatArticleDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
}
