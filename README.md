# WashCar MY

Expo / React Native 上门洗车应用，目前是可持久化的本地业务体验版。

## 启动

```sh
npm install
npm run web
npm run type-check
npm test
npm run build:web
```

Windows 构建较慢时：`npx expo export --platform web --max-workers 2`。

## 已实现

- 套餐详情、按车型计价、附加项目、首单优惠和六步预约。
- 车辆管理，地址添加/编辑/删除，GPS 权限与失败处理。
- 地址、备注、物业与钥匙交接信息随订单保存。
- 预约日期格式、营业时间、提前量、30 天预约范围及重复订单校验。
- 完整订单记录、状态时间线、取消、改期、再次预约及一次性评价。
- 洗车师在线状态、服务能力、接单及单任务限制。
- 到达、洗前记录、逐项服务确认、完成；重复完成不会重复计收入。
- 按订单留言，双方角色共享本地记录；按完成订单计算预计收入。
- Web localStorage / 原生 Expo 文件保存；存储失败会显示提示。

## 演示闭环

1. 进入顾客体验，选套餐、车辆、地址和预约时间，确认预约。
2. 切换洗车师，到待接订单接单。
3. 工作台依次出发、到达，保存洗前检查，开始清洗，勾选服务项目后完成。
4. 切回顾客，查看历史和时间线，评价或再次预约。
5. 刷新重新进入体验，订单、车辆、地址及留言仍保留。

## 上线前仍需接入

当前没有真实账号认证、服务器派单、跨设备同步、支付扣款/退款、短信推送、真实师傅轨迹、照片上传或管理后台。界面已明确本地体验，不能直接用于真实运营。

支付目前只记录服务后付款，绝不将订单显示为已收款；收入是预计值，无提现。角色切换是演示功能，不是权限认证。样例车辆、地址和师傅资料来自原项目种子数据。

`supabase_schema.sql` 仅为未部署的数据库草案：已删除匿名全表写入策略，订单只能由用户读取自己的记录。正式服务需实现可信服务端计价、事务接单、状态变更授权和支付回调，再接入经过认证的客户端。不要把 service-role 密钥放到 Expo 公共环境变量中。

新增核心界面使用中文；原有预约界面保留英文，完整三语翻译仍待补齐。当前已验证 Web 类型与业务规则；iOS/Android 需要真机验证。

## 本次验证记录

- `npm run type-check` 通过。
- `npm test` 通过：车型价格、预约有效期/营业时间、非法日期、状态顺序、取消限制、重复完成幂等性。
- Web 静态导出成功。
- 浏览器完成首单 RM45 下单、师傅接单/出发/到达、缺失检查阻断、洗前记录、清单完成、收入 RM34.40、五星评价，以及刷新恢复。
- 浏览器完成再次预约 RM50、改期到 2026-09-29 10:00、取消并保存原因。
- 手机窄屏入口布局已检查；原生平台尚未真机测试。

本地预览：先构建，再运行 `node scripts/preview.cjs`，访问 http://127.0.0.1:4173。


## Google 地图首页

首页已切换为 Google Maps，不再使用 Leaflet / OpenStreetMap。

未配置 Key 时显示 Google 地图浏览 iframe。可浏览缩放，但 iframe 内移动的位置不会回传订单；上门地址须通过常用地址、GPS 或手动填写确认。未配置 Key 时 Google 地址搜索不可用。

配置交互地图：

1. 在 Google Cloud 项目中启用 Maps JavaScript API 和 Geocoding API，配置所需计费。
2. 创建浏览器 API Key，设置 HTTP referrer 网站限制和 API 限制。开发预览允许 `http://127.0.0.1:4173/*`、`http://localhost:4173/*`；上线仅允许自己的域名。
3. 在根目录 `.env.local` 设置 `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=你的浏览器Key`。不要提交 `.env.local`，不要放服务端密钥。
4. 重新执行 `npm run build:web`，刷新页面。Expo 公共环境变量在构建时注入。

配置后首页通过 Maps JavaScript API 提供拖动、点击选点和缩放；地址搜索与逆地理编码使用 Google Geocoder，精确停车坐标会保留。搜索按马来西亚地区过滤，目前为地址查询，不是 Places 商户自动补全。

原生版使用现有外部 Google Maps 入口；Web 交互 SDK 不等于原生 Google Maps SDK。

目前仅验证无 Key 浏览模式、类型检查及 Google 地址适配器模拟测试。需要有效 Key 后才能验证真实 SDK 加载、权限限制和地址搜索。

官方配置说明：https://developers.google.com/maps/documentation/javascript/get-api-key
