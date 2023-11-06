<script setup>
import IDLTable from "@/components/IDLTable.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

const placeData = ref([]);
const dataLoading = ref(false);

const tableColumns = ref([
  {
    key: "name",
    title: "Name",
  },
]);

const fetchAllOrte = () => {
  dataLoading.value = true;
  axios
    .get("/places")
    .then((res) => {
      dataLoading.value = false;
      placeData.value = res.data.places;
    })
    .catch((err) => {
      dataLoading.value = false;
      console.log(err);
      if(err.response.status === 401) {
        sessionStorage.removeItem("token");
      }
      window.alert("Es ist ein Fehler aufgetreten, bitte versuche es erneut.");
    });
};

const deleteOrt = (id) => {
  axios
    .delete(`/places/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(() => {
      fetchAllOrte();
    })
    .catch((err) => {
      console.log(err);
      if(err.response.status === 401) {
        sessionStorage.removeItem("token");
      }
      window.alert("Der Ort konnte nicht gelöscht werden. Bitte versuche es erneut.");
    });
};

onMounted(() => {
  fetchAllOrte();
});
</script>

<template>
  <main>
    <div class="row">
      <h1>Alle Orte</h1>
      <router-link to="/ort-erstellen" class="button-primary"
        >Ort hinzufügen</router-link
      >
    </div>
    <hr class="divider" />
    <IDLTable :tableData="placeData" :tableColumns="tableColumns" :loading="dataLoading">
      <template #actions> Aktionen </template>
      <template #tableActions="slotProps">
        <RouterLink :to="`/ort-bearbeiten/${slotProps.row.id}`">
          <img src="@/assets/icons/edit.svg" width="20" />
        </RouterLink>
        <button @click="deleteOrt(slotProps.row.id)">
          <img src="@/assets/icons/delete.svg" width="20" />
        </button>
      </template>
    </IDLTable>
  </main>
</template>
