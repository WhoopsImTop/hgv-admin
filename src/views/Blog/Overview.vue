<script setup>
import IDLTable from "@/components/IDLTable.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

const blogData = ref([]);
const dataLoading = ref(false);

const tableColumns = ref([
  {
    key: "name",
    title: "Name",
  },
]);

const fetchAllPages = () => {
  dataLoading.value = true;
  axios
    .get("/blogs")
    .then((res) => {
      dataLoading.value = false;
      blogData.value = res.data;
    })
    .catch((err) => {
      dataLoading.value = false;
      console.log(err);
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      }
      window.alert("Es ist ein Fehler aufgetreten, bitte versuche es erneut.");
    });
};

const deletePage = (id) => {
  if (!window.confirm("Sind Sie sicher, dass Sie diese Blogbeitrag löschen möchten?"))
    return;
  axios
    .delete(`/blogs/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(() => {
      fetchAllPages();
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      }
      window.alert(
        "Die Blogbeitrag konnte nicht gelöscht werden. Bitte versuche es erneut."
      );
    });
};

onMounted(() => {
  fetchAllPages();
});
</script>

<template>
  <main>
    <div class="row">
      <h1>Alle Beiträge</h1>
      <router-link to="/blog-erstellen" class="button-primary"
        >Beitrag hinzufügen</router-link
      >
    </div>
    <hr class="divider" />
    <IDLTable
      :tableData="blogData"
      :tableColumns="tableColumns"
      :loading="dataLoading"
    >
      <template #actions> Aktionen </template>
      <template #tableActions="slotProps">
        <RouterLink :to="`/blog-bearbeiten/${slotProps.row.id}`">
          <img src="@/assets/icons/edit.svg" width="20" />
        </RouterLink>
        <button @click="deletePage(slotProps.row.id)">
          <img src="@/assets/icons/delete.svg" width="20" />
        </button>
      </template>
    </IDLTable>
  </main>
</template>
