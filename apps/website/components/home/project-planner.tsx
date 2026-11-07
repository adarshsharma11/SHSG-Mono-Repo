'use client';

import { useState, type FormEvent } from 'react';
import { Button, Modal, Select, Textarea } from '@shsg/ui';
import { divisions, projectTypes } from './home-content';

interface ProjectBrief {
  service: string;
  project: string;
  description: string;
  division: (typeof divisions)[number];
}

export function ProjectPlanner({ service = '' }: { service?: string }) {
  const [brief, setBrief] = useState<ProjectBrief | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  function prepareBrief(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const project = projectTypes.find((item) => item.value === data.get('project'));
    const description = String(data.get('description') ?? '').trim();
    if (!project || description.length < 15) {
      setError('Tell us a little more about the project (at least 15 characters).');
      return;
    }
    const division = divisions.find((item) => item.id === project.division)!;
    setError('');
    setBrief({ service, project: project.label, description, division });
    setOpen(true);
  }

  function downloadBrief() {
    if (!brief) {
      return;
    }
    const text = `SHSG project brief\n\nProject: ${brief.project}\n${brief.service ? `Service: ${brief.service}\n` : ''}\n${brief.description}\n\nSuggested starting point: ${brief.division.name}\n${brief.division.href}\n\nPrepared locally. This brief has not been submitted and is not a booking or estimate.\n`;
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shsg-project-brief.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <form className="space-y-5" onSubmit={prepareBrief}>
        {service && (
          <p className="border-b border-(--site-border) pb-4 text-sm leading-6 text-(--site-muted)">
            Project focus: <strong className="text-(--site-primary)">{service}</strong>
          </p>
        )}
        <Select name="project" label="What are you thinking about?" defaultValue="repair" required>
          {projectTypes.map((project) => (
            <option key={project.value} value={project.value}>
              {project.label}
            </option>
          ))}
        </Select>
        <Textarea
          name="description"
          label="Tell us a little about it"
          placeholder="The room, the repair, or the idea you’ve been putting off…"
          rows={4}
          required
          minLength={15}
          maxLength={2000}
          error={error || undefined}
          onChange={() => {
            if (error) {
              setError('');
            }
          }}
        />
        <Button type="submit" size="lg" fullWidth>
          Create my project brief
        </Button>
        <p className="text-xs leading-6 text-(--site-muted)">Just a starting point. Your brief stays on your device; nothing is sent and no visit is booked.</p>
      </form>
      <Modal open={open} onOpenChange={setOpen} title="A good place to start." description="Save your brief, then share it with the team when you get in touch." animation="slide-up" className="home-brief-modal" footer={<Button onClick={downloadBrief}>Download project brief</Button>}>
        {brief && (
          <div className="space-y-5">
            <p className="text-xs font-semibold tracking-widest text-(--site-primary) uppercase">{brief.project}</p>
            {brief.service && <p className="text-sm font-semibold">{brief.service}</p>}
            <p className="text-base leading-7">{brief.description}</p>
            <p>
              Suggested starting point: <strong>{brief.division.name}</strong>
            </p>
            <a href={brief.division.href} className="inline-flex min-h-11 items-center text-sm font-semibold text-(--site-primary) underline underline-offset-8">
              {brief.division.linkLabel}
            </a>
            <p className="text-xs leading-6 text-(--site-muted)">Your brief is not automatically transferred. Download it and include the details when contacting the team. Confirm scope, coverage, and availability directly.</p>
          </div>
        )}
      </Modal>
    </>
  );
}
