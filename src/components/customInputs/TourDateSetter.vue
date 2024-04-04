<template>
  <div class="date-picker">
    <h5>Tour Termine</h5>
    <div v-if="dates.length > 0" class="date-picker-container">
      <div v-for="date in dates" :key="date.id" class="date-picker-item">
        <label for="date">{{
          new Date(date.date).toLocaleDateString("de-DE")
        }}</label>
        <div class="date-picker-actions">
          <div @click="EditDateEntry(date)">
            <img src="/src/assets/icons/edit.svg" width="20" height="20" />
          </div>
          <div @click="RemoveDateEntry(date)">
            <img src="/src/assets/icons/delete.svg" width="20" height="20" />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="date-picker-container">
      <div class="date-picker-item">
        <label for="date">Keine Termine angelegt</label>
      </div>
    </div>
    <div v-if="addDate" class="date-picker-add">
      <input type="date" v-model="date" />
      <button class="button-primary" @click="addDateEntry()">Speichern</button>
      <button
        class="button-primary"
        @click="(addDate = false), (isEditing = false)"
      >
        Abbrechen
      </button>
    </div>
    <button class="button-primary" @click="addDate = true" :disabled="addDate">
      Termin hinzufügen
    </button>
  </div>
</template>

<script>
import Edit from "../../views/Touren/Edit.vue";
import axios from "axios";

export default {
  default: {
    name: "TourDateSetter",
    props: {
      dates: {
        type: String,
        required: true,
        default: [],
      },
    },
  },
  data() {
    return {
      dates: [],
      date: "",
      addDate: false,
      isEditing: false,
      editingId: null,
      tourId: parseInt(this.$route.params.id),
    };
  },
  methods: {
    addDateEntry() {
      if (this.isEditing) {
        axios
          .put(
            `/tour_dates/${this.editingId}`,
            { date: this.date },
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
            }
          )
          .then((response) => {
            //find by id and update
            const index = this.dates.findIndex((d) => d.id === this.editingId);
            console.log(index);
            this.dates[index].date = this.date;
            this.isEditing = false;
            this.date = "";
            this.addDate = false;
            //force re-render
            this.$forceUpdate();
          })
          .catch((error) => {
            if (error.response.status === 401) {
              //remove token and redirect to login
              window.alert(
                "Sitzung abgelaufen. Bitte melden Sie sich erneut an."
              );
              sessionStorage.removeItem("token");
              window.location.reload();
            }
          });
      } else {
        axios
          .post(
            "/tour_dates",
            { date: this.date, tour_id: this.tourId },
            {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
              },
            }
          )
          .then((response) => {
            this.dates.push({
              id: response.data.id,
              date: response.data.date,
            });
            this.date = "";
            this.addDate = false;
          })
          .catch((error) => {
            if (error.response.status === 401) {
              //remove token and redirect to login
              window.alert(
                "Sitzung abgelaufen. Bitte melden Sie sich erneut an."
              );
              sessionStorage.removeItem("token");
              window.location.reload();
            }
          });
      }
    },
    EditDateEntry(date) {
      this.isEditing = true;
      this.addDate = true;
      this.date = date.date;
      this.editingId = date.id;
    },
    RemoveDateEntry(date) {
      axios
        .delete(`/tour_dates/${date.id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          this.dates = this.dates.filter((d) => d.id !== date.id);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            //remove token and redirect to login
            window.alert(
              "Sitzung abgelaufen. Bitte melden Sie sich erneut an."
            );
            sessionStorage.removeItem("token");
            window.location.reload();
          }
        });
    },
  },
  mounted() {
    axios
      .get(`/tour_dates/${this.tourId}`)
      .then((response) => {
        this.dates = response.data.tour_dates;
      })
      .catch((error) => {
        if (error.response.status === 401) {
          //remove token and redirect to login
          window.alert("Sitzung abgelaufen. Bitte melden Sie sich erneut an.");
          sessionStorage.removeItem("token");
          window.location.reload();
        }
      });
  },
};
</script>

<style>
.date-picker {
  display: flex;
  flex-direction: column;
}

.date-picker-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e0e0e0;
}

.date-picker-container {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  margin-bottom: 15px;
}

.date-picker-add {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  gap: 16px;
}

.date-picker-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.button-primary:disabled {
  background-color: #e0e0e0;
  color: #fff;
  cursor: not-allowed;
}
</style>
