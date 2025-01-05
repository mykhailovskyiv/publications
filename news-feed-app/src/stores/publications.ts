import {defineStore} from 'pinia';
import {ref} from 'vue';
import api, {endpoints} from '@/api/api';
import type { Publications } from '@/types';

export const usePublicationsStore = defineStore('publications', () => {

  const publications = ref<Publications[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const cursor = ref(null);
  const hasMore = ref(true);

  const fetchPublications = async () => {
    if (!hasMore.value || loading.value) return;

    loading.value = true;
    error.value = null;

    try {
      let url = endpoints.publications;
      url += '?take=10&order=desc';

      if (cursor.value) {
        url += `&cursor=${cursor.value}`;
      }

      const response = await api.get(url);

      publications.value = [...publications.value, ...response.data];

      if (response.data.length < 10) {
        hasMore.value = false;
      } else {
        cursor.value = response.data[response.data.length - 1].id;
      }
    } catch (err) {
      error.value = 'Failed to fetch publications';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const addPublication = async (content: string) => {
    try {
      const response = await api.post(endpoints.publications, { content });
      publications.value.unshift(response.data);
    } catch (err) {
      error.value = 'Failed to add publication';
      console.error(err);
    }
  };

  const updatePublication = async (id: string, updatedContent: string) => {
    loading.value = true;
    error.value = null;

    try {
      const currentDate = new Date().toISOString();
      const response = await api.put(endpoints.updatePublication(id), {
        content: updatedContent,
      });

      publications.value = publications.value.map((pub) =>
          pub.id === id ? {...pub, content: updatedContent, updatedOn: currentDate } : pub
      );
    } catch (err) {
      error.value = 'Failed to update publication';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const deletePublication = async (id: string) => {
    try {
      await api.delete(endpoints.updatePublication(id));
      publications.value = publications.value.filter(pub => pub.id !== id);
    } catch (err) {
      error.value = 'Failed to delete publication';
      console.error(err);
    }
  };

  return {
    publications,
    loading,
    error,
    fetchPublications,
    addPublication,
    updatePublication,
    deletePublication,
    hasMore
  };
});
