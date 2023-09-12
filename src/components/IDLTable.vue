<script setup>
import { ref } from "vue";
const tableData = ref([
  {
    id: 1,
    name: "John",
    age: 24,
    address: "Berlin",
    tags: ["nice", "developer"],
  },
  {
    id: 2,
    name: "Jane",
    age: 22,
    address: "Berlin",
    tags: ["loser"],
  },
  {
    id: 3,
    name: "Susan",
    age: 28,
    address: "Berlin",
    tags: ["cool", "teacher"],
  },
]);
</script>

<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Alter</th>
          <th>Adresse</th>
          <th>Tags</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in tableData" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.age }}</td>
          <td>{{ item.address }}</td>
          <td>
            <span v-for="tag in item.tags" :key="tag">{{ tag }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
}

th, td {
  text-align: left;
  padding: 10px 15px;
}

tr:nth-child(even) {
  background-color: var(--vt-c-indigo);
}

th {
  background-color: var(--vt-c-black);
  color: white;
}
</style>
