<script setup>
import IDLTable from "@/components/IDLTable.vue";
import { onMounted, ref } from "vue";
import axios from "axios";

const tableData = ref([]);
const dataLoading = ref(false);

const tableColumns = ref([
  {
    key: "name",
    title: "Name",
  },
  {
    key: "status",
    title: "Status",
  },
  {
    key: "is_public",
    title: "Öffentliche Tour",
  },
  {
    key: "updated_at",
    title: "zuletzt aktualisiert",
  },
]);

const fetchAllTours = () => {
  dataLoading.value = true;
  axios
    .get("/tours?preview=true&per_page=200&status=all")
    .then((res) => {
      dataLoading.value = false;
      if (sessionStorage.getItem("role") === "moderator") {
        tableData.value = res.data.tours.data.filter(
          (tour) => tour.is_public == 1
        );
      } else {
        tableData.value = res.data.tours.data;
      }
    })
    .catch((err) => {
      dataLoading.value = false;
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        console.log(err);
        window.alert(
          "Es ist ein Fehler aufgetreten, bitte versuche es erneut."
        );
      }
    });
};

const deleteTour = (id) => {
  const tourName = tableData.value.find((tour) => tour.id === id).name;
  if (!window.confirm(`Möchtest du die Tour "${tourName}" wirklich löschen?`))
    return;
  axios
    .delete(`/tours/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      console.log(res);
      fetchAllTours();
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      } else {
        console.log(err);
        window.alert(
          "Die Tour konnte nicht gelöscht werden. Bitte versuche es erneut."
        );
      }
    });
};

onMounted(() => {
  fetchAllTours();
});
</script>

<template>
  <main>
    <div class="row">
      <h1>Alle Touren</h1>
      <router-link to="/tour-erstellen" class="button-primary"
        >Tour hinzufügen</router-link
      >
    </div>
    <hr class="divider" />
    <IDLTable
      :tableData="tableData"
      :tableColumns="tableColumns"
      :loading="dataLoading"
    >
      <template #actions> Aktionen </template>
      <template #tableActions="slotProps">
        <RouterLink :to="`/tour-bearbeiten/${slotProps.row.id}`">
          <img src="@/assets/icons/edit.svg" width="20" />
        </RouterLink>
        <button @click="deleteTour(slotProps.row.id)">
          <img src="@/assets/icons/delete.svg" width="20" />
        </button>
      </template>
    </IDLTable>
  </main>
</template>
