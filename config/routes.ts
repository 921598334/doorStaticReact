export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    path: '/welcome',
    name: '欢迎',
    icon: 'smile',
    component: './Welcome',
  },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //   ],
  // },
  {
    name: '新闻列表',
    icon: 'table',
    path: '/newList/api/*',
    component: './BasicList',
  },
  {
    name: '软件列表',
    icon: 'crown',
    path: '/sorftwareList/api/*',
    component: './SorftwareList',
  },
  {
    name: '软件类型',
    icon: 'table',
    path: '/typeList/api/*',
    component: './TypeList',
  },



  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
