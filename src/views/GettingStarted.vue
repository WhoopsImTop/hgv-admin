<template>
  <div>
    <h1>Dashboard</h1>
    <hr class="divider" />
    <div class="content-row">
      <div class="col" v-if="role === 'admin'">
        <h2>Empfohlene Vorgehensweise</h2>
        <hr class="divider" />
        <ol>
          <li>
            <h3>Zuerst Zertifikate, Sprachen und Guides erstellen</h3>
            <p>
              Es ist ratsam, zuerst Guides und ihre Attribute anzulegen, da dies
              den Aufwand während der Tour-Erstellung verringert.
            </p>
            <div class="col" style="margin: 5px 0">
              <router-link
                style="display: inline-block"
                to="/guides"
                class="button-primary"
                >Guides</router-link
              >
            </div>
            <div class="col" style="margin: 5px 0">
              <router-link
                style="display: inline-block"
                to="/sprachen"
                class="button-primary"
                >Sprachen</router-link
              >
            </div>
            <div class="col" style="margin: 5px 0">
              <router-link
                style="display: inline-block"
                to="/zertifikate"
                class="button-primary"
                >Zertifikate</router-link
              >
            </div>
          </li>
          <li>
            <h3>Touren erstellen</h3>
            <p>
              Nachdem Sie Guides, Sprachen und Zertifikate erstellt und
              verknüpft haben, können Sie mit dem Anlegen der Touren beginnen.
              Wenn Sie während der Tour-Erstellung feststellen, dass Sie einen
              Guide oder ein Zertifikat vergessen haben, können Sie diese auch
              während des Vorgangs erstellen.
            </p>
            <div class="col" style="margin: 5px 0">
              <router-link
                style="display: inline-block"
                to="/touren"
                class="button-primary"
                >Touren</router-link
              >
            </div>
          </li>
        </ol>
      </div>
      <div class="col" v-else-if="role === 'moderator'">
        <h2>Empfohlene Vorgehensweise</h2>
        <hr class="divider" />
        <ol>
          <li>
            <h3>Zuerst Zertifikate, Sprachen und Guides erstellen</h3>
            <p>
              Es ist ratsam, zuerst Guides und ihre Attribute anzulegen, da dies
              den Aufwand während der Tour-Erstellung verringert.
            </p>
            <div class="col" style="margin: 5px 0">
              <router-link
                style="display: inline-block"
                to="/guides"
                class="button-primary"
                >Guides</router-link
              >
            </div>
            <div class="col" style="margin: 5px 0">
              <router-link
                style="display: inline-block"
                to="/sprachen"
                class="button-primary"
                >Sprachen</router-link
              >
            </div>
            <div class="col" style="margin: 5px 0">
              <router-link
                style="display: inline-block"
                to="/zertifikate"
                class="button-primary"
                >Zertifikate</router-link
              >
            </div>
          </li>
          <li>
            <h3>Touren erstellen</h3>
            <p>
              Nachdem Sie Guides, Sprachen und Zertifikate erstellt und
              verknüpft haben, können Sie mit dem Anlegen der Touren beginnen.
              Wenn Sie während der Tour-Erstellung feststellen, dass Sie einen
              Guide oder ein Zertifikat vergessen haben, können Sie diese auch
              während des Vorgangs erstellen.
            </p>
            <div class="col" style="margin: 5px 0">
              <router-link
                style="display: inline-block"
                to="/touren"
                class="button-primary"
                >Touren</router-link
              >
            </div>
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
const role = sessionStorage.getItem("role");
</script>

<style>
ol {
  padding-left: 20px;
}

li {
  margin-bottom: 30px;
  padding-left: 15px;
  position: relative;
}

/* draw lines from li to li */
li::before {
  content: "";
  position: absolute;
  top: -5px;
  left: -10px;
  border-left: 2px solid var(--secondary-color);
  height: 5%;
}

li::marker {
  color: var(--primary-color);
}

li::after {
  content: "";
  position: absolute;
  top: 30px;
  left: -10px;
  border-left: 2px solid var(--secondary-color);
  height: 90%;
}

li:first-child::before {
  display: none;
}

li h3 {
  margin-bottom: 10px;
}
</style>