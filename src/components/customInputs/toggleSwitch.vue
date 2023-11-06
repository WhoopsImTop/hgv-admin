<template>
  <div>
    <h4 style="margin-bottom: 10px">{{ titel }}</h4>
    <div class="input-row">
      <span
        class="toggle-wrapper"
        role="checkbox"
        :aria-checked="value.toString()"
        tabindex="0"
        @click="toggle"
        @keydown.space.prevent="toggle"
      >
        <span class="toggle-background" :class="backgroundStyles" />
        <span class="toggle-indicator" :style="indicatorStyles" />
      </span>
      <span class="toggle-value">{{ value ? "Ja" : "Nein" }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
const props = defineProps({
  value: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String,
    default: "primary",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  titel: {
    type: String,
    default: "Titel",
  },
});

const emit = defineEmits(["input"]);

//computed backgroundStyles
const backgroundStyles = computed(() => {
  return {
    "bg-primary": props.value,
    "bg-secondary": !props.value,
  };
});

//computed indicatorStyles
const indicatorStyles = computed(() => {
  return {
    transform: props.value ? "translateX(14px)" : "translateX(0)",
  };
});

//toggle function
const toggle = () => {
  if (!props.disabled) {
    //emit input event
    emit("input", !props.value);
  }
};
</script>

<style>
.input-row {
  display: flex;
  align-items: center;
}

.toggle-value {
  margin-left: 10px;
}

.bg-primary {
  background-color: var(--primary-color);
}

.bg-secondary {
  background-color: var(--secondary-color);
}

.toggle-wrapper {
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: 32px;
  height: 18px;
  border-radius: 9999px;
}

.toggle-wrapper:focus {
  outline: 0;
}

.toggle-background {
  display: inline-block;
  border-radius: 9999px;
  height: 100%;
  width: 100%;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.4s ease;
}

.toggle-indicator {
  position: absolute;
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: #ffffff;
  border-radius: 9999px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.4s ease;
}
</style>