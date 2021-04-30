import { Settings as LayoutSettings } from '@ant-design/pro-layout';


const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '交通银行软件园后台',
  pwa: false,
   logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  // logo: require("../src/assets/1111.svg"),
  
  
  iconfontUrl: '',
};

export default Settings;
