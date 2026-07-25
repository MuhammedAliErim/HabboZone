import { getMagazineWithPages } from '@/app/actions/magazine';
import MagazineEditorWrapper from './MagazineEditorWrapper';

export default async function AdminMagazineEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getMagazineWithPages(id);

  return (
    <div className="h-[calc(100vh-4rem)] -m-6 flex flex-col bg-gray-900 text-white overflow-hidden">
      <MagazineEditorWrapper initialMagazine={data.magazine} initialPages={data.pages} />
    </div>
  );
}
