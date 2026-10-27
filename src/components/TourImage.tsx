import Image from 'next/image';
import { tours } from '../lib/tours';

const filenames = ['packone.jpg', 'packtwo.jpg', 'packtree.jpg', 'packfour.jpg', 'packfive.jpg'];
export default function TourImage({ imageKey, priority = false }: { imageKey: string; priority?: boolean }) {
  const index = tours.findIndex(tour => tour.slug === imageKey);
  if (index < 0) return null;
  return <div className="relative aspect-[4/3] overflow-hidden"><Image src={`/images/elephants/packages/${filenames[index]}`} alt={tours[index].name.en} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" quality={80} priority={priority} className="object-cover transition-transform duration-300 hover:scale-105" /></div>;
}
