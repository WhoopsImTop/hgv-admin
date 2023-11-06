<script setup>
import IDLTable from "@/components/IDLTable.vue";
import { ref, onMounted } from "vue";
import axios from "axios";

const skillData = ref([]);
const dataLoading = ref(false);

const tableColumns = ref([
  {
    key: "name",
    title: "Name",
  },
]);

const fetchAllSkills = () => {
  dataLoading.value = true;
  axios
    .get("/skills")
    .then((res) => {
      dataLoading.value = false;
      skillData.value = res.data.skills;
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

const deleteSkill = (id) => {
  axios
    .delete(`/skills/${id}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    })
    .then(() => {
      fetchAllSkills();
    })
    .catch((err) => {
      console.log(err);
      if(err.response.status === 401) {
        sessionStorage.removeItem("token");
      }
      window.alert("Der Skill konnte nicht gelöscht werden. Bitte versuche es erneut.");
    });
};

onMounted(() => {
  fetchAllSkills();
});
</script>

<template>
  <main>
    <div class="row">
      <h1>Alle Skills</h1>
      <router-link to="/skill-erstellen" class="button-primary"
        >Skill hinzufügen</router-link
      >
    </div>
    <hr class="divider" />
    <IDLTable :tableData="skillData" :tableColumns="tableColumns" :loading="dataLoading">
      <template #actions> Aktionen </template>
      <template #tableActions="slotProps">
        <RouterLink :to="`/skill-bearbeiten/${slotProps.row.id}`">
          <img src="@/assets/icons/edit.svg" width="20" />
        </RouterLink>
        <button @click="deleteSkill(slotProps.row.id)">
          <img src="@/assets/icons/delete.svg" width="20" />
        </button>
      </template>
    </IDLTable>
  </main>
</template>
