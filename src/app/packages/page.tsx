import { pageMetadata } from '../../lib/site';
import PackagesClient from './PackagesClient';
export const metadata = pageMetadata('Compare Phuket Elephant Tour Packages', 'Compare Phuket elephant tour options, adult and child prices, activities and proposed tour times.', '/packages');
export default function PackagesPage() { return <PackagesClient />; }
