import { getMagazineWithPages } from '@/app/actions/magazine';
import dynamic from 'next/dynamic';

const MagazineEditor = dynamic(() => import('./MagazineEditor'), { ssr: false });

export default async function AdminMagazineEditPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const data = await getMagazineWithPages(id);

  return (
    <div className="h-[calc(100vh-4rem)] -m-6 flex flex-col bg-gray-900 text-white overflow-hidden">
      <MagazineEditor initialMagazine={data.magazine} initialPages={data.pages} />
    </div>
  );
}
