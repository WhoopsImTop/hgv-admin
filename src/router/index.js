import { createRouter, createWebHistory } from "vue-router";
import TourOverview from "../views/Touren/Overview.vue";
import TourCreate from "../views/Touren/Create.vue";
import TourEdit from "../views/Touren/Edit.vue";

import GuideOverview from "../views/Guides/Overview.vue";
import GuideCreate from "../views/Guides/Create.vue";
import GuideEdit from "../views/Guides/Edit.vue";

import SprachenOverview from "../views/Sprachen/Overview.vue";
import SprachenCreate from "../views/Sprachen/Create.vue";
import SprachenEdit from "../views/Sprachen/Edit.vue";

import MobilitätOverview from "../views/Mobilitaet/Overview.vue";
import MobilitätCreate from "../views/Mobilitaet/Create.vue";
import MobilitätEdit from "../views/Mobilitaet/Edit.vue";

import OrteOverview from "../views/Ort/Overview.vue";
import OrtCreate from "../views/Ort/Create.vue";
import OrtEdit from "../views/Ort/Edit.vue";

import KategorieOverview from "../views/Kategorien/Overview.vue";
import KategorieCreate from "../views/Kategorien/Create.vue";
import KategorieEdit from "../views/Kategorien/Edit.vue";

import ZertifikatOverview from "../views/Zertifikate/Overview.vue";
import ZertifikatCreate from "../views/Zertifikate/Create.vue";
import ZertifikatEdit from "../views/Zertifikate/Edit.vue";

import SkillOverview from "../views/Skills/Overview.vue";
import SkillCreate from "../views/Skills/Create.vue";
import SkillEdit from "../views/Skills/Edit.vue";

import VerwaltungOverview from "../views/Verwaltung/Overview.vue";
import VerwaltungCreate from "../views/Verwaltung/Create.vue";
import VerwaltungEdit from "../views/Verwaltung/Edit.vue";

import PageOverview from "../views/Pages/Overview.vue";
import PageCreate from "../views/Pages/Create.vue";
import PageEdit from "../views/Pages/Edit.vue";

import BlogOverview from "../views/Blog/Overview.vue";
import BlogCreate from "../views/Blog/Create.vue";
import BlogEdit from "../views/Blog/Edit.vue";

import GettingStarted from "../views/GettingStarted.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "getting-started",
      component: GettingStarted,
    },
    {
      path: "/touren",
      name: "home",
      component: TourOverview,
    },
    {
      path: "/tour-erstellen",
      name: "touren",
      component: TourCreate,
    },
    {
      path: "/tour-bearbeiten/:id",
      name: "tour-bearbeiten",
      component: TourEdit,
    },
    {
      path: "/guides",
      name: "guides",
      component: GuideOverview,
    },
    {
      path: "/guide-erstellen",
      name: "guide-erstellen",
      component: GuideCreate,
    },
    {
      path: "/guide-bearbeiten/:id",
      name: "guide-bearbeiten",
      component: GuideEdit,
    },
    {
      path: "/sprachen",
      name: "sprachen",
      component: SprachenOverview,
    },
    {
      path: "/sprache-erstellen",
      name: "sprache-erstellen",
      component: SprachenCreate,
    },
    {
      path: "/sprache-bearbeiten/:id",
      name: "sprache-bearbeiten",
      component: SprachenEdit,
    },
    {
      path: "/mobilitaet",
      name: "mobilität",
      component: MobilitätOverview,
    },
    {
      path: "/mobilitaet-erstellen",
      name: "mobilitaet-erstellen",
      component: MobilitätCreate,
    },
    {
      path: "/mobilitaet-bearbeiten/:id",
      name: "mobilitaet-bearbeiten",
      component: MobilitätEdit,
    },
    {
      path: "/orte",
      name: "orte",
      component: OrteOverview,
    },
    {
      path: "/ort-erstellen",
      name: "ort-erstellen",
      component: OrtCreate,
    },
    {
      path: "/ort-bearbeiten/:id",
      name: "ort-bearbeiten",
      component: OrtEdit,
    },
    {
      path: "/kategorien",
      name: "kategorien",
      component: KategorieOverview,
    },
    {
      path: "/kategorie-erstellen",
      name: "kategorie-erstellen",
      component: KategorieCreate,
    },
    {
      path: "/kategorie-bearbeiten/:id",
      name: "kategorie-bearbeiten",
      component: KategorieEdit,
    },
    {
      path: "/zertifikate",
      name: "zertifikate",
      component: ZertifikatOverview,
    },
    {
      path: "/zertifikat-erstellen",
      name: "zertifikat-erstellen",
      component: ZertifikatCreate,
    },
    {
      path: "/zertifikat-bearbeiten/:id",
      name: "zertifikat-bearbeiten",
      component: ZertifikatEdit,
    },
    {
      path: "/skills",
      name: "skills",
      component: SkillOverview,
    },
    {
      path: "/skill-erstellen",
      name: "skill-erstellen",
      component: SkillCreate,
    },
    {
      path: "/skill-bearbeiten/:id",
      name: "skill-bearbeiten",
      component: SkillEdit,
    },
    {
      path: "/verwaltung",
      name: "verwaltung",
      component: VerwaltungOverview,
    },
    {
      path: "/verwaltung-erstellen",
      name: "verwaltung-erstellen",
      component: VerwaltungCreate,
    },
    {
      path: "/verwaltung-bearbeiten/:id",
      name: "verwaltung-bearbeiten",
      component: VerwaltungEdit,
    },
    {
      path: "/pages",
      name: "pages",
      component: PageOverview,
    },
    {
      path: "/page-erstellen",
      name: "page-erstellen",
      component: PageCreate,
    },
    {
      path: "/page-bearbeiten/:id",
      name: "page-bearbeiten",
      component: PageEdit,
    },
    {
      path: "/blog",
      name: "blog",
      component: BlogOverview,
    },
    {
      path: "/blog-erstellen",
      name: "blog-erstellen",
      component: BlogCreate,
    },
    {
      path: "/blog-bearbeiten/:id",
      name: "blog-bearbeiten",
      component: BlogEdit,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    // always scroll to top
    return { top: 0 };
  },
});

export default router;
