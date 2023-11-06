<script setup>
import IDLTable from "@/components/IDLTable.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

const guideData = ref([]);
const dataLoading = ref(false);

const tableColumns = ref([
  {
    key: "name",
    title: "Name",
  },
]);

const fetchAllLanguages = () => {
  dataLoading.value = true;
  axios
    .get("/languages")
    .then((res) => {
      dataLoading.value = false;
      guideData.value = res.data.languages;
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

const deleteLanguage = (id) => {
  axios
    .delete(`/languages/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(() => {
      fetchAllLanguages();
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      }
      window.alert(
        "Die Sprache konnte nicht gelöscht werden. Bitte versuche es erneut."
      );
    });
};

onMounted(() => {
  fetchAllLanguages();
});
</script>

<template>
  <main>
    <div class="row">
      <h1>Alle Sprachen</h1>
      <router-link to="/sprache-erstellen" class="button-primary"
        >Sprache hinzufügen</router-link
      >
    </div>
    <hr class="divider" />
    <IDLTable
      :tableData="guideData"
      :tableColumns="tableColumns"
      :loading="dataLoading"
    >
      <template #actions> Aktionen </template>
      <template #tableActions="slotProps">
        <RouterLink :to="`/sprache-bearbeiten/${slotProps.row.id}`">
          <img src="@/assets/icons/edit.svg" width="20" />
        </RouterLink>
        <button @click="deleteLanguage(slotProps.row.id)">
          <img src="@/assets/icons/delete.svg" width="20" />
        </button>
      </template>
    </IDLTable>
  </main>
</template>
