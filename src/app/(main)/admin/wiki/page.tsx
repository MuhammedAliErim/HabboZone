import { getAdminWikiItems, getAdminWikiCategories } from './actions';
import WikiClient from './WikiClient';

export const metadata = {
  title: 'Wiki Eşyaları Yönetimi - Admin Paneli',
};

export default async function AdminWikiItemsPage() {
  const items = await getAdminWikiItems();
  const categories = await getAdminWikiCategories();
  
  return <WikiClient initialItems={items} categories={categories} />;
}
