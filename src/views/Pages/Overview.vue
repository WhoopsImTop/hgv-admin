<script setup>
import IDLTable from "@/components/IDLTable.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

const pageData = ref([]);
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
    .get("/pages")
    .then((res) => {
      dataLoading.value = false;
      pageData.value = res.data;
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
  if (!window.confirm("Sind Sie sicher, dass Sie diese Seite löschen möchten?"))
    return;
  axios
    .delete(`/pages/${id}`, {
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
        "Die Seite konnte nicht gelöscht werden. Bitte versuche es erneut."
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
      <h1>Alle Seiten</h1>
      <router-link to="/page-erstellen" class="button-primary"
        >Seite hinzufügen</router-link
      >
    </div>
    <hr class="divider" />
    <IDLTable
      :tableData="pageData"
      :tableColumns="tableColumns"
      :loading="dataLoading"
    >
      <template #actions> Aktionen </template>
      <template #tableActions="slotProps">
        <RouterLink :to="`/page-bearbeiten/${slotProps.row.id}`">
          <img src="@/assets/icons/edit.svg" width="20" />
        </RouterLink>
        <button @click="deletePage(slotProps.row.id)">
          <img src="@/assets/icons/delete.svg" width="20" />
        </button>
      </template>
    </IDLTable>
  </main>
</template>
