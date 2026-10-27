import Link from 'next/link';
import { notFound } from 'next/navigation';
import { tours, catalogueNotice } from '../../../lib/tours';
import { pageMetadata, siteOrigin } from '../../../lib/site';
import JsonLd from '../../../components/JsonLd';
import Faq from '../../../components/Faq';
import TrackedLink from '../../../components/TrackedLink';
import TourImage from '../../../components/TourImage';

export function generateStaticParams() { return tours.map(tour => ({ slug: tour.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const tour = tours.find(t => t.slug === params.slug);
  return tour ? pageMetadata(`${tour.name.en} in Phuket`, `Explore ${tour.name.en}: provisional adult and child prices, proposed activities and tour times. Request operator and pickup confirmation with Jasmine Tour.`, `/tours/${tour.slug}`) : {};
}
export default function TourPage({ params }: { params: { slug: string } }) {
  const tour = tours.find(t => t.slug === params.slug);
  if (!tour) notFound();
  return <article className="max-w-4xl mx-auto px-4 py-12">
    <nav aria-label="Breadcrumb" className="mb-6 text-green-800"><Link href="/">Home</Link> / <Link href="/packages">Tour packages</Link> / {tour.name.en}</nav>
    {siteOrigin && <JsonLd data={{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ name: 'Home', path: '/' }, { name: 'Tour packages', path: '/packages' }, { name: tour.name.en, path: `/tours/${tour.slug}` }].map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.name, item: `${siteOrigin}${item.path}` })) }} />}
    <h1 className="text-4xl font-bold text-green-900 mb-4">{tour.name.en}</h1><p className="text-xl mb-6">{tour.name.th} · Phuket booking enquiry</p>
    <TourImage imageKey={tour.slug} priority />
    <p className="p-4 bg-amber-50 rounded mb-6">{catalogueNotice.en}</p>
    <dl className="grid sm:grid-cols-2 gap-4">{[
      ['Adult price estimate', `THB ${tour.price.adult.toLocaleString()}`], ['Child price estimate', `THB ${tour.price.child.toLocaleString()} — age bands unconfirmed`],
      ['Provisional duration', tour.duration], ['Proposed start times (Phuket)', tour.times.join(', ')],
      ['Proposed activities', tour.activities.join(', ')], ['Included / excluded', 'Awaiting the operator’s itemised quote; meals, insurance and transport are not promised.'],
      ['Pickup', 'Area, fee, meeting point and pickup time must be confirmed.'], ['Provider and location', 'Awaiting verification; Jasmine Tour acts as booking agent.'],
    ].map(([label, value]) => <div key={label} className="border rounded p-4"><dt className="font-semibold">{label}</dt><dd className="mt-2">{value}</dd></div>)}</dl>
    <TrackedLink href={`/booking?packageId=${tour.id}`} event="book_now_click" className="inline-block bg-green-700 text-white rounded px-6 py-3 mt-8">Request this tour · ส่งคำขอจอง</TrackedLink>
    <p className="mt-4">Read the <Link href="/cancellation-policy" className="underline">booking and cancellation policy</Link> before requesting a quote.</p><Faq />
  </article>;
}
