import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://woshishabii.github.io/',
  lang: 'zh-CN',
  title: '星雨镇',
  author: {
    name: '星雨',
    avatar: 'https://woshishabi.vercel.app/avatar.jpg',
  },
  description: '一个人的记录',
  subtitle: '星光照亮黑夜，雨滴滋润大地',
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/woshishabii',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: '网易云音乐',
      link: 'https://music.163.com/#/user/home?id=3233925346',
      icon: 'i-ri-netease-cloud-music-line',
      color: '#C20C0C',
    },
    {
      name: '哔哩哔哩',
      link: '521394897',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },
    {
      name: 'Twitter',
      link: 'https://twitter.com/woshiahabi60923',
      icon: 'i-ri-twitter-line',
      color: '#1da1f2',
    },
  ],

  search: {
    enable: true,
  },

  sponsor: {
    enable: true,
    title: '我很可爱，请给我钱！',
    methods: [
      {
        name: '爱发电',
        url: 'https://afdian.net/a/woshishabi',
        color: '#00A3EE',
        icon: 'i-ri-paypal-line',
      },
    ],
  },
})
