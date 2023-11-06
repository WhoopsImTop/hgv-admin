<script setup>
import IDLTable from "@/components/IDLTable.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

const mobilityData = ref([]);
const dataLoading = ref(false);

const tableColumns = ref([
  {
    key: "name",
    title: "Name",
  },
]);

const fetchAllMobilities = () => {
  dataLoading.value = true;
  axios
    .get("/mobility")
    .then((res) => {
      dataLoading.value = false;
      mobilityData.value = res.data.mobilities;
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

const deleteMobility = (id) => {
  axios
    .delete(`/mobility/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(() => {
      fetchAllMobilities();
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      }
      window.alert(
        "Die Mobilität konnte nicht gelöscht werden. Bitte versuche es erneut."
      );
    });
};

onMounted(() => {
  fetchAllMobilities();
});
</script>

<template>
  <main>
    <div class="row">
      <h1>Alle Mobilitäten</h1>
      <router-link to="/mobilitaet-erstellen" class="button-primary"
        >Mobilität hinzufügen</router-link
      >
    </div>
    <hr class="divider" />
    <IDLTable
      :tableData="mobilityData"
      :tableColumns="tableColumns"
      :loading="dataLoading"
    >
      <template #actions> Aktionen </template>
      <template #tableActions="slotProps">
        <RouterLink :to="`/mobilitaet-bearbeiten/${slotProps.row.id}`">
          <img src="@/assets/icons/edit.svg" width="20" />
        </RouterLink>
        <button @click="deleteMobility(slotProps.row.id)">
          <img src="@/assets/icons/delete.svg" width="20" />
        </button>
      </template>
    </IDLTable>
  </main>
</template>
