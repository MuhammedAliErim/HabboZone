import { getAdminWikiCategories } from '../actions';
import CategoriesClient from './CategoriesClient';

export const metadata = {
  title: 'Wiki Kategorileri Yönetimi - Admin Paneli',
};

export default async function AdminWikiCategoriesPage() {
  const categories = await getAdminWikiCategories();
  
  return <CategoriesClient initialCategories={categories} />;
}
