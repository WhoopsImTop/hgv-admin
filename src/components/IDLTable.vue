<script setup>
import { ref, computed } from "vue";
import toggleSwitch from "./customInputs/toggleSwitch.vue";

const props = defineProps({
  tableData: {
    type: Array,
    required: true,
  },
  tableColumns: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const search = ref("");
const showOnlyPublic = ref(false);

const filteredTableData = computed(() => {
  return props.tableData.filter((row) => {
    const searchMatch = Object.values(row).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(search.value.toLowerCase());
      }
      return false;
    });
    if (showOnlyPublic.value) {
      return searchMatch && row.is_public;
    }
    return searchMatch;
  });
});

const translateKeyValue = (keyValue) => {
  if (typeof keyValue === "boolean") {
    return keyValue ? "Ja" : "Nein";
  } else if (typeof keyValue === "number") {
    return keyValue === 0 ? "Nein" : "Ja";
  } else if (new Date(keyValue).getTime() > 0) {
    console.log(keyValue);
    const date = new Date(keyValue).toLocaleString("de-DE");
    return date;
  } else if (keyValue === "draft") {
    return "Entwurf";
  } else if (keyValue === "published") {
    return "Veröffentlicht";
  }
  return keyValue;
};

const hasPublicTours = computed(() => {
  return props.tableData.some((tour) => tour.is_public);
});
</script>

<template>
  <div>
    <div class="input-container">
      <input type="search" v-model="search" placeholder="Suche" />
    </div>

    <div v-if="hasPublicTours" style="margin: 10px 0 20px">
      <toggle-switch
        :value="showOnlyPublic"
        titel="Zeige nur öffentliche Touren"
        @input="showOnlyPublic = $event"
      />
    </div>

    <table>
      <thead>
        <tr>
          <th v-for="column in tableColumns" :key="column.key">
            {{ column.title }}
          </th>
          <th class="align-end"><slot name="actions" /></th>
        </tr>
      </thead>
      <tbody v-if="filteredTableData.length > 0">
        <tr v-for="row in filteredTableData" :key="row.id">
          <td v-for="column in tableColumns" :key="column.key">
            {{ translateKeyValue(row[column.key]) }}
          </td>
          <td class="align-end"><slot name="tableActions" :row="row" /></td>
        </tr>
      </tbody>
      <tbody v-else-if="loading">
        <tr>
          <td :colspan="tableColumns.length + 1">
            <span class="loader"></span>Lade Daten...
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td :colspan="filteredTableData.length + 1">Keine Daten vorhanden</td>
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

th,
td {
  text-align: left;
  padding: 15px 15px;
}

tr:not(:last-child) {
  border-bottom: 1px solid var(--primary-color);
}

th {
  color: var(--primary-color);
  background: var(--secondary-color);
  border-bottom: 1px solid var(--primary-color);
  font-weight: bold;
}

.align-end {
  text-align: right;
}

.loader {
  border: 2px solid #f3f3f3;
  border-radius: 50%;
  border-top: 2px solid var(--primary-color);
  width: 20px;
  height: 20px;
  animation: spin 2s linear infinite;
  display: inline-block;
  margin-right: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
