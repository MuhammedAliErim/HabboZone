import { getAdminWikiCategories } from '../actions';
import CategoriesClient from './CategoriesClient';

export const metadata = {
  title: 'Wiki Kategorileri Yönetimi - Admin Paneli',
};

export default async function AdminWikiCategoriesPage() {
  const { data: categories, error } = await getAdminWikiCategories();

  if (error) {
    return <div className="p-6 text-red-400">Kategoriler yüklenirken hata oluştu.</div>;
  }

  return <CategoriesClient initialCategories={categories} />;
}
