'use client';
import { useState } from 'react';
import { Badge, Button, DropdownMenu, EmptyState, Input, Pagination, Section, Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, Typography } from '@shsg/ui';

const bookings = ['Alex Morgan', 'Priya Shah', 'Sam Taylor', 'Jordan Lee', 'Avery Brown', 'Taylor Green', 'Casey Patel', 'Morgan Singh', 'Jamie Wilson', 'Robin Davis', 'Drew Thomas', 'Cameron White'].map((customer, index) => ({
  id: `SHSG-${1042 + index}`,
  customer,
  service: ['Home cleaning', 'Property maintenance', 'Air conditioning service'][index % 3],
  status: index % 3 === 0 ? 'Completed' : index % 3 === 1 ? 'Scheduled' : 'Needs review',
}));
export function TableExamples() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');
  const [notice, setNotice] = useState('');
  const [demoPage, setDemoPage] = useState(6);
  const filtered = bookings.filter((row) => `${row.customer} ${row.service} ${row.id}`.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.customer.localeCompare(b.customer) * (sort === 'asc' ? 1 : -1));
  const totalPages = Math.ceil(filtered.length / 4);
  const current = totalPages ? Math.min(page, totalPages) : 0;
  const rows = filtered.slice(Math.max(0, current - 1) * 4, Math.max(0, current - 1) * 4 + 4);
  return (
    <>
      <Section title="Bookings" description="Sort by customer, filter the list, and page through the results.">
        <Input
          type="search"
          label="Search bookings"
          placeholder="Customer, service, or visit ID"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
        <Table scrollLabel="Bookings table">
          <TableCaption>Demo bookings · {filtered.length} matching records</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Visit</TableHead>
              <TableHead aria-sort={sort === 'asc' ? 'ascending' : 'descending'}>
                <button
                  className="focus-visible:outline-shsg-ring cursor-pointer rounded focus-visible:outline-2"
                  onClick={() => {
                    setSort((value) => (value === 'asc' ? 'desc' : 'asc'));
                    setPage(1);
                  }}
                >
                  Customer {sort === 'asc' ? '↑' : '↓'}
                </button>
              </TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium whitespace-nowrap">{row.id}</TableCell>
                  <TableCell className="whitespace-nowrap">{row.customer}</TableCell>
                  <TableCell>{row.service}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === 'Completed' ? 'success' : row.status === 'Scheduled' ? 'primary' : 'warning'}>{row.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu
                      label={`Actions for ${row.id}`}
                      trigger={<span aria-hidden="true">•••</span>}
                      items={[
                        {
                          id: 'details',
                          label: 'View visit details',
                          onSelect: () => setNotice(`Selected ${row.id}: ${row.service} for ${row.customer}.`),
                        },
                        {
                          id: 'history',
                          label: 'View service history',
                          onSelect: () => setNotice(`History selected for ${row.id}. Demo only.`),
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState
                    title="No bookings match"
                    description="Try another customer, service, or visit ID."
                    compact
                    actions={
                      <Button
                        size="sm"
                        onClick={() => {
                          setSearch('');
                          setPage(1);
                        }}
                      >
                        Clear search
                      </Button>
                    }
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Typography variant="small" tone="muted">
            {current ? `Page ${current} of ${totalPages}` : 'No results'}
          </Typography>
          <Pagination aria-label="Booking pagination" page={current} totalPages={totalPages} onPageChange={setPage} />
        </div>
        <p role="status" className="text-shsg-muted text-sm">
          {notice}
        </p>
      </Section>
      <Section title="Customers and invoices" description="Compact rows and row headers work for other record types.">
        <Table density="compact" scrollLabel="Customer invoices">
          <TableCaption>Demo invoice summary</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableHead scope="row">Alex Morgan</TableHead>
              <TableCell>INV-2042</TableCell>
              <TableCell>
                <Badge variant="success">Paid</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableHead scope="row">Priya Shah</TableHead>
              <TableCell>INV-2043</TableCell>
              <TableCell>
                <Badge variant="warning">Pending</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Section>
      <Section title="Pagination states" description="Long page ranges stay compact. Zero pages and loading states disable navigation.">
        <Pagination aria-label="Long range pagination" page={demoPage} totalPages={100} onPageChange={setDemoPage} />
        <Pagination aria-label="Empty pagination" page={0} totalPages={0} onPageChange={() => {}} />
        <Pagination aria-label="Disabled pagination" disabled page={2} totalPages={4} onPageChange={() => {}} />
      </Section>
    </>
  );
}
