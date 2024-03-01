<script setup>
import IDLTable from "@/components/IDLTable.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

const KategorieData = ref([]);
const dataLoading = ref(false);

const tableColumns = ref([
  {
    key: "name",
    title: "Name",
  },
]);

const fetchAllKategorien = () => {
  dataLoading.value = true;
  axios
    .get("/themes")
    .then((res) => {
      dataLoading.value = false;
      KategorieData.value = res.data.themes;
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

const deleteKategorie = (id) => {
  const kategorieName = KategorieData.value.find(
    (kategorie) => kategorie.id === id
  ).name;
  if (!window.confirm(`Möchtest du die Kategorie "${kategorieName}" wirklich löschen?`))
    return;
  axios
    .delete(`/themes/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(() => {
      fetchAllKategorien();
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      }
      window.alert(
        "Die Kategorie konnte nicht gelöscht werden. Bitte versuche es erneut."
      );
    });
};

onMounted(() => {
  fetchAllKategorien();
});
</script>

<template>
  <main>
    <div class="row">
      <h1>Alle Kategorien</h1>
      <router-link to="/kategorie-erstellen" class="button-primary"
        >Kategorie hinzufügen</router-link
      >
    </div>
    <hr class="divider" />
    <IDLTable
      :tableData="KategorieData"
      :tableColumns="tableColumns"
      :loading="dataLoading"
    >
      <template #actions> Aktionen </template>
      <template #tableActions="slotProps">
        <RouterLink :to="`/kategorie-bearbeiten/${slotProps.row.id}`">
          <img src="@/assets/icons/edit.svg" width="20" />
        </RouterLink>
        <button @click="deleteKategorie(slotProps.row.id)">
          <img src="@/assets/icons/delete.svg" width="20" />
        </button>
      </template>
    </IDLTable>
  </main>
</template>
