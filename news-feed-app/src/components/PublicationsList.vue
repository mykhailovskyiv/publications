<script setup lang="ts">
import { usePublicationsStore } from '@/stores/publications';
import {computed, onMounted, ref} from 'vue';
import { formatDistanceToNow, parseISO } from 'date-fns';


const editingPubId = ref<string | null>(null);
const editedContent = ref<string>('');
const newContent = ref('');
const showInput = ref(false);

const publicationsStore = usePublicationsStore();
const { fetchPublications, updatePublication, deletePublication, addPublication  } = publicationsStore;
const publications = computed(() => publicationsStore.publications)
const hasMore = computed(() => publicationsStore.hasMore)
const loading = computed(() => publicationsStore.loading)
const error = computed(() => publicationsStore.error)



onMounted(() => {
  fetchPublications();
});

const handleScroll = (event: Event) => {
  const container = event.target as HTMLElement;
  const bottom = container.scrollHeight - container.scrollTop - container.clientHeight <= 100;

  if (bottom && !loading.value && hasMore.value) {
    fetchPublications();
  }
};


const editPublication = (id: string) => {
  const publication = publications.value.find((pub) => pub.id === id);
  if (publication) {
    editingPubId.value = id;
    editedContent.value = publication.content;
  }
};

const saveUpdate = (id: string) => {
  if (editedContent.value !== '') {
    updatePublication(id, editedContent.value);
    editingPubId.value = null;
  }
};
const removePublication = async (id: string) => {
  deletePublication(id);
};

const publishPost = async () => {
  if (newContent.value.trim()) {
    addPublication(newContent.value);
    newContent.value = '';
    showInput.value = false;
  }
};

const formatDate = (date: string) => {
  const parsedDate = parseISO(date);
  return formatDistanceToNow(parsedDate, { addSuffix: true });
};
</script>

<template>
  <button v-if="!showInput" @click="showInput = !showInput" class="add-publication-button">Add New Post</button>

  <div v-if="showInput" class="add-publication-form">
    <textarea v-model="newContent" placeholder="Write your new post..." class="new-post-textarea"></textarea>
    <button @click="publishPost" class="publish">Publish</button>
    <button @click="showInput = false" class="cancel">Cancel</button>
  </div>

  <div @scroll="handleScroll" class="publications-container">
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <ul v-else>
      <li v-for="pub in publications" :key="pub.id" class="publication-item">
        <div class="publication-content">
          <div v-if="editingPubId === pub.id">
            <textarea v-model="editedContent" class="edit-textarea"></textarea>
          </div>
          <div v-else>
            <p>{{ pub.content }}</p>
          </div>
          <p class="publication-date">Published on: {{ formatDate(pub.createdOn) }}</p>
          <p class="publication-updated">Updated: {{ formatDate(pub.updatedOn ?? '') }}</p>

          <div class="publication-actions">
            <button v-if="editingPubId !== pub.id" @click="editPublication(pub.id)" class="edit">Edit</button>
            <button v-if="editingPubId === pub.id" @click="saveUpdate(pub.id)" class="save">Save</button>
            <button @click="removePublication(pub.id)" class="delete">Delete</button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.publications-container {
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 80vh;
  overflow-y: auto;
}
.content-wrapper {
  display: flex;
}
.publication-item {
  border: 1px solid #ccc;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.publication-content {
  text-align: left;
  color: #222222;
}

.publication-date {
  font-size: 14px;
  color: #888;
  margin-bottom: 5px;
  font-style: italic;
}

.publication-updated {
  font-size: 14px;
  color: #4CAF50;
  font-weight: bold;
}

h1 {
  font-size: 2rem;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 1rem;
}

@media (max-width: 600px) {
  .publication-item {
    padding: 1rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}

.publication-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.publication-actions button {
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  &.edit {
    background-color: #4CAF50; // Зелене для Edit
    color: #fff;
    border: 2px solid #4CAF50;

    &:hover {
      background-color: #45a049;
      border-color: #45a049;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.5);
    }
  }

  &.delete {
    background-color: #f44336;
    color: #fff;
    border: 2px solid #f44336;

    &:hover {
      background-color: #e53935;
      border-color: #e53935;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.5);
    }
  }

  &.save {
    background-color: #2196F3;
    color: #fff;
    border: 2px solid #2196F3;

    &:hover {
      background-color: #1976D2;
      border-color: #1976D2;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.5);
    }
  }

  &:disabled {
    background-color: #bdbdbd;
    color: #757575;
    border-color: #bdbdbd;
    cursor: not-allowed;
    pointer-events: none;
  }
}
.add-publication-button {
  margin: 20px 0;
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-publication-form {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
}

.new-post-textarea {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.publish,
.cancel {
  padding: 10px 15px;
  margin-top: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.publish {
  background-color: #4CAF50;
  color: white;
  border: none;
}

.cancel {
  background-color: #f44336;
  color: white;
  border: none;
}
</style>
