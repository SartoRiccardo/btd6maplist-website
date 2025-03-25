export default [
  {
    href: "/config",
    matcher: "/config.*",
    requires: ["edit:config"],
    label: "List Configuration",
    show: true,
  },
  {
    href: "/completions/pending",
    matcher: "/completions/.*",
    requires: ["edit:completion", "delete:completion"],
    label: "Pending Completions",
    show: true,
  },
  {
    href: "/maps/hidden",
    matcher: "/maps/hidden",
    requires: ["edit:map", "delete:map"],
    label: "Legacy List",
    show: true,
  },
  {
    href: "/map-submissions",
    matcher: "/map-submissions",
    requires: ["create:map", "edit:map", "delete:map_submission"],
    label: "Map Submissions",
    show: true,
  },
  {
    href: "/roles",
    matcher: "/roles",
    requires: ["edit:achievement_roles"],
    label: "Roles",
    show: true,
  },
  {
    matcher: "/map/add.*",
    requires: ["create:map"],
  },
  {
    matcher: "/map/.+?/edit",
    requires: ["edit:map", "delete:map"],
  },
  {
    href: "/user/add",
    matcher: "/user/add.*",
    requires: ["create:user"],
    label: "Register User",
    show: true,
  },
];
