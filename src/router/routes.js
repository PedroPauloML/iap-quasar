const site_name = "Portal IAP Paulo Afonso";

const routes = [
  // AUTHENTICATION
  // { name: "login", path: "/login", component: Login },
  {
    name: "confirmation_email",
    path: "/confirmation_email",
    component: () => import("../pages/authentication/confirmation_email"),
    meta: { title: `E-mail de confirmação de conta enviado | ${site_name}` }
  },
  {
    name: "confirm_account",
    path: "/confirm_account",
    component: () => import("../pages/authentication/confirm_account"),
    meta: { title: `Confirmação de e-mail | ${site_name}` }
  },
  {
    name: "password_recover_request",
    path: "/password_recover_request",
    component: () => import("../pages/authentication/password_recover_request"),
    meta: { title: `Solicitar recuperação de senha | ${site_name}` }
  },
  {
    name: "recover_password",
    path: "/recover_password",
    component: () => import("../pages/authentication/recover_password"),
    meta: { title: `Recuperar senha | ${site_name}` }
  },

  // HOME
  {
    path: "/",
    component: () => import("../layouts/MainLayout"),
    children: [
      {
        name: "home",
        path: "",
        component: () => import("../pages/home/index"),
        meta: { title: `Início | ${site_name}` }
      },

      // NEWS
      {
        path: "/news",
        component: () => import("../pages/news/layout"),
        meta: { title: `Notícias | ${site_name}` },
        children: [
          {
            name: "news",
            path: "",
            component: () => import("../pages/news/index"),
            meta: { title: `Notícias | ${site_name}` }
          },
          {
            name: "news_new",
            path: "/news/new",
            component: () => import("../pages/news/new"),
            meta: { title: `Nova Notícia | ${site_name}` }
          },
          {
            name: "news_show",
            path: "/news/:id",
            component: () => import("../pages/news/show"),
            meta: { title: `Notícias | ${site_name}` }
          },
          {
            name: "news_edit",
            path: "/news/:id/edit",
            component: () => import("../pages/news/edit"),
            meta: { title: `Editando Notícia | ${site_name}` }
          }
        ]
      },

      // VERSE OF DAY
      {
        path: "/verses_of_day",
        component: () => import("../pages/verse_of_day/layout"),
        children: [
          {
            name: "verses_of_day",
            path: "",
            component: () => import("../pages/verse_of_day/index"),
            meta: { title: `Versículos do dia | ${site_name}` }
          },
          {
            name: "verse_of_day",
            path: "/verses_of_day/:id",
            component: () => import("../pages/verse_of_day/show"),
            meta: { title: `Versículos do dia | ${site_name}` }
          }
        ]
      },

      // MESSAGES
      {
        path: "/messages",
        component: () => import("../pages/messages/layout"),
        children: [
          {
            name: "messages",
            path: "",
            component: () => import("../pages/messages/index"),
            meta: { title: `Mensagens | ${site_name}` }
          },
          {
            name: "messages_new",
            path: "/messages/new",
            component: () => import("../pages/messages/new"),
            meta: { title: `Nova Mensagem | ${site_name}` }
          },
          {
            name: "messages_show",
            path: "/messages/:id",
            component: () => import("../pages/messages/show"),
            meta: { title: `Mensagens | ${site_name}` }
          },
          {
            name: "messages_edit",
            path: "/messages/:id/edit",
            component: () => import("../pages/messages/edit"),
            meta: { title: `Editando Mensagem | ${site_name}` }
          }
        ]
      },

      // SCHEDULES
      {
        path: "/schedules",
        component: () => import("../pages/schedules/layout"),
        children: [
          {
            name: "schedules",
            path: "",
            component: () => import("../pages/schedules/index"),
            meta: { title: `Agendas | ${site_name}` }
          },
          {
            name: "schedules_new",
            path: "/schedules/new",
            component: () => import("../pages/schedules/new"),
            meta: { title: `Nova Agenda | ${site_name}` }
          },
          {
            name: "schedules_show",
            path: "/schedules/:id",
            component: () => import("../pages/schedules/show"),
            meta: { title: `Agendas | ${site_name}` }
          },
          {
            name: "schedules_edit",
            path: "/schedules/:id/edit",
            component: () => import("../pages/schedules/edit"),
            meta: { title: `Editando Agenda | ${site_name}` }
          }
        ]
      },

      // CONTACT
      {
        name: "contact",
        path: "/contact",
        component: () => import("../pages/contact/index"),
        meta: { title: `Contato | ${site_name}` }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    name: "404",
    component: () => import("pages/Error404.vue")
  }
];

export default routes;
