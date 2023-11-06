<script setup>
import IDLTable from "@/components/IDLTable.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

const certificateData = ref([]);
const dataLoading = ref(false);

const tableColumns = ref([
  {
    key: "name",
    title: "Name",
  },
]);

const fetchAllCertificates = () => {
  dataLoading.value = true;
  axios
    .get("/certificates")
    .then((res) => {
      dataLoading.value = false;
      certificateData.value = res.data.certificates;
    })
    .catch((err) => {
      dataLoading.value = false;
      console.log(err);
      window.alert("Es ist ein Fehler aufgetreten, bitte versuche es erneut.");
    });
};

const deleteCertificate = (id) => {
  axios
    .delete(`/certificates/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(() => {
      fetchAllCertificates();
    })
    .catch((err) => {
      console.log(err);
      if(err.response.status === 401) {
        sessionStorage.removeItem("token");
      }
      window.alert(
        "Das Zertifikat konnte nicht gelöscht werden. Bitte versuche es erneut."
      );
    });
};

onMounted(() => {
  fetchAllCertificates();
});
</script>

<template>
  <main>
    <div class="row">
      <h1>Alle Zertifikate</h1>
      <router-link to="/zertifikat-erstellen" class="button-primary"
        >Zertifikat hinzufügen</router-link
      >
    </div>
    <hr class="divider" />
    <IDLTable
      :tableData="certificateData"
      :tableColumns="tableColumns"
      :loading="dataLoading"
    >
      <template #actions> Aktionen </template>
      <template #tableActions="slotProps">
        <RouterLink :to="`/zertifikat-bearbeiten/${slotProps.row.id}`">
          <img src="@/assets/icons/edit.svg" width="20" />
        </RouterLink>
        <button @click="deleteCertificate(slotProps.row.id)">
          <img src="@/assets/icons/delete.svg" width="20" />
        </button>
      </template>
    </IDLTable>
  </main>
</template>
