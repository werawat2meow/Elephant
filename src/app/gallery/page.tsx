import { pageMetadata } from '../../lib/site';
import GalleryClient from './GalleryClient';
export const metadata = pageMetadata('Phuket Tour Gallery — Jasmine Tour', 'Browse the Jasmine Tour gallery of elephant activities, feeding and nature experiences.', '/gallery');
export default function Gallery() { return <GalleryClient />; }
