import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Homepage } from './homepage';
import { HomeServices } from './home-services';
import { homeServices } from './services';
import { Toolbench } from './toolbench';
import { ProjectStories } from './project-stories';

describe('homepage designs', () => {
  it.each([
    ['care', /small fixes.*big difference/i, '/'],
    ['workshop', /good tools.*better hands.*your home/i, '/home/workshop'],
    ['transformations', /make room.*for possibility/i, '/home/transformations'],
  ] as const)('renders the %s design with all services and links to the other views', (view, heading, href) => {
    render(<Homepage view={view} />);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(heading);
    const navigation = screen.getAllByRole('navigation', { name: 'Homepage designs' })[0];
    expect(navigation).toBeDefined();
    if (!navigation) {
      return;
    }
    const links = within(navigation).getAllByRole('link');
    expect(links).toHaveLength(3);
    expect(links.find((link) => link.getAttribute('aria-current') === 'page')).toHaveAttribute('href', href);
    for (const service of homeServices) {
      expect(screen.getByRole('link', { name: `Plan ${service.title}` })).toHaveAttribute('href', '#plan-project');
    }
    for (const id of ['services', 'how-it-works', 'our-family', 'plan-project', 'questions']) {
      expect(document.querySelectorAll(`#${id}`)).toHaveLength(1);
    }
  });

  it('filters by group and search, and recovers from an empty result', async () => {
    const user = userEvent.setup();
    render(<HomeServices>{null}</HomeServices>);
    await user.click(screen.getByRole('tab', { name: 'Home systems' }));
    expect(screen.getByRole('status')).toHaveTextContent('4 services');
    await user.type(screen.getByRole('searchbox', { name: 'Find a service' }), 'plumbing');
    expect(screen.getByRole('status')).toHaveTextContent('1 service');
    expect(screen.getByRole('link', { name: 'Plan Plumbing' })).toBeInTheDocument();
    await user.type(screen.getByRole('searchbox'), 'unmatched');
    expect(screen.getByRole('status')).toHaveTextContent('0 services');
    await user.click(screen.getByRole('button', { name: 'Show all services' }));
    expect(screen.getByRole('status')).toHaveTextContent('16 services');
    expect(screen.getByRole('searchbox')).toHaveValue('');
    expect(screen.getByRole('tab', { name: 'All services' })).toHaveAttribute('aria-selected', 'true');
  });

  it('uses keyboard navigation to switch the animated category panel while preserving search', async () => {
    const user = userEvent.setup();
    render(<HomeServices>{null}</HomeServices>);
    await user.type(screen.getByRole('searchbox'), 'plumbing');
    screen.getByRole('tab', { name: 'All services' }).focus();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    const tab = screen.getByRole('tab', { name: 'Home systems' });
    expect(tab).toHaveFocus();
    expect(tab).toHaveAttribute('aria-selected', 'true');
    const panel = screen.getByRole('tabpanel', { name: 'Home systems' });
    expect(panel).toHaveAttribute('data-animation', 'slide-up');
    expect(within(panel).getByRole('link', { name: 'Plan Plumbing' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toHaveValue('plumbing');
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
  });

  it('keeps a typed description when changing service and includes the focus in the brief', async () => {
    const user = userEvent.setup();
    render(<HomeServices>{null}</HomeServices>);
    const description = screen.getByRole('textbox', { name: 'Tell us a little about it' });
    await user.type(description, 'We would like to repair the kitchen cabinet doors.');
    await user.click(screen.getByRole('link', { name: 'Plan Plumbing' }));
    await user.click(screen.getByRole('link', { name: 'Plan Carpentry' }));
    expect(description).toHaveValue('We would like to repair the kitchen cabinet doors.');
    await user.click(screen.getByRole('button', { name: 'Create my project brief' }));
    expect(within(screen.getByRole('dialog')).getByText('Carpentry')).toBeInTheDocument();
    expect(within(screen.getByRole('dialog')).getByText(/not automatically transferred/i)).toBeInTheDocument();
  });

  it('lets visitors pause tool animations', async () => {
    const user = userEvent.setup();
    render(<Toolbench />);
    await user.click(screen.getByRole('button', { name: 'Pause tool animations' }));
    expect(screen.getByRole('button', { name: 'Play tool animations' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'Play tool animations' }));
    expect(screen.getByRole('button', { name: 'Pause tool animations' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('switches inspiration stories and labels their photography honestly', async () => {
    const user = userEvent.setup();
    render(<ProjectStories />);
    await user.click(screen.getByRole('button', { name: 'Reimagine' }));
    expect(screen.getByRole('heading', { name: 'See a bigger possibility.' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reimagine' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText(/illustrative photography/i)).toBeInTheDocument();
  });
});
