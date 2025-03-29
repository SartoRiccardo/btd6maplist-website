export const protectedRoutes = [
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
    href: "/hidden-maps",
    matcher: "/hidden-maps",
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

export const listRoutes = [
  { href: "/maplist", dependsOn: [1, 2], name: "The Maplist" },
  { href: "/expert-list", dependsOn: [51], name: "Expert List" },
  { href: "/best-of-the-best", dependsOn: [52], name: "Best of the Best" },
  { href: "/nostalgia-pack", dependsOn: [11], name: "Nostalgia Pack" },
];
