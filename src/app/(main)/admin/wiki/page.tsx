import { getAdminWikiItems, getAdminWikiCategories } from './actions';
import WikiClient from './WikiClient';

export const metadata = {
  title: 'Wiki Eşyaları Yönetimi - Admin Paneli',
};

export default async function AdminWikiItemsPage() {
  const { data: items, error: itemsError } = await getAdminWikiItems();
  const { data: categories, error: categoriesError } = await getAdminWikiCategories();

  if (itemsError || categoriesError) {
    return <div className="p-6 text-red-400">Veriler yüklenirken hata oluştu.</div>;
  }

  return <WikiClient initialItems={items} categories={categories} />;
}
