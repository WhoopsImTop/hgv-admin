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

const fetchAllGuides = () => {
  dataLoading.value = true;
  axios
    .get("/guides?per_page=200")
    .then((res) => {
      dataLoading.value = false;
      guideData.value = res.data.guides.data;
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

const deleteGuide = (id) => {
  if (!window.confirm("Willst du diesen Guide wirklich löschen?")) {
    return;
  }
  axios
    .delete(`/guides/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(() => {
      fetchAllGuides();
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      }
      window.alert(
        "Der Guide konnte nicht gelöscht werden. Bitte versuche es erneut."
      );
    });
};

onMounted(() => {
  fetchAllGuides();
});
</script>

<template>
  <main>
    <div class="row">
      <h1>Alle Guides</h1>
      <router-link to="/guide-erstellen" class="button-primary"
        >Guide hinzufügen</router-link
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
        <RouterLink :to="`/guide-bearbeiten/${slotProps.row.id}`">
          <img src="@/assets/icons/edit.svg" width="20" />
        </RouterLink>
        <button @click="deleteGuide(slotProps.row.id)">
          <img src="@/assets/icons/delete.svg" width="20" />
        </button>
      </template>
    </IDLTable>
  </main>
</template>
