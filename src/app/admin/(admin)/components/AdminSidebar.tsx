import Link from 'next/link';

const menu = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Packages', path: '/admin/packages' },
  { name: 'Banners', path: '/admin/banners' },
  { name: 'Bookings', path: '/admin/bookings' },
  { name: 'Reviews', path: '/admin/reviews' },
  { name: 'Contact/Social', path: '/admin/contact' },
  { name: 'Promotions', path: '/admin/promotions' },
  { name: 'Settings', path: '/admin/settings' },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-white border-r min-h-screen p-6">
      <h2 className="text-xl font-bold mb-8">Admin Menu</h2>
      <nav>
        <ul className="space-y-4">
          {menu.map(item => (
            <li key={item.path}>
              <Link href={item.path} className="text-gray-700 hover:text-green-600 font-medium">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
