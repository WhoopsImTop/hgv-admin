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
    key: "updated_at",
    title: "zuletzt aktualisiert",
  },
]);

const fetchAllUsers = () => {
  dataLoading.value = true;
  axios
    .get("/users", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then((res) => {
      dataLoading.value = false;
      tableData.value = res.data.users;
    })
    .catch((err) => {
      dataLoading.value = false;
      console.log(err);
      window.alert("Es ist ein Fehler aufgetreten, bitte versuche es erneut.");
    });
};

const deleteUser = (id) => {
  axios
    .delete(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(() => {
      fetchAllUsers();
    })
    .catch((err) => {
      console.log(err);
      if (err.response.status === 401) {
        sessionStorage.removeItem("token");
      }
      window.alert(
        "Der Benutzer konnte nicht gelöscht werden. Bitte versuche es erneut."
      );
    });
};

onMounted(() => {
  fetchAllUsers();
});
</script>

<template>
  <main>
    <div class="row">
      <h1>Alle Benutzer</h1>
      <router-link to="/verwaltung-erstellen" class="button-primary"
        >Benutzer hinzufügen</router-link
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
        <RouterLink :to="`/verwaltung-bearbeiten/${slotProps.row.id}`">
          <img src="@/assets/icons/edit.svg" width="20" />
        </RouterLink>
        <button @click="deleteUser(slotProps.row.id)">
          <img src="@/assets/icons/delete.svg" width="20" />
        </button>
      </template>
    </IDLTable>
  </main>
</template>
