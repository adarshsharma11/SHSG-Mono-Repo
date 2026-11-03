'use client';
import { useMemo, useState } from 'react';
import { Button, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@shsg/ui';
import { currency, estimateItems } from './demo-data';

export function EstimateWorkspace() {
  const [items, setItems] = useState(estimateItems);
  const [selected, setSelected] = useState('demo-4');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All items');
  const active = items.find((item) => item.id === selected)!;
  const visible = useMemo(() => items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()) && (filter === 'All items' || item.type === filter)), [items, query, filter]);
  const directCost = items.reduce((sum, item) => sum + item.quantity * item.cost, 0);
  const price = directCost / 0.8;
  function download() {
    const text = ['SHSG DEMO ESTIMATE — not a customer quote', 'Bathroom refresh', ...items.map((item) => `${item.name}: ${item.quantity} ${item.unit} × ${currency(item.cost)} = ${currency(item.quantity * item.cost)}`), `Direct cost: ${currency(directCost)}`, `Illustrative price before tax: ${currency(price)}`, 'Demo gross margin: 20%. Taxes and final scope are not included.'].join('\n');
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shsg-demo-estimate.txt';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div id="overview" className="[scroll-margin-top:90px] space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[.16em] text-[#728078] uppercase">Projects / Demo project</p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Bathroom refresh</h1>
          <p className="mt-2 text-sm text-[#6a776e]">EST-DEMO-001 · Draft estimate · Southern Home Handyman</p>
        </div>
        <Button variant="outline" size="sm" onClick={download}>
          Export estimate
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ['Direct cost', currency(directCost)],
          ['Illustrative price', currency(price)],
          ['Gross margin', '20.0%'],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[#e1e7e3] bg-white p-5">
            <p className="text-xs text-[#6a776e]">{label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_270px]">
        <section id="estimate" className="min-w-0 [scroll-margin-top:90px] space-y-5" aria-labelledby="estimate-title">
          <details className="rounded-xl border border-[#e1e7e3] bg-white p-5">
            <summary className="cursor-pointer text-sm font-medium">Scope of work</summary>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#65736a]">Refresh a small bathroom: remove existing fixtures, install a toilet, and retile the wall. Fixtures, labor, and finishes below are sample allowances. Confirm dimensions, site conditions, and the approved scope before issuing a real estimate.</p>
          </details>
          <div className="rounded-xl border border-[#e1e7e3] bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 id="estimate-title" className="text-base font-semibold">
                Estimate line items
              </h2>
              <span className="text-xs text-[#7a877f]">{items.length} items</span>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <label className="min-w-0 flex-1 text-xs text-[#647369]">
                Search items
                <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search estimate…" className="mt-2 block min-h-10 w-full min-w-0 rounded-lg border border-[#dce5df] bg-white px-3 text-sm text-[#1b2821] outline-[#168053]" />
              </label>
              <label className="text-xs text-[#647369]">
                Show
                <select value={filter} onChange={(event) => setFilter(event.target.value)} className="mt-2 block min-h-10 rounded-lg border border-[#dce5df] bg-white px-3 text-sm text-[#1b2821]">
                  {['All items', 'Labor', 'Material'].map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <Table density="compact" scrollLabel="Estimate items, scroll horizontally for quantities and costs" className="min-w-[620px] bg-white">
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit cost</TableHead>
                <TableHead>Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((item) => (
                <TableRow key={item.id} className={selected === item.id ? 'bg-[#edf6f0]' : ''}>
                  <TableCell>
                    <button type="button" onClick={() => setSelected(item.id)} aria-pressed={selected === item.id} className="cursor-pointer text-left text-sm font-medium text-[#234d35] underline-offset-4 hover:underline">
                      {item.name}
                    </button>
                    <p className="mt-1 text-[10px] text-[#7a877f]">
                      {item.category} · {item.type}
                    </p>
                  </TableCell>
                  <TableCell>
                    <input
                      aria-label={`Quantity for ${item.name}`}
                      type="number"
                      min="0"
                      max="10000"
                      step="1"
                      value={item.quantity}
                      onChange={(event) => {
                        const value = Number(event.target.value);
                        if (Number.isFinite(value) && value >= 0 && value <= 10000) {
                          setItems((current) => current.map((row) => (row.id === item.id ? { ...row, quantity: value } : row)));
                        }
                      }}
                      className="min-h-9 w-16 rounded-md border border-[#dce5df] bg-white px-2 text-sm"
                    />
                    <span className="ml-2 text-xs text-[#7a877f]">{item.unit}</span>
                  </TableCell>
                  <TableCell>{currency(item.cost)}</TableCell>
                  <TableCell className="font-medium">{currency(item.quantity * item.cost)}</TableCell>
                </TableRow>
              ))}
              {!visible.length && (
                <TableRow>
                  <TableCell colSpan={4} className="text-shsg-muted py-10! text-center">
                    No matching estimate items.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <p className="text-xs leading-6 text-[#7a877f]">Demo only. Quantity changes are local and reset on reload. Prices are illustrative, before tax, and are not approved customer quotes.</p>
        </section>
        <aside id="materials" className="min-w-0 [scroll-margin-top:90px] space-y-5" aria-labelledby="detail-title">
          <div className="rounded-xl border border-[#e1e7e3] bg-white p-5">
            <p className="text-[10px] font-semibold tracking-[.14em] text-[#7a877f] uppercase">Selected item</p>
            <div className="mt-4 flex aspect-[3/2] items-center justify-center overflow-hidden rounded-lg border border-[#dce5df] bg-[#e6eae4]" aria-hidden="true">
              {active.id === 'demo-4' ? (
                <div className="grid w-full grid-cols-4 gap-1 p-3">
                  {Array.from({ length: 12 }, (_, index) => (
                    <span key={index} className="aspect-[3/2] rounded-[2px] border border-[#c7cfc2] bg-[#f6f5ec] shadow-sm" />
                  ))}
                </div>
              ) : (
                <span className="text-sm font-medium text-[#627067]">{active.type} allowance</span>
              )}
            </div>
            <h2 id="detail-title" className="mt-5 text-base leading-6 font-semibold">
              {active.name}
            </h2>
            <p className="mt-3 text-xl font-semibold">
              {currency(active.cost)} <span className="text-xs font-normal text-[#7a877f]">/ {active.unit}</span>
            </p>
            <dl className="mt-5 grid gap-3 border-t border-[#e1e7e3] pt-4 text-xs">
              <div className="flex justify-between">
                <dt className="text-[#7a877f]">Category</dt>
                <dd>{active.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#7a877f]">Type</dt>
                <dd>{active.type}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#7a877f]">Item cost</dt>
                <dd>{currency(active.quantity * active.cost)}</dd>
              </div>
            </dl>
          </div>
          <div id="customer" className="[scroll-margin-top:90px] rounded-xl border border-[#e1e7e3] bg-white p-5">
            <h2 className="text-sm font-semibold">Customer details</h2>
            <p className="mt-4 text-sm">Sample homeowner</p>
            <p className="mt-2 text-xs leading-6 text-[#7a877f]">
              Demo property
              <br />
              No real customer information
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
